from rest_framework.exceptions import APIException
from rest_framework import status


class CaptureLimitExceededException(APIException):
    """Exception raised when user exceeds their capture limit."""

    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_detail = "You have exceeded your free capture limit. Please upgrade to continue capturing websites."
    default_code = "capture_limit_exceeded"

    def __init__(self, detail=None, code=None, remaining_captures=0, total_limit=10):
        if detail is None:
            detail = f"You have used all {total_limit} free captures. Please upgrade to continue capturing websites."
        super().__init__(detail, code)
        self.remaining_captures = remaining_captures
        self.total_limit = total_limit
