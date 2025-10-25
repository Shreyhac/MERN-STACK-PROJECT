"""
Slack integration service for posting messages and images.
"""

import os
from typing import List, Optional, cast
from django.conf import settings
import logging
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import requests

logger = logging.getLogger(__name__)


class SlackService:
    """Service for posting messages and images to Slack."""

    def __init__(self):
        self.webhook_url = os.getenv("SLACK_WEBHOOK_URL")
        self.channel_name = os.getenv("SLACK_CHANNEL", "#general")  # For messages
        self.channel_id = os.getenv("SLACK_CHANNEL_ID")  # For file uploads
        self.bot_token = os.getenv("SLACK_BOT_TOKEN")

        # Initialize Slack WebClient if bot token is available
        self.client = None
        if self.bot_token:
            self.client = WebClient(token=self.bot_token)

        if not self.webhook_url and not self.bot_token:
            logger.warning("No Slack webhook URL or bot token configured")

    def post_message(self, message: str, channel: Optional[str] = None) -> bool:
        """
        Post a text message to Slack.

        Args:
            message: The message to post
            channel: Optional channel override

        Returns:
            True if successful, False otherwise
        """
        target_channel = channel or self.channel_name

        if not target_channel:
            logger.error("No channel specified and SLACK_CHANNEL not configured")
            return False

        logger.info(f"Using channel: {target_channel}")

        if self.webhook_url:
            return self._post_via_webhook(message, target_channel)
        elif self.bot_token:
            return self._post_via_api(message, target_channel)
        else:
            logger.error("No Slack configuration available")
            return False

    def post_image(
        self, image_path: str, title: str = "", channel: Optional[str] = None
    ) -> bool:
        """
        Post an image to Slack using files_upload_v2.

        Args:
            image_path: Path to the image file
            title: Optional title for the image
            channel: Optional channel override

        Returns:
            True if successful, False otherwise
        """
        if not self.client:
            logger.error(
                "Slack WebClient not initialized - bot token required for image uploads"
            )
            return False

        target_channel = channel or self.channel_id

        if not target_channel:
            logger.error(
                "No channel specified and SLACK_CHANNEL_ID not configured for file uploads"
            )
            return False

        logger.info(f"Using channel ID for file upload: {target_channel}")

        try:
            with open(image_path, "rb") as image_file:
                response = self.client.files_upload_v2(
                    channel=target_channel,
                    file=image_file,
                    title=title,
                    initial_comment=title if title else "",
                )

                if response["ok"]:
                    logger.info(f"Successfully posted image: {title}")
                    return True
                else:
                    logger.error(f"Slack API error: {response.get('error')}")
                    return False

        except FileNotFoundError:
            logger.error(f"Image file not found: {image_path}")
            return False
        except SlackApiError as e:
            logger.error(f"Slack API error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error posting image: {str(e)}")
            return False

    def post_images(
        self,
        image_paths: List[str],
        titles: Optional[List[str]] = None,
        channel: Optional[str] = None,
    ) -> bool:
        """
        Post multiple images to Slack.

        Args:
            image_paths: List of image file paths
            titles: Optional list of titles for images
            channel: Optional channel override

        Returns:
            True if all images posted successfully, False otherwise
        """
        if not image_paths:
            return True

        if titles is None:
            titles = [f"Chart {i+1}" for i in range(len(image_paths))]

        success_count = 0
        for image_path, title in zip(image_paths, titles):
            if self.post_image(image_path, title, channel):
                success_count += 1

        return success_count == len(image_paths)

    def _post_via_webhook(self, message: str, channel: str) -> bool:
        """Post message via Slack webhook."""
        try:
            payload = {"text": message, "channel": channel}

            response = requests.post(
                cast(str, self.webhook_url), json=payload, timeout=10
            )

            if response.status_code == 200:
                logger.info("Successfully posted message via webhook")
                return True
            else:
                logger.error(f"Webhook error {response.status_code}: {response.text}")
                return False

        except Exception as e:
            logger.error(f"Error posting via webhook: {str(e)}")
            return False

    def _post_via_api(self, message: str, channel: str) -> bool:
        """Post message via Slack API using WebClient."""
        if not self.client:
            logger.error("Slack WebClient not initialized")
            return False

        try:
            response = self.client.chat_postMessage(channel=channel, text=message)

            if response["ok"]:
                logger.info("Successfully posted message via API")
                return True
            else:
                logger.error(f"Slack API error: {response.get('error')}")
                return False

        except SlackApiError as e:
            logger.error(f"Slack API error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error posting via API: {str(e)}")
            return False

    def test_connection(self) -> bool:
        """
        Test the Slack connection.

        Returns:
            True if connection is working, False otherwise
        """
        test_message = (
            "[TEST] Slack integration test - Daily metrics reporting is working!"
        )
        return self.post_message(test_message)
