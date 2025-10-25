# Django OAuth2 Backend

A Django backend with Django REST Framework, Sentry error monitoring, and Google OAuth2 authentication.

## Features

- **Django REST Framework**: Full REST API with token authentication
- **Google OAuth2 Only**: Social authentication with Google using django-social-auth (regular registration disabled)
- **Sentry Integration**: Error monitoring and performance tracking
- **Custom User Model**: Extended user model with OAuth2 fields
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Token Authentication**: Secure API authentication
- **MySQL Database**: Production-ready MySQL database support
- **Free Tier System**: Configurable free captures for all users

## Prerequisites

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package manager
- MySQL Server 8.0+
- Google OAuth2 credentials
- Sentry account (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd django-oauth-backend
   ```

2. **Set up MySQL Database**
   ```bash
   # Install MySQL Server (Ubuntu/Debian)
   sudo apt update
   sudo apt install mysql-server
   
   # Or on macOS with Homebrew
   brew install mysql
   brew services start mysql
   
   # Or on Windows, download from MySQL website
   
   # Create database and user
   mysql -u root -p
   CREATE DATABASE django_oauth_db;
   CREATE USER 'django_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON django_oauth_db.* TO 'django_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```
   
   **Alternative: Use the setup script**
   ```bash
   uv run python setup_mysql.py
   ```

3. **Install dependencies with uv**
   ```bash
   uv sync
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values, including MySQL connection details
   ```

5. **Run database migrations**
   ```bash
   uv run python manage.py makemigrations
   uv run python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   uv run python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   uv run python manage.py runserver
   ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (MySQL)
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Sentry Configuration (optional)
SENTRY_DSN=your-sentry-dsn-here

# Google OAuth2 Settings
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

```

### Database Configuration

The project uses MySQL as the database. Configure your `DATABASE_URL` in the `.env` file:

```env
# Format: mysql://username:password@host:port/database_name
DATABASE_URL=mysql://django_user:your_password@localhost:3306/django_oauth_db
```

For production, you might want to use a managed MySQL service like:
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Databases
- PlanetScale

## Google OAuth2 Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth2 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/complete/google-oauth2/` (development)
     - `https://yourdomain.com/complete/google-oauth2/` (production)

4. **Configure Django Social Auth**
   - The Google OAuth2 credentials are configured via environment variables
   - Make sure your Google Client ID and Client Secret are set in the `.env` file
   - The redirect URI should be: `http://localhost:8000/complete/google-oauth2/` (development)

## Sentry Setup

1. **Create a Sentry account**
   - Go to [Sentry.io](https://sentry.io/) and create an account
   - Create a new project for Django

2. **Get your DSN**
   - Copy the DSN from your Sentry project settings
   - Add it to your `.env` file as `SENTRY_DSN`


## Free Tier System

The application implements a freemium model with customizable limits:

- **All Users**: Configurable free captures (default: 10)

### How it works:

1. **New users** start with 10 free captures by default
2. **Custom limits** can be set per user for special cases
3. **Capture creation** is automatically checked against individual limits
4. **Limit exceeded** returns a 402 Payment Required error

### Admin Management:

Admins can customize free capture limits for individual users:

```python
# Give a user more free captures
user.free_capture_limit = 25
user.save()

# Reduce a user's limit
user.free_capture_limit = 5
user.save()
```

### API Response Examples:

**User Profile (includes capture info):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "subscription_status": "incomplete",
  "capture_count": 8,
  "remaining_free_captures": 2,
  "can_create_capture": true,
  "free_capture_limit": 10
}
```

**Limit Exceeded Error:**
```json
{
  "error": "You have used all 10 free captures. Please upgrade to continue capturing websites.",
  "code": "capture_limit_exceeded",
  "remaining_captures": 0,
  "upgrade_required": true
}
```

**Subscription Status (includes custom limits):**
```json
{
  "subscription_status": "incomplete",
  "subscription_plan": null,
  "capture_count": 8,
  "remaining_free_captures": 2,
  "can_create_capture": true,
  "free_capture_limit": 10
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register/` - **DISABLED** (OAuth2 only)
- `POST /api/auth/login/` - **DISABLED** (OAuth2 only)
- `POST /api/auth/logout/` - User logout (requires authentication)
- `GET /api/auth/status/` - Check authentication status
- `GET /api/google/login/` - Google OAuth2 login

### User Management

- `GET /api/user/profile/` - Get user profile (requires authentication)
- `PUT /api/user/profile/` - Update user profile (requires authentication)
- `GET /api/user/oauth-info/` - Get OAuth account information (requires authentication)
- `GET /api/users/` - List all users (admin only)

### OAuth2

- `GET /api/google/login/` - Initiate Google OAuth2 login
- `GET /api/google/login/callback/` - Google OAuth2 callback


### Captures

- `POST /api/captures/` - Create a new website capture (subject to free tier limits)
- `GET /api/captures/` - List user's captures
- `GET /api/captures/{slug}/` - Get specific capture details

## API Usage Examples

### OAuth2 Authentication
Users can only authenticate through Google OAuth2. Visit:
```
http://localhost:8000/api/google/login/
```

### Note: Regular Registration/Login Disabled
The following endpoints are disabled and will return a 403 error:
- `POST /api/auth/register/` - Regular user registration
- `POST /api/auth/login/` - Regular user login

Only Google OAuth2 authentication is allowed.

### Get user profile (with token)
```bash
curl -X GET http://localhost:8000/api/user/profile/ \
  -H "Authorization: Token your-token-here"
```


### Create a capture
```bash
curl -X POST http://localhost:8000/api/captures/ \
  -H "Authorization: Token your-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "website_url": "https://example.com",
    "token_count": 1500,
    "html": "<html>...</html>",
    "png_screenshot": "base64_encoded_image"
  }'
```

## Development

### Running tests
```bash
uv run python manage.py test
```

### Code formatting
```bash
uv run black .
uv run isort .
```

### Linting
```bash
uv run flake8 .
```

## Production Deployment

1. **Set DEBUG=False in production**
2. **Use a production MySQL database**
3. **Configure proper ALLOWED_HOSTS**
4. **Set up proper CORS settings**
5. **Use environment variables for sensitive data**
6. **Set up SSL/TLS certificates**
7. **Configure proper logging**
8. **Set up MySQL connection pooling for better performance**

## Project Structure

```
django-oauth-backend/
├── core/                   # Main Django project
│   ├── __init__.py
│   ├── settings.py        # Django settings
│   ├── urls.py           # Main URL configuration
│   ├── wsgi.py           # WSGI application
│   └── asgi.py           # ASGI application
├── users/                 # Users app
│   ├── __init__.py
│   ├── admin.py          # Admin configuration
│   ├── apps.py           # App configuration
│   ├── models.py         # Custom user model
│   ├── serializers.py    # API serializers
│   ├── urls.py           # App URL patterns
│   └── views.py          # API views
├── manage.py             # Django management script
├── pyproject.toml        # Project dependencies (uv)
├── env.example           # Environment variables template
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 