#!/usr/bin/env python3
"""
Setup script for Cursor MCP connection
This script helps configure Cursor to connect to the Web to MCP server
"""

import json
import os
import sys
from pathlib import Path

def get_cursor_config_path():
    """Get the Cursor configuration directory"""
    if sys.platform == "darwin":  # macOS
        return Path.home() / "Library" / "Application Support" / "Cursor" / "User"
    elif sys.platform == "win32":  # Windows
        return Path.home() / "AppData" / "Roaming" / "Cursor" / "User"
    else:  # Linux
        return Path.home() / ".config" / "Cursor" / "User"

def create_cursor_mcp_config():
    """Create Cursor MCP configuration"""
    config_dir = get_cursor_config_path()
    config_dir.mkdir(parents=True, exist_ok=True)
    
    config_file = config_dir / "globalStorage" / "mcp_config.json"
    config_file.parent.mkdir(parents=True, exist_ok=True)
    
    mcp_config = {
        "mcpServers": {
            "web-to-mcp": {
                "command": "python3",
                "args": [str(Path(__file__).parent / "backend" / "mcp_server.py")],
                "env": {
                    "PYTHONPATH": str(Path(__file__).parent / "backend")
                }
            }
        }
    }
    
    with open(config_file, 'w') as f:
        json.dump(mcp_config, f, indent=2)
    
    print(f"✅ Cursor MCP config created: {config_file}")
    return config_file

def create_cursor_settings():
    """Create Cursor settings with MCP enabled"""
    config_dir = get_cursor_config_path()
    settings_file = config_dir / "settings.json"
    
    # Read existing settings or create new
    if settings_file.exists():
        with open(settings_file, 'r') as f:
            settings = json.load(f)
    else:
        settings = {}
    
    # Add MCP settings
    settings["mcp.enabled"] = True
    settings["mcp.autoConnect"] = True
    settings["mcp.servers"] = {
        "web-to-mcp": {
            "enabled": True,
            "autoStart": True
        }
    }
    
    with open(settings_file, 'w') as f:
        json.dump(settings, f, indent=2)
    
    print(f"✅ Cursor settings updated: {settings_file}")

def main():
    """Main setup function"""
    print("🚀 Setting up Cursor MCP connection for Web to MCP...")
    
    try:
        # Create MCP config
        config_file = create_cursor_mcp_config()
        
        # Create settings
        create_cursor_settings()
        
        print("\n✅ Setup complete!")
        print("\n📋 Next steps:")
        print("1. Restart Cursor")
        print("2. Open a new chat in Cursor")
        print("3. Use the extension to capture components")
        print("4. In Cursor, you can now use:")
        print("   - 'List my captures' to see captured components")
        print("   - 'Analyze component [capture-id]' to analyze specific captures")
        print("   - 'Show me the HTML from [capture-id]' to see component code")
        
        print(f"\n🔗 MCP Server will run at: {config_file}")
        print("📁 Extension downloads: http://localhost:5174/extension-download")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
