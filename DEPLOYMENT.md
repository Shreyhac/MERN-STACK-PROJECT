# Deployment Guide for Web-to-MCP Project

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)
1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `shreyhac/MERN-STACK-PROJECT`
   - Select the `frontend` folder as root directory

2. **Configure Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   VITE_BACKEND_URL=https://your-backend-url.herokuapp.com
   ```

### Option 2: Netlify (Alternative for Frontend)
1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect GitHub and select repository

2. **Build Settings**
   ```bash
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

### Option 3: Heroku (Backend Deployment)
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix=backend heroku main
   ```

## 🔧 Local Development Setup

### Prerequisites
- Node.js 20.19.0+
- Python 3.10+
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/shreyhac/MERN-STACK-PROJECT.git
cd MERN-STACK-PROJECT

# Start Frontend
cd frontend
npm install
npm run dev

# Start Backend (in new terminal)
cd backend
python3 demo_server.py

# Build Extension
cd extension
npm install
npm run build
```

## 📱 Live Demo Links

### Frontend (Vercel)
- **URL**: https://mern-stack-project.vercel.app
- **Status**: Ready for deployment

### Backend (Heroku)
- **URL**: https://your-app-name.herokuapp.com
- **Status**: Ready for deployment

### Extension (Chrome Web Store)
- **URL**: https://chromewebstore.google.com/detail/web-to-mcp-import-any-web/hbnhkfkblpgjlfonnikijlofeiabolmi
- **Status**: Already published

## 🎯 Project Features

### ✅ Completed Features
- **Frontend**: React application with cyberpunk design
- **Backend**: Django API with MCP integration
- **Extension**: Chrome extension for component capture
- **Authentication**: Google OAuth2 integration
- **AI Integration**: MCP protocol for AI assistants
- **Responsive Design**: Mobile and desktop support

### 🔧 Technical Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Django 4.2, Python, REST API
- **Extension**: WXT.dev, Chrome Extension API
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: Google OAuth2
- **Deployment**: Vercel, Heroku, Chrome Web Store

## 📊 Project Statistics
- **Total Files**: 50+ source files
- **Lines of Code**: 5000+ lines
- **Components**: 20+ React components
- **API Endpoints**: 10+ REST endpoints
- **Extension Features**: Component capture, full-page capture

## 🎓 Academic Information
- **Developer**: Shreyansh Arora
- **Student ID**: 24bcs10252
- **Project Type**: Full-Stack MERN Application
- **Purpose**: AI-powered website component capture system

## 📞 Support
For questions or issues, please contact:
- **Email**: team@web-to-mcp.com
- **GitHub**: https://github.com/shreyhac/MERN-STACK-PROJECT
- **Website**: https://web-to-mcp.com

---

**Note**: This project demonstrates modern web development practices with AI integration capabilities.
