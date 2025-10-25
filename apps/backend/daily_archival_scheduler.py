"""
Daily archival scheduler service for archiving old captures.
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
        logging.FileHandler("daily_archival.log", encoding="utf-8"),
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

from captures.archival_service import ArchivalService


def run_daily_archival():
    """
    Main function to run the daily archival process.
    This function can be called by a cron job or scheduled task.
    """
    try:
        logger.info("Starting daily archival process")

        # Initialize archival service
        archival_service = ArchivalService()

        # Run archival for captures older than 7 days
        logger.info("Archiving captures older than 7 days")
        summary = archival_service.archive_old_captures(days_old=7)

        # Log summary
        logger.info(f"Archival process completed. Summary: {summary}")

        if summary["failed_archivals"] > 0:
            logger.warning(f"Some captures failed to archive: {summary['errors']}")
            return False

        logger.info("Daily archival process completed successfully")
        return True

    except Exception as e:
        logger.error(f"Error in daily archival process: {str(e)}")
        return False


def main():
    success = run_daily_archival()
    if success:
        logger.info("Daily archival completed successfully")
        return 0
    else:
        logger.error("Daily archival failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
