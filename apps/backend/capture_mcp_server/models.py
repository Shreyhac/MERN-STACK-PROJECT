import uuid
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from users.models import CustomUser


class MCPUrl(models.Model):
    """Model for storing unique MCP URLs for users to access their captures."""

    # Generate a unique URL token using UUID
    url_token = models.CharField(
        max_length=36, unique=True, default=uuid.uuid4, editable=False
    )

    # User who owns this MCP URL
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mcp_urls"
    )

    # Whether this URL is active
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "mcp_urls"

    def __str__(self) -> str:
        return f"MCP URL {self.url_token} - {self.user.username}"

    def save(self, *args, **kwargs) -> None:
        # Ensure url_token is set if not already
        if not self.url_token:
            self.url_token = str(uuid.uuid4())
        super().save(*args, **kwargs)

    @property
    def mcp_url(self) -> str:
        """Generate the full MCP URL for this token."""
        from django.conf import settings

        base_url = getattr(settings, "MCP_BASE_URL", "http://localhost:8000")
        return f"{base_url}/mcp/{self.url_token}/"

    @classmethod
    def get_or_create_for_user(cls, user: "CustomUser") -> "MCPUrl":
        """Get or create an MCP URL for a user."""
        mcp_url, created = cls.objects.get_or_create(
            user=user, defaults={"is_active": True}
        )
        return mcp_url


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_mcp_url_for_user(sender, instance, created, **kwargs) -> None:
    """Automatically create an MCP URL when a new user is created."""
    if created:
        MCPUrl.objects.create(user=instance, is_active=True)
