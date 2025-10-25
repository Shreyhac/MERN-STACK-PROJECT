from rest_framework import serializers
from .models import Capture
from .utils import upload_to_s3
from .exceptions import CaptureLimitExceededException


class CaptureCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new capture."""

    # Custom fields for file uploads
    html = serializers.CharField(write_only=True, required=False)
    png_screenshot = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Capture
        fields = ["website_url", "token_count", "html", "png_screenshot"]

    def create(self, validated_data):
        user = self.context["request"].user

        # Check if user can create a capture
        if not user.can_create_capture():
            remaining = user.get_remaining_free_captures()
            raise CaptureLimitExceededException(
                remaining_captures=remaining, total_limit=user.free_capture_limit
            )

        # Extract file data
        html_content = validated_data.pop("html", None)
        png_content = validated_data.pop("png_screenshot", None)

        # Create capture instance
        capture = Capture.objects.create(user=user, **validated_data)

        # Upload files to S3 and update file keys
        if html_content:
            capture.html_file_key = upload_to_s3(
                html_content, f"captures/{capture.slug}/html.html", "text/html"
            )

        if png_content:
            capture.png_file_key = upload_to_s3(
                png_content, f"captures/{capture.slug}/screenshot.png", "image/png"
            )

        capture.save()
        return capture


class CaptureResponseSerializer(serializers.ModelSerializer):
    """Serializer for capture response."""

    class Meta:
        model = Capture
        fields = ["slug", "website_url", "token_count", "created_at"]
        read_only_fields = ["slug", "created_at"]


class CaptureDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed capture view."""

    class Meta:
        model = Capture
        fields = [
            "slug",
            "website_url",
            "token_count",
            "html_file_key",
            "png_file_key",
            "archived",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "slug",
            "html_file_key",
            "png_file_key",
            "archived",
            "created_at",
            "updated_at",
        ]
