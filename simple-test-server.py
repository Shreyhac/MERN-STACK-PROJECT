#!/usr/bin/env python3
"""
Simple test server for Web to MCP
Serves the frontend and provides a basic API
"""
import http.server
import socketserver
import json
import urllib.parse
from pathlib import Path

class WebToMCPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api()
        else:
            # Serve frontend files
            if self.path == '/':
                self.path = '/apps/frontend/app'
            super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api()
        else:
            self.send_error(404)
    
    def handle_api(self):
        """Handle API requests"""
        if self.path == '/api/':
            self.send_json_response({
                'message': 'Web to MCP API is running!',
                'status': 'success',
                'version': '1.0.0'
            })
        elif self.path == '/api/health/':
            self.send_json_response({
                'status': 'healthy',
                'services': {
                    'frontend': 'running',
                    'backend': 'running',
                    'extension': 'ready'
                }
            })
        else:
            self.send_json_response({
                'error': 'Endpoint not found',
                'path': self.path
            }, status=404)
    
    def send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

def main():
    PORT = 8000
    
    # Change to the project directory
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), WebToMCPHandler) as httpd:
        print(f"🚀 Web to MCP Test Server running at http://localhost:{PORT}")
        print(f"🌐 Frontend: http://localhost:5174")
        print(f"🔧 Backend API: http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()

if __name__ == "__main__":
    import os
    main()
