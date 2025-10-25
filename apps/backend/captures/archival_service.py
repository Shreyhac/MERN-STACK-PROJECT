"""
Archival service for managing capture archival operations.
Handles S3 file deletion and marking captures as archived.
"""

import boto3
import logging
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from captures.models import Capture

logger = logging.getLogger(__name__)

# Initialize S3 client
s3_client = boto3.client("s3")


class ArchivalService:
    """Service for handling capture archival operations."""

    def __init__(self):
        self.s3_client = s3_client

    def delete_s3_file(self, file_key):
        """
        Delete a file from S3.

        Args:
            file_key (str): The S3 key of the file to delete

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if not file_key:
                return True  # No file to delete

            self.s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_key
            )
            logger.info(f"Successfully deleted S3 file: {file_key}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete S3 file {file_key}: {str(e)}")
            return False

    def archive_capture(self, capture):
        """
        Archive a single capture by deleting S3 files and marking as archived.

        Args:
            capture (Capture): The capture instance to archive

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            logger.info(f"Starting archival for capture {capture.slug}")

            # Delete HTML file from S3
            html_deleted = self.delete_s3_file(capture.html_file_key)

            # Delete PNG file from S3
            png_deleted = self.delete_s3_file(capture.png_file_key)

            # Mark as archived regardless of S3 deletion results
            # (we want to mark as archived even if S3 deletion fails)
            capture.archived = True
            capture.save(update_fields=["archived"])

            logger.info(f"Successfully archived capture {capture.slug}")
            return True

        except Exception as e:
            logger.error(f"Failed to archive capture {capture.slug}: {str(e)}")
            return False

    def get_captures_to_archive(self, days_old=7):
        """
        Get captures that are older than the specified number of days.

        Args:
            days_old (int): Number of days after which captures should be archived

        Returns:
            QuerySet: Captures that need to be archived
        """
        cutoff_date = timezone.now() - timedelta(days=days_old)
        return Capture.objects.filter(created_at__lt=cutoff_date, archived=False)

    def archive_old_captures(self, days_old=7):
        """
        Archive all captures older than the specified number of days.

        Args:
            days_old (int): Number of days after which captures should be archived

        Returns:
            dict: Summary of archival operation
        """
        logger.info(
            f"Starting archival process for captures older than {days_old} days"
        )

        # Get captures to archive
        captures_to_archive = self.get_captures_to_archive(days_old)
        total_captures = captures_to_archive.count()

        logger.info(f"Found {total_captures} captures to archive")

        if total_captures == 0:
            logger.info("No captures found to archive")
            return {
                "total_captures": 0,
                "successful_archivals": 0,
                "failed_archivals": 0,
                "errors": [],
            }

        successful_archivals = 0
        failed_archivals = 0
        errors = []

        # Process each capture individually
        for capture in captures_to_archive:
            try:
                success = self.archive_capture(capture)
                if success:
                    successful_archivals += 1
                else:
                    failed_archivals += 1
                    errors.append(f"Failed to archive capture {capture.slug}")
            except Exception as e:
                failed_archivals += 1
                error_msg = f"Exception archiving capture {capture.slug}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)

        summary = {
            "total_captures": total_captures,
            "successful_archivals": successful_archivals,
            "failed_archivals": failed_archivals,
            "errors": errors,
        }

        logger.info(f"Archival process completed. Summary: {summary}")
        return summary
