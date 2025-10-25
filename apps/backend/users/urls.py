from django.urls import path
from . import views, auth_views

app_name = "users"

urlpatterns = [
    # User endpoints
    path("user/", views.get_user, name="get_user"),
    path("user/source/", views.update_user_source, name="update_user_source"),
    # Authentication endpoints
    path("auth/logout/", auth_views.auth_logout, name="auth_logout"),
]
