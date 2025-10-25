"""
URL configuration for core project.
"""

from django.urls import path, include
from . import views

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    path("", include("social_django.urls", namespace="social")),
    path("", include("users.urls")),
    path("captures/", include("captures.urls")),
    path("", include("capture_mcp_server.urls")),
]
