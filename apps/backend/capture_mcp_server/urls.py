from django.urls import path
from . import views

app_name = "capture_mcp_server"

urlpatterns = [
    # MCP server endpoint using django-mcp-server library
    path(
        "mcp/<str:url_token>/", views.CaptureMCPServerView.as_view(), name="mcp_server"
    ),
]
