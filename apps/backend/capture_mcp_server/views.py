import boto3
import base64
import logging
from django.conf import settings
from mcp.types import ImageContent
from mcp_server.djangomcp import DjangoMCP  # type: ignore[import-untyped]
from mcp_server.views import MCPServerStreamableHttpView  # type: ignore[import-untyped]
from django.http import JsonResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import AllowAny
from asgiref.sync import sync_to_async

from captures.models import Capture

# Set up logging
logger = logging.getLogger(__name__)

s3_client = boto3.client("s3", region_name=settings.AWS_S3_REGION_NAME)

# Create a custom MCP server instance
capture_mcp_server = DjangoMCP(name="website-to-mcp", stateless=True)


@capture_mcp_server.tool()
async def get_html_for_reference(capture_slug: str) -> str:
    """
    Get HTML code for a specific capture. This should only be called once. Then you should call get_screenshot_for_reference to get the screenshot. The class names used int eh reference wont be available in the current project. Hence do not rely on them. Create new classes based on the style attributes. Do not use inline styles in the generated code. Ignore the data attributes.

    Args:
        capture_slug: The UUID slug of the capture

    Returns:
        The HTML content of the capture
    """
    logger.debug(f"get_html_for_reference called with capture_slug: {capture_slug}")

    if not capture_slug:
        raise ValueError("capture_slug parameter is required")

    try:
        # Get the capture by slug only (UUIDs are unguessable)
        capture = await sync_to_async(Capture.objects.get)(slug=capture_slug)

        if not capture.html_file_key:
            raise ValueError("HTML file not found for this capture")

        # Get HTML content from S3 (async)
        response = await sync_to_async(s3_client.get_object)(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=capture.html_file_key
        )

        html_content = response["Body"].read().decode("utf-8")
        logger.debug(
            f"Successfully retrieved HTML for capture {capture_slug}, length: {len(html_content)}"
        )
        return html_content

    except Capture.DoesNotExist:
        logger.warning(f"Capture {capture_slug} not found")
        raise ValueError("Capture not found")
    except Exception as e:
        logger.error(f"Error retrieving HTML for capture {capture_slug}: {str(e)}")
        raise ValueError(f"Error retrieving HTML: {str(e)}")


@capture_mcp_server.tool(structured_output=False)
async def get_screenshot_for_reference(capture_slug: str) -> ImageContent:
    """
    Get PNG screenshot for a specific capture. This should only be called after get_html_for_reference.

    Args:
        capture_slug: The UUID slug of the capture

    Returns:
        The PNG image data as base64-encoded string
    """
    if not capture_slug:
        raise ValueError("capture_slug parameter is required")

    logger.debug(f"get_screenshot_for_reference called for capture {capture_slug}")

    try:
        # Get the capture by slug only (UUIDs are unguessable)
        capture = await sync_to_async(Capture.objects.get)(slug=capture_slug)

        if not capture.png_file_key:
            raise ValueError("Screenshot file not found for this capture")

        # Get PNG content from S3 (async)
        response = await sync_to_async(s3_client.get_object)(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=capture.png_file_key
        )

        png_content = response["Body"].read()

        # Convert to base64 for JSON serialization
        base64_content = base64.b64encode(png_content).decode("utf-8")
        logger.debug(
            f"Successfully retrieved screenshot for capture {capture_slug}, size: {len(png_content)} bytes"
        )
        return ImageContent(
            type="image",
            data=base64_content,
            mimeType="image/png",
        )

    except Capture.DoesNotExist:
        logger.warning(f"Capture {capture_slug} not found")
        raise ValueError("Capture not found")
    except Exception as e:
        logger.error(
            f"Error retrieving screenshot for capture {capture_slug}: {str(e)}"
        )
        raise ValueError(f"Error retrieving screenshot: {str(e)}")


class CaptureMCPServerView(MCPServerStreamableHttpView):
    """Custom MCP server view that handles MCP requests."""

    # Disable authentication for MCP endpoints
    authentication_classes: list[BaseAuthentication] = []
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        logger.debug(f"MCP request received: {request.method} {request.path}")

        # Use our custom MCP server
        self.mcp_server = capture_mcp_server

        # Handle GET requests (for clients that make GET requests)
        if request.method == "GET":
            return self.handle_get_request(request, *args, **kwargs)

        # Handle POST requests normally
        return super().dispatch(request, *args, **kwargs)

    def handle_get_request(self, request, *args, **kwargs):
        """Handle GET requests to the MCP endpoint."""
        # Return a simple response indicating this is an MCP server
        return JsonResponse(
            {
                "jsonrpc": "2.0",
                "id": None,
                "result": {
                    "serverInfo": {"name": "website-to-mcp", "version": "1.0.0"},
                    "message": "This is an MCP server. Use POST requests for MCP protocol operations.",
                    "availableMethods": ["initialize", "tools/list", "tools/call"],
                },
            },
            content_type="application/json",
        )
