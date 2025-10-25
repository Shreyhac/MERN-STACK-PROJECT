#!/usr/bin/env python3
"""
Comprehensive test script for the Capture MCP Server functionality.

This script consolidates all MCP server tests and demonstrates how to:
1. Test MCP server setup and configuration
2. Create and manage MCP URLs for users
3. Test MCP server initialization and tools listing
4. Test the get_html_for_reference and get_screenshot_for_reference tools
5. Test HTTP endpoints and MCP protocol compliance

Usage:
    python test_mcp_server.py

Make sure to:
1. Start the Django development server: python manage.py runserver
2. Configure AWS S3 credentials
3. Update configuration variables as needed
"""

import os
import sys
import django
import requests
import json
import base64
from typing import Dict, Any, Optional

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from capture_mcp_server.models import MCPUrl
from captures.models import Capture
from django.contrib.auth import get_user_model

User = get_user_model()


class CaptureMCPServerTester:
    """Comprehensive tester for the Capture MCP Server."""

    def __init__(
        self, base_url: str = "http://localhost:8000", auth_token: Optional[str] = None
    ):
        self.base_url = base_url
        self.auth_token = auth_token
        self.headers = {"Authorization": f"Token {auth_token}"} if auth_token else {}

    def test_mcp_server_setup(self) -> bool:
        """Test that the MCP server is properly configured."""
        print("Testing MCP Server Setup...")

        try:
            # Test imports
            from mcp_server.djangomcp import DjangoMCP
            from mcp_server.views import MCPServerStreamableHttpView
            from capture_mcp_server.views import (
                capture_mcp_server,
                CaptureMCPServerView,
            )

            print("✅ All imports successful")

            # Test MCP server creation
            print("✅ DjangoMCP imported successfully")

            # Test view creation
            view = CaptureMCPServerView()
            print("✅ CaptureMCPServerView created successfully")

            return True

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def create_test_user_and_data(
        self,
    ) -> tuple[Optional[User], Optional[MCPUrl], Optional[Capture]]:
        """Create test user, MCP URL, and capture for testing."""
        print("\nSetting up test data...")

        try:
            # Get or create a test user
            user, created = User.objects.get_or_create(
                username="test_mcp_user",
                defaults={
                    "email": "test_mcp@example.com",
                    "first_name": "Test",
                    "last_name": "MCP User",
                },
            )

            if created:
                print(f"✅ Created test user: {user.username}")
            else:
                print(f"✅ Using existing test user: {user.username}")

            # Get or create MCP URL
            mcp_url = MCPUrl.get_or_create_for_user(user)
            print(f"✅ MCP URL: {mcp_url.url_token}")

            # Get or create test capture
            capture, created = Capture.objects.get_or_create(
                user=user,
                website_url="https://example.com",
                defaults={
                    "token_count": 1000,
                    "html_file_key": "test/html/file.html",
                    "png_file_key": "test/png/file.png",
                },
            )

            if created:
                print(f"✅ Created test capture: {capture.slug}")
            else:
                print(f"✅ Using existing test capture: {capture.slug}")

            return user, mcp_url, capture

        except Exception as e:
            print(f"❌ Error setting up test data: {e}")
            return None, None, None

    def create_mcp_url_api(self) -> Dict[str, Any]:
        """Create a new MCP URL via API for the authenticated user."""
        print("Creating MCP URL via API...")

        response = requests.post(
            f"{self.base_url}/api/mcp/create/", headers=self.headers
        )

        if response.status_code == 201:
            data = response.json()
            print(f"✅ MCP URL created successfully!")
            print(f"   URL Token: {data['url_token']}")
            print(f"   MCP URL: {data['mcp_url']}")
            return data
        else:
            print(f"❌ Failed to create MCP URL: {response.status_code}")
            print(f"   Response: {response.text}")
            return {}

    def list_mcp_urls_api(self) -> list[Dict[str, Any]]:
        """List all MCP URLs for the authenticated user via API."""
        print("\nListing MCP URLs via API...")

        response = requests.get(f"{self.base_url}/api/mcp/list/", headers=self.headers)

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {len(data)} MCP URL(s)")
            for mcp_url in data:
                print(
                    f"   - {mcp_url['url_token']} ({'Active' if mcp_url['is_active'] else 'Inactive'})"
                )
            return data
        else:
            print(f"❌ Failed to list MCP URLs: {response.status_code}")
            print(f"   Response: {response.text}")
            return []

    def test_mcp_initialize(self, url_token: str) -> bool:
        """Test MCP server initialization."""
        print(f"\nTesting MCP initialization for token: {url_token}")

        url = f"{self.base_url}/mcp/{url_token}/"

        # MCP initialization request
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "clientInfo": {"name": "test-client", "version": "1.0.0"},
            },
        }

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            response = requests.post(url, json=init_request, headers=headers)

            if response.status_code == 200:
                data = response.json()
                print("✅ MCP initialization successful!")
                if "result" in data and "serverInfo" in data["result"]:
                    server_info = data["result"]["serverInfo"]
                    print(
                        f"   Server: {server_info.get('name', 'Unknown')} v{server_info.get('version', 'Unknown')}"
                    )
                return True
            else:
                print(f"❌ MCP initialization failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def test_mcp_tools_list(self, url_token: str) -> bool:
        """Test MCP tools list."""
        print(f"\nTesting MCP tools list for token: {url_token}")

        url = f"{self.base_url}/mcp/{url_token}/"

        # MCP tools list request
        tools_request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {},
        }

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            response = requests.post(url, json=tools_request, headers=headers)

            if response.status_code == 200:
                data = response.json()
                if "result" in data and "tools" in data["result"]:
                    tools = data["result"]["tools"]
                    print("✅ MCP tools list successful!")
                    print(f"   Available tools: {len(tools)}")
                    for tool in tools:
                        print(f"   - {tool['name']}: {tool['description']}")
                    return True
                else:
                    print("❌ Unexpected response format")
                    print(f"   Response: {data}")
                    return False
            else:
                print(f"❌ MCP tools list failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def test_get_html_for_reference(self, url_token: str, capture_slug: str) -> bool:
        """Test get_html_for_reference tool."""
        print(f"\nTesting get_html_for_reference tool for capture: {capture_slug}")

        url = f"{self.base_url}/mcp/{url_token}/"

        # MCP tool call request
        tool_request = {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": "get_html_for_reference",
                "arguments": {"capture_slug": capture_slug},
            },
        }

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            response = requests.post(url, json=tool_request, headers=headers)

            if response.status_code == 200:
                data = response.json()
                if "result" in data and "content" in data["result"]:
                    html_content = data["result"]["content"][0]["text"]
                    print("✅ get_html_for_reference tool successful!")
                    print(f"   HTML length: {len(html_content)} characters")
                    print(f"   Preview: {html_content[:100]}...")
                    return True
                else:
                    print("❌ get_html_for_reference tool returned unexpected format")
                    print(f"   Response: {data}")
                    return False
            else:
                print(f"❌ get_html_for_reference tool failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def test_get_screenshot_for_reference(
        self, url_token: str, capture_slug: str
    ) -> bool:
        """Test get_screenshot_for_reference tool."""
        print(
            f"\nTesting get_screenshot_for_reference tool for capture: {capture_slug}"
        )

        url = f"{self.base_url}/mcp/{url_token}/"

        # MCP tool call request
        tool_request = {
            "jsonrpc": "2.0",
            "id": 4,
            "method": "tools/call",
            "params": {
                "name": "get_screenshot_for_reference",
                "arguments": {"capture_slug": capture_slug},
            },
        }

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            response = requests.post(url, json=tool_request, headers=headers)

            if response.status_code == 200:
                data = response.json()
                if "result" in data and "content" in data["result"]:
                    print("✅ get_screenshot_for_reference tool successful!")
                    print(
                        f"   Content-Type: {response.headers.get('Content-Type', 'Unknown')}"
                    )
                    print(f"   Content-Length: {len(response.content)} bytes")
                    return True
                else:
                    print(
                        "❌ get_screenshot_for_reference tool returned unexpected format"
                    )
                    print(f"   Response: {data}")
                    return False
            else:
                print(
                    f"❌ get_screenshot_for_reference tool failed: {response.status_code}"
                )
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def deactivate_mcp_url_api(self, url_token: str) -> bool:
        """Deactivate an MCP URL via API."""
        print(f"\nDeactivating MCP URL: {url_token}")

        response = requests.delete(
            f"{self.base_url}/api/mcp/{url_token}/deactivate/", headers=self.headers
        )

        if response.status_code == 200:
            print("✅ MCP URL deactivated successfully!")
            return True
        else:
            print(f"❌ Failed to deactivate MCP URL: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    def run_comprehensive_test(self, capture_slug: Optional[str] = None):
        """Run a comprehensive test of the MCP server functionality."""
        print("🚀 Starting Comprehensive MCP Server Test Suite")
        print("=" * 60)

        # Step 1: Test MCP Server Setup
        if not self.test_mcp_server_setup():
            print("❌ MCP Server setup failed")
            return

        # Step 2: Create test data
        user, mcp_url, capture = self.create_test_user_and_data()
        if not all([user, mcp_url, capture]):
            print("❌ Failed to create test data")
            return

        # Use provided capture_slug or the test capture
        test_capture_slug = capture_slug or capture.slug

        # Step 3: Test MCP initialization
        if not self.test_mcp_initialize(mcp_url.url_token):
            print("❌ MCP initialization failed, stopping test")
            return

        # Step 4: Test MCP tools list
        if not self.test_mcp_tools_list(mcp_url.url_token):
            print("❌ MCP tools list failed, stopping test")
            return

        # Step 5: Test get_html_for_reference tool
        self.test_get_html_for_reference(mcp_url.url_token, test_capture_slug)

        # Step 6: Test get_screenshot_for_reference tool
        self.test_get_screenshot_for_reference(mcp_url.url_token, test_capture_slug)

        # Step 7: Test API endpoints (if auth token is provided)
        if self.auth_token:
            print("\n" + "=" * 40)
            print("Testing API Endpoints...")
            self.create_mcp_url_api()
            self.list_mcp_urls_api()

        print("\n" + "=" * 60)
        print("✅ Comprehensive MCP Server Test Suite Completed!")
        print(f"\nTest Summary:")
        print(f"- MCP URL Token: {mcp_url.url_token}")
        print(f"- Test Capture Slug: {test_capture_slug}")
        print(f"- MCP Server URL: {mcp_url.mcp_url}")
        print(f"\nAvailable Tools:")
        print(f"- get_html_for_reference(capture_slug: str) -> str")
        print(f"- get_screenshot_for_reference(capture_slug: str) -> str (base64)")


def main():
    """Main function to run the comprehensive MCP server test."""

    # Configuration - Update these values as needed
    BASE_URL = "http://localhost:8000"
    AUTH_TOKEN = None  # Set to your auth token if testing API endpoints
    CAPTURE_SLUG = None  # Set to specific capture slug if needed

    # Create tester instance
    tester = CaptureMCPServerTester(BASE_URL, AUTH_TOKEN)

    # Run the comprehensive test
    tester.run_comprehensive_test(CAPTURE_SLUG)


if __name__ == "__main__":
    main()
