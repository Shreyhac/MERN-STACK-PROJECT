"""
Plotting service for generating time series graphs for metrics reporting.
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from datetime import datetime
from typing import List, Dict
from django.conf import settings
import os


class PlottingService:
    """Service for creating time series plots for metrics."""

    def __init__(self):
        # Set matplotlib backend to Agg for headless operation
        plt.switch_backend("Agg")

        # Configure matplotlib for better looking plots
        plt.style.use("default")
        self.setup_matplotlib_config()

    def setup_matplotlib_config(self):
        """Configure matplotlib for better looking plots."""
        plt.rcParams.update(
            {
                "figure.figsize": (12, 6),
                "figure.dpi": 100,
                "font.size": 10,
                "axes.titlesize": 14,
                "axes.labelsize": 12,
                "xtick.labelsize": 10,
                "ytick.labelsize": 10,
                "legend.fontsize": 10,
                "axes.grid": True,
                "grid.alpha": 0.3,
                "axes.spines.top": False,
                "axes.spines.right": False,
            }
        )

    def create_time_series_plot(
        self, data: List[Dict], title: str, ylabel: str, color: str = "#1f77b4"
    ) -> str:
        """
        Create a time series plot and return the file path.

        Args:
            data: List of dictionaries with 'date' and 'count' keys
            title: Title for the plot
            ylabel: Y-axis label
            color: Color for the line

        Returns:
            Path to the saved plot image
        """
        if not data:
            return ""

        # Extract dates and counts
        dates = [datetime.strptime(item["date"], "%Y-%m-%d") for item in data]
        counts = [item["count"] for item in data]

        # Create the plot
        fig, ax = plt.subplots(figsize=(12, 6))

        # Plot the data
        ax.plot(dates, counts, color=color, linewidth=2, marker="o", markersize=4)

        # Customize the plot
        ax.set_title(title, fontweight="bold", pad=20)
        ax.set_ylabel(ylabel, fontweight="bold")
        ax.set_xlabel("Date", fontweight="bold")

        # Format x-axis
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))
        ax.xaxis.set_major_locator(mdates.DayLocator(interval=2))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45)

        # Add value annotations on data points
        for i, (date, count) in enumerate(zip(dates, counts)):
            if count > 0:  # Only annotate non-zero values
                ax.annotate(
                    str(count),
                    (date, count),
                    textcoords="offset points",
                    xytext=(0, 10),
                    ha="center",
                    fontsize=8,
                )

        # Adjust layout
        plt.tight_layout()

        # Save the plot
        filename = (
            f"{title.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.png"
        )
        filepath = os.path.join(settings.MEDIA_ROOT, "plots", filename)

        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        plt.savefig(filepath, dpi=150, bbox_inches="tight", facecolor="white")
        plt.close()

        return filepath

    def create_all_time_series_plots(
        self, time_series_data: Dict[str, List[Dict]]
    ) -> List[str]:
        """
        Create all three time series plots.

        Args:
            time_series_data: Dictionary with 'signups', 'subscriptions', 'captures' keys

        Returns:
            List of file paths to the created plots
        """
        plot_configs = [
            {
                "key": "signups",
                "title": "Daily Signups",
                "ylabel": "Number of Signups",
                "color": "#2E8B57",  # Sea Green
            },
            {
                "key": "subscriptions",
                "title": "Daily Subscriptions",
                "ylabel": "Number of Subscriptions",
                "color": "#4169E1",  # Royal Blue
            },
            {
                "key": "captures",
                "title": "Daily Captures",
                "ylabel": "Number of Captures",
                "color": "#FF6347",  # Tomato
            },
        ]

        plot_paths = []

        for config in plot_configs:
            if config["key"] in time_series_data:
                plot_path = self.create_time_series_plot(
                    data=time_series_data[config["key"]],
                    title=config["title"],
                    ylabel=config["ylabel"],
                    color=config["color"],
                )
                if plot_path:
                    plot_paths.append(plot_path)

        return plot_paths

    def cleanup_old_plots(self, days_to_keep: int = 7):
        """
        Clean up old plot files to prevent disk space issues.

        Args:
            days_to_keep: Number of days of plots to keep
        """
        plots_dir = os.path.join(settings.MEDIA_ROOT, "plots")
        if not os.path.exists(plots_dir):
            return

        cutoff_time = datetime.now().timestamp() - (days_to_keep * 24 * 60 * 60)

        for filename in os.listdir(plots_dir):
            filepath = os.path.join(plots_dir, filename)
            if os.path.isfile(filepath):
                file_time = os.path.getmtime(filepath)
                if file_time < cutoff_time:
                    try:
                        os.remove(filepath)
                    except OSError:
                        pass  # Ignore errors when deleting files
