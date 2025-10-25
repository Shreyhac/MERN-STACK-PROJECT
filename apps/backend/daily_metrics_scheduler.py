"""
Simple scheduler service for daily metrics reporting.
This can be run as a cron job or scheduled task.
"""

import os
import sys
import django
from pathlib import Path
import logging
from datetime import datetime
import pytz

# Add the project root to Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("daily_metrics.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
env_file = project_root / ".env"
if env_file.exists():
    logger.info(f"Loading environment variables from {env_file}")
    # Load .env file manually since decouple doesn't auto-load from custom path
    with open(env_file, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value
    logger.info("Environment variables loaded successfully")
else:
    logger.warning(f"No .env file found at {env_file}")

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from core.metrics_service import MetricsService
from core.plotting_service import PlottingService
from core.slack_service import SlackService


def run_daily_metrics_report():
    """
    Main function to run the daily metrics report.
    This function can be called by a cron job or scheduled task.
    """
    try:
        logger.info("Starting daily metrics report generation")

        # Initialize services
        metrics_service = MetricsService()
        plotting_service = PlottingService()
        slack_service = SlackService()

        # Calculate metrics
        logger.info("Calculating daily metrics")
        metrics = metrics_service.calculate_daily_metrics()

        # Format metrics message
        message = metrics_service.format_metrics_message(metrics)

        # Log metrics for debugging
        logger.info(f"Calculated metrics: {metrics}")

        # Post metrics message to Slack
        logger.info("Posting metrics message to Slack")
        message_success = slack_service.post_message(message)

        if not message_success:
            logger.error("Failed to post metrics message to Slack")
            return False

        logger.info("Metrics message posted successfully")

        # Generate time series data and plots
        logger.info("Generating time series plots")
        time_series_data = metrics_service.get_time_series_data()
        plot_paths = plotting_service.create_all_time_series_plots(time_series_data)

        if plot_paths:
            logger.info(f"Created {len(plot_paths)} plots")

            # Post plots to Slack
            logger.info("Posting plots to Slack")
            plot_titles = [
                "*Daily Signups Trend*",
                "*Daily Subscriptions Trend*",
                "*Daily Captures Trend*",
            ]

            plots_success = slack_service.post_images(plot_paths, plot_titles)

            if plots_success:
                logger.info("All plots posted successfully")
            else:
                logger.warning("Some plots failed to post")

            # Cleanup old plots
            plotting_service.cleanup_old_plots()

        else:
            logger.warning("No plots were generated")

        logger.info("Daily metrics report completed successfully")
        return True

    except Exception as e:
        logger.error(f"Error in daily metrics report: {str(e)}")
        return False


def test_slack_connection():
    """Test Slack connection."""
    try:
        slack_service = SlackService()
        return slack_service.test_connection()
    except Exception as e:
        logger.error(f"Slack connection test failed: {str(e)}")
        return False


def main():
    success = run_daily_metrics_report()
    if success:
        logger.info("Daily metrics report completed successfully")
        return 0
    else:
        logger.error("Daily metrics report failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
