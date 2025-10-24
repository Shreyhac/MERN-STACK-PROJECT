#!/usr/bin/env python3
"""
Simple healthcheck server for Railway deployment
"""
import os
import http.server
import socketserver

class HealthCheckHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "service": "mern-stack-project"}')
        else:
            # Serve static files normally
            super().do_GET()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == "__main__":
    PORT = int(os.environ.get('PORT', 8080))
    
    with socketserver.TCPServer(("", PORT), HealthCheckHandler) as httpd:
        print(f"Server running on port {PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped")
