"""
Test script for the archival functionality.
This script can be used to test the archival service manually.
"""

import os
import sys
import django
from pathlib import Path
from datetime import datetime, timedelta
from django.utils import timezone

# Add the project root to Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Load environment variables from .env file
env_file = project_root / ".env"
if env_file.exists():
    with open(env_file, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from captures.models import Capture
from captures.archival_service import ArchivalService


def test_archival_service():
    """Test the archival service functionality."""
    print("Testing Archival Service...")

    # Initialize archival service
    archival_service = ArchivalService()

    # Get captures to archive (older than 7 days)
    captures_to_archive = archival_service.get_captures_to_archive(days_old=7)
    print(f"Found {captures_to_archive.count()} captures older than 7 days")

    # Show some details about captures to be archived
    for capture in captures_to_archive[:5]:  # Show first 5
        print(
            f"  - Capture {capture.slug}: {capture.website_url} (created: {capture.created_at})"
        )

    if captures_to_archive.count() > 5:
        print(f"  ... and {captures_to_archive.count() - 5} more")

    # Test archival process (dry run - don't actually archive)
    print("\nTo actually run the archival process, uncomment the line below:")
    print("# summary = archival_service.archive_old_captures(days_old=7)")
    print("# print(f'Archival summary: {summary}')")


def create_test_capture():
    """Create a test capture for testing purposes."""
    from users.models import CustomUser

    # Get or create a test user
    user, created = CustomUser.objects.get_or_create(
        email="test@example.com",
        defaults={
            "first_name": "Test",
            "last_name": "User",
        },
    )

    if created:
        print(f"Created test user: {user.email}")
    else:
        print(f"Using existing test user: {user.email}")

    # Create a test capture with old timestamp
    old_date = timezone.now() - timedelta(days=8)  # 8 days old

    capture = Capture.objects.create(
        user=user,
        website_url="https://example.com",
        token_count=100,
        html_file_key="test/html.html",
        png_file_key="test/screenshot.png",
        created_at=old_date,
    )

    print(f"Created test capture: {capture.slug} (created: {capture.created_at})")
    return capture


if __name__ == "__main__":
    print("Archival Service Test Script")
    print("=" * 40)

    # Test the archival service
    test_archival_service()

    print("\n" + "=" * 40)
    print("To create a test capture for testing:")
    print("uncomment the line below:")
    print("# create_test_capture()")
