import os
import boto3
import base64
from django.conf import settings
from rest_framework import serializers

s3_client = boto3.client("s3")


def upload_to_s3(content, file_key, content_type):
    """
    Upload content to S3 and return the file key.

    Args:
        content: The content to upload (string or bytes)
        file_key: The S3 key for the file
        content_type: The MIME type of the content

    Returns:
        str: The file key if successful

    Raises:
        serializers.ValidationError: If upload fails
    """
    try:
        # Handle base64 encoded content for PNG
        if content_type == "image/png" and isinstance(content, str):
            try:
                content = base64.b64decode(content)
            except Exception:
                raise serializers.ValidationError("Invalid base64 encoded PNG data")

        s3_client.put_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=file_key,
            Body=content,
            ContentType=content_type,
        )
        return file_key
    except Exception as e:
        raise serializers.ValidationError(f"Failed to upload to S3: {str(e)}")


def get_s3_url(file_key):
    """
    Generate a presigned URL for accessing a file in S3.

    Args:
        file_key: The S3 key of the file

    Returns:
        str: Presigned URL for the file
    """

    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file_key},
            ExpiresIn=3600,  # URL expires in 1 hour
        )
        return url
    except Exception as e:
        return None
