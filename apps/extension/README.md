# Web to MCP Chrome Extension

A Chrome extension built with WXT.dev and React that allows users to capture components or full pages from any website and send them to MCP (Model Context Protocol), including screenshots and HTML/CSS data. **Now with an extremely geeky, terminal-style interface designed specifically for developers!**

## 🖥️ Geeky Features

- **Terminal-Style Interface**: Dark theme with green accents reminiscent of classic terminal applications
- **Matrix-Style Effects**: Animated background effects and text glows
- **ASCII Art**: Classic terminal-style borders and decorative elements
- **Monospace Typography**: Developer-friendly font throughout the interface
- **Cyberpunk Animations**: Glitch effects, holographic overlays, and power-up animations
- **System Status Bar**: Real-time CPU, RAM, and network status indicators
- **Terminal Cursor Effects**: Animated typing effects and cursor animations
- **Scan Line Effects**: CRT-style scan lines for authentic retro feel
- **Developer-Focused Copy**: All text uses terminal-style commands and developer terminology

## Features

- **User Authentication**: Automatic login detection with session cookies
- **Component Capture**: Select and capture specific elements on a webpage
- **Full Page Capture**: Capture entire webpage screenshots
- **Element Highlighting**: Visual feedback when selecting components
- **HTML & CSS Extraction**: Extract HTML code and computed CSS styles
- **Server Upload**: Automatically upload captures to the server via API
- **Unique URLs**: Generate unique URLs for each capture with server-generated slugs
- **Real-time Notifications**: Success and error notifications for capture operations
- **Token Counting**: Accurate token counting using GPT-4 tokenizer
- **Local Storage**: Captures are stored locally in the extension for reference

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your backend URL: `BACKEND_URL=http://localhost:5174` (for development)
   - For production: `BACKEND_URL=https://web-to-mcp.com`
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the build output

## Usage

1. **Open the Extension**: Click on the extension icon in your Chrome toolbar
2. **Authentication Check**: The extension will automatically check if you're logged in
   - If logged in: You'll see your user information and can proceed to capture
   - If not logged in: Click "Log In" to be redirected to the website
3. **Choose Capture Type**:
   - **[COMPONENT] Capture Element**: Click this to select a specific element on the page
   - **[FULLPAGE] Capture Viewport**: Click this to capture the entire visible page
4. **For Component Capture**:
   - Hover over elements to see them highlighted
   - Click on the desired element to capture it
   - Press `Escape` to cancel selection
5. **View Results**:
   - A success overlay will appear with a unique URL
   - Click "Copy URL" to copy the capture URL
   - Check the browser console for detailed capture data

## Technical Details

### Permissions Used
- `activeTab`: Access the currently active tab
- `scripting`: Execute scripts in tabs
- `storage`: Store capture data locally
- `http://localhost:5174/*`: Access local development backend
- `https://web-to-mcp.com/*`: Access production backend

### Capture Data Structure
Each capture includes:
- **Screenshot**: PNG image data (base64 encoded)
- **HTML**: Element or page HTML structure
- **Token Count**: Accurate token count using GPT-4 tokenizer
- **Website URL**: Source URL of the captured page
- **Server Response**: Server-generated slug and metadata

### API Integration
The extension integrates with the backend API for capture storage:

**POST** `/api/captures/create/`
- **Request**: `{ website_url, token_count, html, png_screenshot }`
- **Response**: `{ slug, website_url, token_count, created_at }`

All captures are automatically uploaded to the server and stored in S3, with unique slugs generated for each capture.

#### Background Script API Handling
The extension uses the background script for all API requests to ensure proper cookie access:
- All API calls are routed through the background script
- Automatic cookie handling for session authentication
- Proper cross-origin request handling
- Centralized error handling and logging

### Environment Variables

The extension uses environment variables to configure the backend URL:

- `BACKEND_URL`: The URL of your backend API
  - Development: `http://localhost:5174`
  - Production: `https://web-to-mcp.com`
- `NODE_ENV`: Environment mode (`development` or `production`)

### Error Monitoring with Sentry

The extension includes Sentry integration for error monitoring and performance tracking:

- **Shared Environment Setup**: Uses manual client setup to avoid global state pollution
- **Browser Extension Optimized**: Configured specifically for browser extension environments
- **Error Filtering**: Filters out development errors unless explicitly enabled
- **Performance Monitoring**: Tracks performance with configurable sample rates
- **Context Capture**: Captures additional context for better error debugging

**Sentry Configuration:**
- DSN: Configured via environment variables
- Environment: Automatically set based on `NODE_ENV`
- Release: Set to extension version
- Debug Mode: Enabled in development
- Sample Rate: 10% in production, 100% in development

**Error Handling:**
- Global error handlers for unhandled exceptions
- Promise rejection handlers
- React error boundaries
- Manual error capturing with context

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview built extension
npm run preview
```

## Architecture

- **Popup**: React-based UI with terminal-style interface
- **Content Script**: Handles element selection, highlighting, and capture logic
- **Background Script**: Manages extension lifecycle and storage
- **WXT Configuration**: Manages permissions and build settings

## Design System

The extension uses a comprehensive geeky design system including:

- **Color Palette**: Black background with green (#22c55e) and cyan (#06b6d4) accents
- **Typography**: Monospace fonts throughout for authentic terminal feel
- **Animations**: Matrix rain effects, glitch animations, holographic shifts
- **Effects**: Cyber-glow shadows, scan lines, terminal cursors
- **Icons**: Lucide React icons with terminal/developer themes

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## License

MIT
