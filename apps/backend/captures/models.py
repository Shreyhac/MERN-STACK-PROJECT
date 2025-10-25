import uuid
from django.db import models
from django.conf import settings


class Capture(models.Model):
    """Model for storing website captures with HTML, PNG, and metadata."""

    # Generate a unique slug using UUID
    slug = models.CharField(
        max_length=36, unique=True, default=uuid.uuid4, editable=False
    )

    # User who created the capture
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="captures"
    )

    # Website URL that was captured
    website_url = models.URLField(max_length=5000)

    # Token count from the capture
    token_count = models.IntegerField()

    # S3 file references
    html_file_key = models.CharField(max_length=500, blank=True)
    png_file_key = models.CharField(max_length=500, blank=True)

    # Archive status
    archived = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "captures"

    def __str__(self) -> str:
        return f"Capture {self.slug} - {self.website_url}"

    def save(self, *args, **kwargs) -> None:
        # Ensure slug is set if not already
        if not self.slug:
            self.slug = str(uuid.uuid4())
        super().save(*args, **kwargs)
