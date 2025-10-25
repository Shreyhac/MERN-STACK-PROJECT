"""
Daily metrics calculation service for the application.
Calculates various business metrics for daily reporting.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import pytz
from django.db.models import Count, Q
from django.db import connection

from users.models import CustomUser, Subscription
from captures.models import Capture


class MetricsService:
    """Service for calculating daily business metrics."""

    def __init__(self):
        # Explicitly set IST timezone
        self.ist_timezone = pytz.timezone("Asia/Kolkata")

    def get_previous_day_range(self) -> Tuple[datetime, datetime]:
        """Get the start and end datetime for the previous day in IST."""
        # Get current IST time
        now_ist = datetime.now(self.ist_timezone)

        # Calculate previous day start and end
        previous_day_start = (now_ist - timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        previous_day_end = previous_day_start + timedelta(days=1)

        return previous_day_start, previous_day_end

    def get_current_month_range(self) -> Tuple[datetime, datetime]:
        """Get the start and end datetime for the current month in IST."""
        now_ist = datetime.now(self.ist_timezone)

        # First day of current month
        month_start = now_ist.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # First day of next month
        if now_ist.month == 12:
            month_end = now_ist.replace(
                year=now_ist.year + 1,
                month=1,
                day=1,
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )
        else:
            month_end = now_ist.replace(
                month=now_ist.month + 1,
                day=1,
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )

        return month_start, month_end

    def calculate_daily_metrics(self) -> Dict[str, int]:
        """Calculate all daily metrics for the previous day."""
        previous_day_start, previous_day_end = self.get_previous_day_range()
        current_month_start, current_month_end = self.get_current_month_range()

        metrics = {}

        # 1. Number of new signups previous day
        metrics["new_signups_yesterday"] = CustomUser.objects.filter(
            date_joined__gte=previous_day_start, date_joined__lt=previous_day_end
        ).count()

        # 2. Number of new subscriptions created previous day
        metrics["new_subscriptions_yesterday"] = Subscription.objects.filter(
            status__in=["active", "canceled"],
            created_at__gte=previous_day_start,
            created_at__lt=previous_day_end,
        ).count()

        # 3. Number of subscriptions cancelled the previous day
        metrics["subscriptions_cancelled_yesterday"] = Subscription.objects.filter(
            canceled_at__gte=previous_day_start, canceled_at__lt=previous_day_end
        ).count()

        # 4. Number of captures previous day
        metrics["captures_yesterday"] = Capture.objects.filter(
            created_at__gte=previous_day_start, created_at__lt=previous_day_end
        ).count()

        # 5. Number of unique users who did captures the previous day
        metrics["unique_users_captures_yesterday"] = (
            Capture.objects.filter(
                created_at__gte=previous_day_start, created_at__lt=previous_day_end
            )
            .values("user")
            .distinct()
            .count()
        )

        # 6. Number of users with active subscriptions who did captures the previous day
        metrics["active_subscribers_captures_yesterday"] = (
            Capture.objects.filter(
                created_at__gte=previous_day_start,
                created_at__lt=previous_day_end,
                user__subscriptions__status="active",
            )
            .values("user")
            .distinct()
            .count()
        )

        # 7. Current number of active subscriptions
        metrics["current_active_subscriptions"] = Subscription.objects.filter(
            status="active"
        ).count()

        # 8. Number of signups in the current month
        metrics["signups_current_month"] = CustomUser.objects.filter(
            date_joined__gte=current_month_start, date_joined__lt=current_month_end
        ).count()

        # 9. Number of subscriptions created in the current month
        metrics["subscriptions_current_month"] = Subscription.objects.filter(
            status__in=["active", "canceled"],
            created_at__gte=current_month_start,
            created_at__lt=current_month_end,
        ).count()

        return metrics

    def get_signups_by_source_yesterday(self) -> Dict[str, int]:
        """Get signups grouped by source for the previous day."""
        previous_day_start, previous_day_end = self.get_previous_day_range()

        # Get signups by source for yesterday
        signups_by_source = (
            CustomUser.objects.filter(
                date_joined__gte=previous_day_start, date_joined__lt=previous_day_end
            )
            .values("source")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        # Convert to dictionary, handling None sources
        result = {}
        for item in signups_by_source:
            source = item["source"] or "Unknown"
            result[source] = item["count"]

        return result

    def get_cancelled_users_yesterday(self) -> List[Dict[str, str]]:
        """Get user names and emails who cancelled their subscriptions yesterday."""
        previous_day_start, previous_day_end = self.get_previous_day_range()

        # Get users who cancelled subscriptions yesterday
        cancelled_users = (
            Subscription.objects.filter(
                canceled_at__gte=previous_day_start, canceled_at__lt=previous_day_end
            )
            .select_related("user")
            .values("user__email", "user__first_name", "user__last_name")
            .distinct()
        )

        # Format user data
        result = []
        for user_data in cancelled_users:
            first_name = user_data["user__first_name"] or ""
            last_name = user_data["user__last_name"] or ""
            full_name = f"{first_name} {last_name}".strip()

            if full_name:
                result.append({"name": full_name, "email": user_data["user__email"]})
            else:
                result.append(
                    {
                        "name": user_data["user__email"],
                        "email": user_data["user__email"],
                    }
                )

        return result

    def get_time_series_data(self) -> Dict[str, List[Dict]]:
        """Get time series data for the current month."""
        current_month_start, current_month_end = self.get_current_month_range()

        # Generate list of all days in current month
        days_in_month = []
        current_date = current_month_start
        while current_date < current_month_end:
            days_in_month.append(current_date)
            current_date += timedelta(days=1)

        time_series = {"signups": [], "subscriptions": [], "captures": []}

        for day in days_in_month:
            day_start = day
            day_end = day + timedelta(days=1)

            # Signups for this day
            signups_count = CustomUser.objects.filter(
                date_joined__gte=day_start, date_joined__lt=day_end
            ).count()

            # Subscriptions for this day
            subscriptions_count = Subscription.objects.filter(
                status__in=["active", "canceled"],
                created_at__gte=day_start,
                created_at__lt=day_end,
            ).count()

            # Captures for this day
            captures_count = Capture.objects.filter(
                created_at__gte=day_start, created_at__lt=day_end
            ).count()

            time_series["signups"].append(
                {"date": day.strftime("%Y-%m-%d"), "count": signups_count}
            )

            time_series["subscriptions"].append(
                {"date": day.strftime("%Y-%m-%d"), "count": subscriptions_count}
            )

            time_series["captures"].append(
                {"date": day.strftime("%Y-%m-%d"), "count": captures_count}
            )

        return time_series

    def format_metrics_message(self, metrics: Dict[str, int]) -> str:
        """Format metrics into a readable Slack message."""
        previous_day_start, _ = self.get_previous_day_range()
        date_str = previous_day_start.strftime("%B %d, %Y")

        message = f"*Daily Metrics Report - {date_str}*\n\n"

        message += "*Previous Day Metrics:*\n"
        message += f"• New Signups: {metrics['new_signups_yesterday']}\n"
        message += f"• New Subscriptions: {metrics['new_subscriptions_yesterday']}\n"
        message += f"• Cancelled Subscriptions: {metrics['subscriptions_cancelled_yesterday']}\n"
        message += f"• Total Captures: {metrics['captures_yesterday']}\n"
        message += (
            f"• Unique Users (Captures): {metrics['unique_users_captures_yesterday']}\n"
        )
        message += f"• Active Subscribers (Captures): {metrics['active_subscribers_captures_yesterday']}\n\n"

        # Add signups by source table
        signups_by_source = self.get_signups_by_source_yesterday()
        if signups_by_source:
            message += "*Signups by Source (Yesterday):*\n"
            for source, count in signups_by_source.items():
                message += f"• {source}: {count}\n"
            message += "\n"

        # Add cancelled users list
        cancelled_users = self.get_cancelled_users_yesterday()
        if cancelled_users:
            message += "*Users who Cancelled Subscriptions (Yesterday):*\n"
            for user in cancelled_users:
                message += f"• {user['name']} ({user['email']})\n"
            message += "\n"

        message += "*Current Status:*\n"
        message += (
            f"• Active Subscriptions: {metrics['current_active_subscriptions']}\n\n"
        )

        message += "*Current Month Totals:*\n"
        message += f"• Signups: {metrics['signups_current_month']}\n"
        message += f"• Subscriptions: {metrics['subscriptions_current_month']}\n"

        return message
