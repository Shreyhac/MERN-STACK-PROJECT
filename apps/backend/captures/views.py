from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.http import HttpResponse
import boto3
from core import settings

from .models import Capture
from .serializers import (
    CaptureCreateSerializer,
    CaptureResponseSerializer,
    CaptureDetailSerializer,
)
from .exceptions import CaptureLimitExceededException

# Initialize S3 client
s3_client = boto3.client("s3")


@method_decorator(csrf_exempt, name="dispatch")
class CaptureCreateView(APIView):
    """API view for creating a new capture."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create a new capture with HTML and PNG data."""
        serializer = CaptureCreateSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            try:
                capture = serializer.save()
                response_serializer = CaptureResponseSerializer(capture)
                return Response(
                    response_serializer.data, status=status.HTTP_201_CREATED
                )
            except CaptureLimitExceededException as e:
                return Response(
                    {
                        "error": str(e),
                        "code": "capture_limit_exceeded",
                        "remaining_captures": e.remaining_captures,
                        "upgrade_required": True,
                    },
                    status=e.status_code,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CaptureListView(ListAPIView):
    """API view for listing user's captures."""

    permission_classes = [IsAuthenticated]
    serializer_class = CaptureResponseSerializer

    def get_queryset(self):
        """Return captures for the authenticated user, excluding archived ones."""
        return Capture.objects.filter(user=self.request.user, archived=False)


class CaptureDetailView(RetrieveAPIView):
    """API view for retrieving a specific capture."""

    permission_classes = [IsAuthenticated]
    serializer_class = CaptureDetailSerializer
    lookup_field = "slug"
    queryset = Capture.objects.all()

    def get_object(self):
        """Get the capture object and check if it's archived."""
        capture = super().get_object()

        # Check if the capture is archived
        if capture.archived:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "Capture is not available anymore (it is deleted after 7 days)"
            )

        return capture

    def dispatch(self, request, *args, **kwargs):
        """Override dispatch to handle custom actions."""
        action = kwargs.pop("action", None)
        if action == "serve_html":
            return self.serve_html(request, kwargs.get("slug"))
        elif action == "serve_image":
            return self.serve_image(request, kwargs.get("slug"))
        return super().dispatch(request, *args, **kwargs)

    def serve_html(self, request, slug=None):
        """Serve the HTML content of the capture."""
        try:
            capture = self.get_object()

            # Check if the capture is archived
            if capture.archived:
                return HttpResponse(
                    "Capture is not available anymore (it is deleted after 7 days)",
                    status=400,
                    content_type="text/plain",
                )

            if not capture.html_file_key:
                return HttpResponse(
                    "HTML file not found for this capture",
                    status=404,
                    content_type="text/plain",
                )

            # Get HTML content from S3
            response = s3_client.get_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=capture.html_file_key
            )

            html_content = response["Body"].read().decode("utf-8")

            # Return HTML response
            return HttpResponse(html_content, content_type="text/html; charset=utf-8")

        except Exception as e:
            return HttpResponse(
                f"Error retrieving HTML: {str(e)}",
                status=500,
                content_type="text/plain",
            )

    def serve_image(self, request, slug=None):
        """Serve the PNG image of the capture."""
        try:
            capture = self.get_object()

            # Check if the capture is archived
            if capture.archived:
                return HttpResponse(
                    "Capture is not available anymore (it is deleted after 7 days)",
                    status=400,
                    content_type="text/plain",
                )

            if not capture.png_file_key:
                return HttpResponse(
                    "Image file not found for this capture",
                    status=404,
                    content_type="text/plain",
                )

            # Get PNG content from S3
            response = s3_client.get_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=capture.png_file_key
            )

            png_content = response["Body"].read()

            # Return PNG response
            return HttpResponse(png_content, content_type="image/png")

        except Exception as e:
            return HttpResponse(
                f"Error retrieving image: {str(e)}",
                status=500,
                content_type="text/plain",
            )
