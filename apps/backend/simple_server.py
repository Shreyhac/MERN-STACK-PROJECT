#!/usr/bin/env python3
"""
Simple Django test server for Web to MCP
"""
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.simple_settings')

if __name__ == '__main__':
    # Run migrations
    execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
    
    # Start server
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])
