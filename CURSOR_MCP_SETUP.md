# 🚀 Web to MCP - Cursor Integration Setup

## Complete Setup Guide for College Demo

### 🎯 What You Get:
- **Proper Reference IDs**: Meaningful capture IDs like `github-1761296307-39df`
- **Agent Instructions**: Ready-to-use instructions for Cursor
- **MCP Connection**: Direct integration with Cursor AI
- **Component Analysis**: Full HTML and screenshot capture

---

## 📋 Step 1: Start the System

### Start Backend Server:
```bash
cd /Users/shreyansharora/mernf/backend
python3 demo_server.py
```

### Start Frontend:
```bash
cd /Users/shreyansharora/mernf/frontend
npm run dev
```

**✅ You should see:**
- Backend: `http://localhost:8000` (Web to MCP Demo Server - Running!)
- Frontend: `http://localhost:5174` (React app)

---

## 📋 Step 2: Install Extension

1. **Download Extension**: http://localhost:5174/extension-download
2. **Follow 5-step installation guide**
3. **Test Extension**: Click capture buttons on any website

**✅ You should see:**
- "Capture Successful" dialog
- Reference ID like: `github-1761296307-39df`
- Agent instruction: "Use the web-to-mcp tool with reference..."

---

## 📋 Step 3: Connect to Cursor

### Option A: Automatic Setup (Recommended)
```bash
cd /Users/shreyansharora/mernf
python3 setup_cursor_mcp.py
```

### Option B: Manual Setup
1. **Open Cursor Settings** (Cmd+,)
2. **Search for "MCP"**
3. **Add MCP Server:**
   ```json
   {
     "mcpServers": {
       "web-to-mcp": {
         "command": "python3",
         "args": ["/Users/shreyansharora/mernf/backend/mcp_server.py"]
       }
     }
   }
   ```

---

## 📋 Step 4: Test the Complete Flow

### 1. Capture a Component:
- Go to any website (e.g., GitHub, Stack Overflow)
- Click the extension icon
- Click "Capture Element" or "Capture Viewport"
- Note the Reference ID (e.g., `github-1761296307-39df`)

### 2. Use in Cursor:
Open Cursor and try these commands:

```
List my captures
```

```
Analyze component github-1761296307-39df
```

```
Show me the HTML from github-1761296307-39df
```

```
Create a React component based on github-1761296307-39df
```

---

## 🎯 Demo Features

### ✅ What Works:
- **Real API Calls**: Extension makes proper HTTP requests
- **Meaningful IDs**: `domain-timestamp-random` format
- **Agent Instructions**: Ready for Cursor AI
- **MCP Integration**: Direct connection to Cursor
- **Component Analysis**: Full HTML + Screenshot capture
- **Token Counting**: Accurate AI model token estimates

### ✅ Reference ID Format:
- **Pattern**: `{domain}-{timestamp}-{random}`
- **Example**: `github-1761296307-39df`
- **Meaning**: GitHub component captured at timestamp 1761296307

### ✅ Agent Instructions:
- **Format**: "Use the web-to-mcp tool with reference {id} to analyze the captured component from {domain}"
- **Example**: "Use the web-to-mcp tool with reference github-1761296307-39df to analyze the captured component from github.com"

---

## 🔧 Troubleshooting

### Extension Not Working:
1. Check if backend is running: `curl http://localhost:8000`
2. Check browser console for errors
3. Reload the extension in Chrome

### Cursor MCP Not Connecting:
1. Restart Cursor completely
2. Check MCP settings in Cursor preferences
3. Verify the MCP server path is correct

### API Errors:
1. Check backend logs for error messages
2. Verify the capture was stored: `curl http://localhost:8000/mcp/capture/{id}`

---

## 🎓 College Submission Ready!

### Files to Submit:
- **Frontend**: Complete React application
- **Backend**: Demo server with API endpoints
- **Extension**: Chrome extension with capture functionality
- **MCP Integration**: Cursor connection setup

### Demo Flow:
1. **Show Extension**: Capture components from any website
2. **Show API**: Demonstrate proper HTTP requests
3. **Show Cursor**: Use captured components in AI coding
4. **Show Integration**: Seamless workflow from capture to coding

### Key Features Demonstrated:
- ✅ **Real-time Capture**: Live website component extraction
- ✅ **API Integration**: Proper backend communication
- ✅ **AI Integration**: Cursor MCP connection
- ✅ **Token Management**: Accurate AI model token counting
- ✅ **Component Analysis**: Full HTML and visual capture

---

## 🚀 Ready to Demo!

Your Web-to-MCP system is now fully functional with:
- **Proper Reference IDs** ✅
- **Agent Instructions** ✅  
- **Cursor MCP Connection** ✅
- **Complete Workflow** ✅

**Demo URL**: http://localhost:5174/extension-download
**Backend API**: http://localhost:8000
**Extension**: Download and install via the website

🎉 **Perfect for college submission!**
