#!/usr/bin/env python3
"""
Setup script for Django OAuth2 Backend
This script helps with initial project setup and configuration.
"""

import os
import secrets
import subprocess
import sys
from pathlib import Path


def run_command(command, check=True):
    """Run a shell command."""
    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e}")
        return None


def generate_secret_key():
    """Generate a secure secret key."""
    return secrets.token_urlsafe(50)


def create_env_file():
    """Create .env file from template."""
    env_example = Path("env.example")
    env_file = Path(".env")
    
    if env_file.exists():
        print(".env file already exists. Skipping creation.")
        return
    
    if not env_example.exists():
        print("env.example not found. Creating basic .env file...")
        secret_key = generate_secret_key()
        env_content = f"""# Django Settings
SECRET_KEY={secret_key}
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Sentry Configuration (optional)
SENTRY_DSN=

# Google OAuth2 Settings
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/accounts/google/login/callback/
"""
        env_file.write_text(env_content)
    else:
        # Copy from example and replace secret key
        content = env_example.read_text()
        secret_key = generate_secret_key()
        content = content.replace("your-secret-key-here", secret_key)
        env_file.write_text(content)
    
    print("✅ Created .env file with generated secret key")


def install_dependencies():
    """Install project dependencies using uv."""
    print("Installing dependencies with uv...")
    result = run_command("uv sync")
    if result and result.returncode == 0:
        print("✅ Dependencies installed successfully")
        return True
    else:
        print("❌ Failed to install dependencies")
        return False


def run_migrations():
    """Run Django migrations."""
    print("Running Django migrations...")
    result = run_command("uv run python manage.py makemigrations")
    if result and result.returncode == 0:
        result = run_command("uv run python manage.py migrate")
        if result and result.returncode == 0:
            print("✅ Migrations completed successfully")
            return True
    
    print("❌ Failed to run migrations")
    return False


def create_superuser():
    """Create a superuser account."""
    print("\n" + "="*50)
    print("SUPERUSER CREATION")
    print("="*50)
    print("You can create a superuser now or later using:")
    print("uv run python manage.py createsuperuser")
    
    response = input("\nWould you like to create a superuser now? (y/n): ").lower().strip()
    if response in ['y', 'yes']:
        result = run_command("uv run python manage.py createsuperuser", check=False)
        if result and result.returncode == 0:
            print("✅ Superuser created successfully")
        else:
            print("❌ Failed to create superuser")


def main():
    """Main setup function."""
    print("🚀 Django OAuth2 Backend Setup")
    print("="*40)
    
    # Check if uv is installed
    result = run_command("uv --version", check=False)
    if not result or result.returncode != 0:
        print("❌ uv is not installed. Please install uv first:")
        print("   pip install uv")
        sys.exit(1)
    
    print("✅ uv is installed")
    
    # Create .env file
    create_env_file()
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        sys.exit(1)
    
    # Create superuser
    create_superuser()
    
    print("\n" + "="*50)
    print("🎉 Setup completed successfully!")
    print("="*50)
    print("\nNext steps:")
    print("1. Edit .env file with your Google OAuth2 credentials")
    print("2. Configure Google OAuth2 in Django admin")
    print("3. Run the development server:")
    print("   uv run python manage.py runserver")
    print("\nFor detailed setup instructions, see README.md")


if __name__ == "__main__":
    main() 