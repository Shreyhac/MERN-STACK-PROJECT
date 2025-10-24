# Web-to-MCP: AI-Powered Website Component Capture System

## 👨‍💻 Developer Information

**Made by:** Shreyansh Arora  
**Student ID:** 24bcs10252  
**Project Type:** Full-Stack Web Application with Chrome Extension  
**Tech Stack:** React, Django, TypeScript, Chrome Extension API  
**Purpose:** Capture website components and send them to AI coding assistants

---

## 📋 Project Overview

Web-to-MCP is a comprehensive system that allows users to capture website components and seamlessly integrate them with AI coding assistants like Cursor, Claude Code, and other AI-powered development tools. The system consists of three main components:

1. **Frontend Web Application** - React-based interface with cyberpunk/terminal design
2. **Backend API** - Django REST API with OAuth2 authentication
3. **Chrome Extension** - Browser extension for component capture

## 🚀 Key Features

### Frontend (React Application)
- **Cyberpunk Design**: Terminal-style UI with green matrix effects
- **User Authentication**: Google OAuth2 integration
- **Dashboard**: User management and capture history
- **Component Preview**: View captured components with HTML/CSS
- **Responsive Design**: Works on desktop and mobile

### Backend (Django API)
- **REST API**: Full RESTful API with Django REST Framework
- **OAuth2 Authentication**: Google OAuth2 integration
- **User Management**: Custom user model with profile management
- **Capture Storage**: Store and manage website captures
- **MCP Integration**: Model Context Protocol server integration

### Chrome Extension
- **Component Capture**: Select and capture specific webpage elements
- **Full Page Capture**: Capture entire webpage screenshots
- **HTML/CSS Extraction**: Extract clean HTML and CSS code
- **Token Counting**: Accurate token counting for AI models
- **Real-time Preview**: Live preview of captured components

## 🛠️ Technical Architecture

### Frontend Stack
- **React 19** with React Router v7
- **Vite** for build tooling
- **Tailwind CSS 4** for styling
- **TypeScript** for type safety
- **shadcn/ui** components with custom cyberpunk theme

### Backend Stack
- **Django 4.2** with Django REST Framework
- **MySQL** database
- **OAuth2** authentication
- **CORS** support for frontend integration
- **MCP Server** integration

### Extension Stack
- **WXT.dev** framework for Chrome extension development
- **React** for popup interface
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## 📁 Project Structure

```
mernf/
├── frontend/                 # React web application
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── routes/          # Page routes
│   │   └── lib/            # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Django API
│   ├── core/               # Django project settings
│   ├── users/              # User management app
│   ├── captures/           # Capture management app
│   ├── capture_mcp_server/ # MCP server integration
│   ├── manage.py
│   └── pyproject.toml
├── extension/              # Chrome extension
│   ├── entrypoints/        # Extension entry points
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   └── package.json
└── README.md              # This file
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20.19.0+
- Python 3.10+
- MySQL 8.0+
- Chrome browser

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mernf
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
**Access:** http://localhost:5174

### 3. Start the Backend
```bash
cd backend
# Install dependencies (requires uv package manager)
uv sync

# Set up environment variables
cp env.example .env
# Edit .env with your database and OAuth settings

# Run migrations
uv run python manage.py migrate

# Start the server
uv run python manage.py runserver
```
**Access:** http://localhost:8000

### 4. Build the Chrome Extension
```bash
cd extension
npm install
npm run build
```

**Install in Chrome:**
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder from the extension build

## 🔧 Configuration

### Environment Variables (Backend)
Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174
```

### Extension Configuration
The extension automatically detects the backend URL. For development, it uses `http://localhost:5174`.

## 📱 Usage Instructions

### 1. Web Application
1. Visit http://localhost:5174
2. Click "Log In" to authenticate with Google
3. Access the dashboard to view captures
4. Use the extension download page to install the Chrome extension

### 2. Chrome Extension
1. Install the extension using the instructions above
2. Click the extension icon in your browser toolbar
3. Log in with your Google account
4. Choose capture type:
   - **Component Capture**: Select specific elements
   - **Full Page Capture**: Capture entire viewport
5. View results in the web application dashboard

### 3. AI Integration
1. Capture components using the extension
2. Copy the generated URLs
3. Use the URLs in AI coding assistants like Cursor or Claude Code
4. The AI can access the captured components via the MCP protocol

## 🔧 MCP Configuration for Claude

### Setting up Claude Desktop with MCP

1. **Install Claude Desktop**
   - Download Claude Desktop from [Anthropic's website](https://claude.ai/download)
   - Install the application

2. **Configure MCP Server**
   - Open Claude Desktop settings
   - Navigate to "Advanced" → "Model Context Protocol"
   - Add a new MCP server with the following configuration:

   ```json
   {
     "mcpServers": {
       "web-to-mcp": {
         "command": "python",
         "args": ["/path/to/your/backend/server.py"],
         "env": {
           "BACKEND_URL": "http://localhost:8000"
         }
       }
     }
   }
   ```

3. **Alternative: Direct API Integration**
   - Use the capture URLs directly in Claude conversations
   - Format: `http://localhost:8000/mcp/capture/{capture_id}`
   - Claude can access the captured component data via these URLs

4. **Testing MCP Integration**
   - Capture a component using the Chrome extension
   - Note the capture ID from the success message
   - In Claude, reference the capture: "Analyze this component: http://localhost:8000/mcp/capture/{capture_id}"
   - Claude should be able to access and analyze the component data

### MCP Server Features
- **Component Data**: HTML structure, CSS styles, and screenshots
- **Metadata**: Website URL, capture timestamp, token count
- **AI Instructions**: Pre-formatted prompts for AI analysis
- **Reference IDs**: Unique identifiers for each capture

## 🎨 Design System

### Cyberpunk Theme
- **Colors**: Black background with green (#22c55e) and cyan (#06b6d4) accents
- **Typography**: Monospace fonts (JetBrains Mono, Fira Code)
- **Effects**: Matrix glow, terminal cursor, typing animations
- **Components**: Cyber-glow effects, holographic overlays

### UI Components
- **Buttons**: Terminal-style with hover animations
- **Cards**: Black background with green borders
- **Inputs**: Terminal-style with green focus states
- **Animations**: Matrix rain effects, glitch animations

## 🔒 Security Features

- **OAuth2 Authentication**: Secure Google OAuth2 integration
- **CORS Protection**: Configured for specific origins
- **Token Authentication**: Secure API authentication
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Built-in rate limiting for API endpoints

## 📊 API Endpoints

### Authentication
- `GET /api/google/login/` - Google OAuth2 login
- `GET /api/auth/status/` - Check authentication status
- `POST /api/auth/logout/` - User logout

### User Management
- `GET /api/user/profile/` - Get user profile
- `PUT /api/user/profile/` - Update user profile

### Captures
- `POST /api/captures/` - Create new capture
- `GET /api/captures/` - List user captures
- `GET /api/captures/{slug}/` - Get specific capture

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
uv run python manage.py test
```

### Extension Testing
```bash
cd extension
npm run compile
```

## 📦 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist folder to your hosting service
```

### Backend Deployment
```bash
cd backend
# Set up production database
# Configure environment variables
# Deploy using your preferred method (Docker, Heroku, etc.)
```

### Extension Distribution
```bash
cd extension
npm run zip
# Upload the generated zip file to Chrome Web Store
```

## 🎯 Key Features

### Core Functionality
- **Component Capture**: Visual selection and capture of website elements
- **Free Tier**: 10 free captures per user
- **Manual Extension Installation**: Step-by-step installation guide
- **Local Development**: Complete local development setup
- **MCP Integration**: Direct integration with AI coding assistants

## 🔮 Future Enhancements

### Planned Features
- **Auto-chunking**: Automatic component chunking for large websites
- **Batch Processing**: Multiple component capture
- **AI Integration**: Direct AI assistant integration
- **Team Collaboration**: Multi-user capture sharing
- **Advanced Filtering**: Smart component detection

### Technical Improvements
- **Performance Optimization**: Faster capture processing
- **Mobile Support**: Mobile browser extension
- **Offline Mode**: Offline capture capabilities
- **Advanced Analytics**: Usage analytics and insights

## 📚 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**: Complete web application with frontend, backend, and browser extension
2. **Modern Technologies**: React 19, Django 4.2, TypeScript, modern build tools
3. **API Design**: RESTful API design and implementation
4. **Browser Extension Development**: Chrome extension with modern frameworks
5. **Authentication**: OAuth2 integration and user management
6. **Database Design**: Relational database design and ORM usage
7. **UI/UX Design**: Custom design system and responsive design
8. **Security**: Authentication, authorization, and data protection
9. **Development Workflow**: Modern development practices and tooling

## 🤝 Contributing

This project is open for contributions and improvements.

## 📄 License

This project is for educational purposes. All rights reserved.

## 📞 Contact 8650324486 / shreyansh.24bcs102@sst.scaler.com

For questions about this project, please contact the development team.

---

**Note:** This project demonstrates modern web development practices with AI integration capabilities.
