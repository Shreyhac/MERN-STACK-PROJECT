from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSourceUpdateSerializer(serializers.Serializer):
    """Serializer for updating user source."""

    source = serializers.CharField(max_length=100, allow_blank=True)  # type: ignore

    def validate_source(self, value):
        """Validate that source is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Source cannot be empty.")
        return value.strip()

    def update(self, instance, validated_data):
        """Update the user's source if it's currently null."""
        source = validated_data.get("source")

        # Only update if current source is null and new source is not empty
        if instance.source is None and source:
            instance.source = source
            instance.save(update_fields=["source"])

        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with additional details."""

    full_name = serializers.ReadOnlyField()
    mcp_url = serializers.SerializerMethodField()
    capture_count = serializers.SerializerMethodField()
    remaining_free_captures = serializers.SerializerMethodField()
    can_create_capture = serializers.SerializerMethodField()
    free_capture_limit = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "profile_picture",
            "last_login",
            "source",
            "mcp_url",
            "capture_count",
            "remaining_free_captures",
            "can_create_capture",
            "free_capture_limit",
        ]
        read_only_fields = [
            "id",
            "email",
            "date_joined",
            "last_login",
            "mcp_url",
            "capture_count",
            "remaining_free_captures",
            "can_create_capture",
            "free_capture_limit",
        ]

    def get_mcp_url(self, obj):
        """Get the MCP URL for the user."""
        try:
            return obj.get_mcp_url()
        except Exception:
            return None

    def get_capture_count(self, obj):
        """Get the total number of captures for this user."""
        return obj.get_capture_count()

    def get_remaining_free_captures(self, obj):
        """Get the number of remaining free captures for this user."""
        return obj.get_remaining_free_captures()

    def get_can_create_capture(self, obj):
        """Check if user can create a new capture."""
        return obj.can_create_capture()
