#!/usr/bin/env python3
"""
Download server for Web to MCP Extension ZIP
"""
import http.server
import socketserver
import os
from pathlib import Path

class DownloadHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/download-extension':
            self.serve_zip_file()
        else:
            super().do_GET()
    
    def serve_zip_file(self):
        """Serve the extension ZIP file for download"""
        zip_path = Path('web-to-mcp-extension.zip')
        
        if not zip_path.exists():
            self.send_error(404, "Extension ZIP not found")
            return
        
        try:
            with open(zip_path, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/zip')
            self.send_header('Content-Disposition', 'attachment; filename="web-to-mcp-extension.zip"')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            self.send_error(500, f"Error serving file: {str(e)}")

def main():
    PORT = 8080
    
    with socketserver.TCPServer(("", PORT), DownloadHandler) as httpd:
        print(f"📦 Download server running at http://localhost:{PORT}")
        print(f"🔗 Download URL: http://localhost:{PORT}/download-extension")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
