# Web to MCP - Send Website Components Directly to AI Coding Assistants

> **Live Project**: This project is currently live on the Chrome Web Store and generating revenue as a side income source.

## 🚀 Project Overview

Web to MCP is a revolutionary browser extension and web platform that bridges the gap between design and code. It allows developers to capture any website component and send it directly to AI coding assistants like Cursor IDE or Claude Code using the Model Context Protocol (MCP).

### 🎯 Key Features

- **One-Click Component Capture**: Select any element on any website and capture it instantly
- **Direct AI Integration**: Send components directly to Cursor IDE or Claude Code via MCP
- **Pixel-Perfect Handoffs**: No more screenshots or descriptions needed
- **Chrome Extension**: Seamless browser integration
- **Real-time Processing**: Instant component analysis and transfer
- **Free Tier Available**: Configurable free captures for all users

## 👨‍💻 Project Team

**Shreyansh Arora**  
- **Roll Number**: 24bcs10252  
- **Email**: shreyansh.24bcs10252@sst.scaler.com  
- **Role**: Co-founder & Developer

*This project was built as a side project with a colleague from office and is currently generating side income through the Chrome Web Store.*

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router v7** for client-side routing
- **Vite** for build tooling and development server
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for HTTP requests

### Backend
- **Django 4.2+** with Django REST Framework
- **Python 3.9+** with `uv` package manager
- **MySQL** database with `mysqlclient`
- **Google OAuth2** authentication via `social-auth-app-django`
- **Sentry** for error monitoring
- **CORS** support for frontend integration
- **JWT** token authentication
- **AWS S3** for file storage
- **Slack** integration for metrics reporting

### Chrome Extension
- **WXT.dev** framework for Chrome extension development
- **TypeScript** for type safety
- **Vite** for extension building
- **Chrome APIs** for content scripts and popup

### Infrastructure & DevOps
- **Docker** and **Docker Compose** for containerization
- **Nginx** for reverse proxy
- **MySQL** for production database
- **AWS S3** for static file storage
- **Sentry** for error tracking and performance monitoring

### Development Tools
- **ESLint** and **Prettier** for code formatting
- **TypeScript** for type checking
- **Concurrently** for running multiple services
- **Git** for version control

## 📁 Project Structure

```
shreyansh-mern/
├── apps/
│   ├── frontend/          # React frontend application
│   ├── backend/           # Django REST API backend
│   └── extension/         # Chrome extension
├── scripts/               # Development and deployment scripts
├── docker-compose.yml    # Docker configuration
├── README.md             # This file
└── package.json          # Root package.json for workspace
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+** and `uv` package manager
- **MySQL 8.0+** database
- **Chrome browser** for extension testing
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shreyansh-mern
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd apps/frontend && npm install
   
   # Install extension dependencies
   cd ../extension && npm install
   
   # Install backend dependencies
   cd ../backend && uv sync
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/backend/env.example apps/backend/.env
   
   # Edit the .env file with your configuration
   nano apps/backend/.env
   ```

4. **Set up the database**
   ```bash
   cd apps/backend
   python3 manage.py migrate
   python3 manage.py createsuperuser
   ```

5. **Build the extension**
   ```bash
   cd apps/extension
   npm run build
   ```

### Development

#### Quick Start (All Services)
```bash
# Start all services with one command
./scripts/quick-test.sh
```

#### Individual Services

**Frontend Development**
```bash
cd apps/frontend
npm run dev
# Available at http://localhost:5173
```

**Backend Development**
```bash
cd apps/backend
python3 manage.py runserver
# Available at http://localhost:8000
```

**Extension Development**
```bash
cd apps/extension
npm run dev
# Load the extension from apps/extension/dist in Chrome
```

## 🌐 Live Services

### Chrome Web Store
- **Extension**: [Web to MCP - Chrome Extension](https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi)
- **Status**: ✅ Live and generating revenue
- **Users**: Active user base with positive reviews

### Web Platform
- **URL**: https://web-to-mcp.com
- **Status**: ✅ Live and operational
- **Features**: Full authentication, dashboard, and MCP integration

## 🔧 API Endpoints

### Authentication
- `GET /api/google/login/` - Initiate Google OAuth2 login
- `GET /api/google/login/callback/` - Google OAuth2 callback
- `POST /api/auth/logout/` - User logout

### User Management
- `GET /api/user/` - Get current user profile
- `POST /api/user/source/` - Update user source tracking

### Captures
- `POST /api/captures/` - Create a new website capture
- `GET /api/captures/` - List user's captures
- `GET /api/captures/{slug}/` - Get specific capture details

### MCP Integration
- `GET /api/mcp/url/` - Get user's MCP URL
- `POST /api/mcp/capture/` - Send capture to MCP server

## 💰 Business Model

### Revenue Streams
- **Chrome Web Store**: Paid extension downloads
- **Freemium Model**: Free tier with configurable limits
- **Enterprise**: Custom solutions for teams

### Current Status
- ✅ **Live on Chrome Web Store**
- ✅ **Generating side income**
- ✅ **Active user base**
- ✅ **Positive user feedback**

## 🚀 Deployment

### Production Setup
```bash
# Build all services
npm run build:all

# Start with Docker Compose
docker-compose up -d

# Or deploy individually
./scripts/deploy.sh
```

### Environment Variables
```bash
# Backend (.env)
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=mysql://user:password@localhost:3306/db_name
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SENTRY_DSN=your-sentry-dsn
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-s3-bucket
```

## 📊 Analytics & Monitoring

- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring and performance tracking
- **Slack**: Daily metrics reporting
- **Custom Analytics**: Feature usage and conversion tracking

## 🤝 Contributing

This is a side project built for learning and income generation. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary and built for commercial use. All rights reserved.

## 📞 Contact

**Shreyansh Arora**  
- **Email**: shreyansh.24bcs10252@sst.scaler.com  
- **Roll Number**: 24bcs10252  
- **Project**: Web to MCP - Chrome Extension & Web Platform

---

*Built with ❤️ as a side project for learning and income generation*