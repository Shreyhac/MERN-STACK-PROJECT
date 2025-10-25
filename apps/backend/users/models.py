from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Custom user model with additional fields for OAuth2."""

    # Additional fields for OAuth2
    google_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    profile_picture = models.URLField(max_length=1500, blank=True, null=True)

    # Override email field to be unique
    email = models.EmailField(unique=True)

    # Make username optional since we're using email for authentication
    username = models.CharField(max_length=150, blank=True, null=True)


    # Free tier limit - can be customized per user
    free_capture_limit = models.PositiveIntegerField(
        default=5, help_text="Number of free captures allowed for this user"
    )

    # Source field to track where the user came from
    source = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Source that brought the user to the platform",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return the full name of the user."""
        return f"{self.first_name} {self.last_name}".strip() or self.email


    def get_mcp_url(self) -> str:
        """Get the user's MCP URL, creating one if it doesn't exist."""
        from capture_mcp_server.models import MCPUrl

        mcp_url = MCPUrl.get_or_create_for_user(self)
        return mcp_url.mcp_url  # type: ignore[return-value]


    def get_capture_count(self) -> int:
        """Get the total number of captures for this user."""
        return self.captures.count()  # type: ignore[attr-defined]

    def can_create_capture(self) -> bool:
        """Check if user can create a new capture based on their free tier limit."""
        # For all users, check if they've used their free capture limit
        capture_count = self.get_capture_count()
        return capture_count < self.free_capture_limit

    def get_remaining_free_captures(self) -> int:
        """Get the number of remaining free captures for this user."""
        capture_count = self.get_capture_count()
        remaining = self.free_capture_limit - capture_count
        return max(0, remaining)
