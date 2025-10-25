from django.urls import path
from . import views

app_name = "captures"

urlpatterns = [
    # Create a new capture
    path("create/", views.CaptureCreateView.as_view(), name="capture_create"),
    # List all captures for the user
    path("list/", views.CaptureListView.as_view(), name="capture_list"),
    # Get capture details by slug
    path("<str:slug>/", views.CaptureDetailView.as_view(), name="capture_detail"),
    # Custom actions for serving HTML and image content
    path(
        "<str:slug>/html/",
        views.CaptureDetailView.as_view(),
        {"action": "serve_html"},
        name="capture_html",
    ),
    path(
        "<str:slug>/image/",
        views.CaptureDetailView.as_view(),
        {"action": "serve_image"},
        name="capture_image",
    ),
]
