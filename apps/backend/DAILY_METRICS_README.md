# Daily Metrics Reporting System

This system automatically generates and posts daily business metrics to Slack every day at 00:01 IST.

## Features

- **Automated Daily Reports**: Runs automatically at 00:01 IST every day
- **Comprehensive Metrics**: Tracks signups, subscriptions, captures, and user activity
- **Visual Charts**: Generates time series graphs for trends
- **Slack Integration**: Posts reports and charts directly to Slack channels
- **Flexible Configuration**: Supports both webhook and bot token authentication
- **Simple Scheduling**: Uses cron jobs or Windows Task Scheduler (no Celery required)

## Metrics Tracked

### Daily Metrics (Previous Day)
- Number of new signups
- Number of new subscriptions created
- Number of subscriptions cancelled
- Number of captures
- Number of unique users who did captures
- Number of users with active subscriptions who did captures

### Current Status
- Current number of active subscriptions

### Monthly Totals
- Number of signups in the current month
- Number of subscriptions created in the current month

### Time Series Charts
- Daily signups trend
- Daily subscriptions trend
- Daily captures trend

## Setup Instructions

### 1. Install Dependencies

The system requires additional dependencies that are already added to `pyproject.toml`:

```bash
uv sync
```

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```bash
# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL=#general
SLACK_CHANNEL_ID=C1234567890
```

### 3. Setup Slack Integration

#### Option A: Using Webhook (Recommended for simple setup)
1. Go to your Slack workspace
2. Create a new app or use an existing one
3. Go to "Incoming Webhooks" and create a new webhook
4. Copy the webhook URL to `SLACK_WEBHOOK_URL`

#### Option B: Using Bot Token (Required for image uploads)
1. Go to your Slack workspace
2. Create a new app or use an existing one
3. Go to "OAuth & Permissions"
4. Add the following scopes:
   - `chat:write` - Send messages
   - `files:write` - Upload files
5. Install the app to your workspace
6. Copy the Bot User OAuth Token to `SLACK_BOT_TOKEN`

#### Getting the Channel ID
To get the channel ID for `SLACK_CHANNEL_ID`:
1. In Slack, right-click on the channel name in the sidebar
2. Select "Copy link" 
3. The link will contain the channel ID (e.g., `https://workspace.slack.com/archives/C1234567890`)
4. Extract the ID part (e.g., `C1234567890`) and use it as `SLACK_CHANNEL_ID`

**Note**: You need both `SLACK_CHANNEL` and `SLACK_CHANNEL_ID` because:
- `SLACK_CHANNEL` (e.g., `#general`) is used for posting text messages
- `SLACK_CHANNEL_ID` (e.g., `C1234567890`) is required for uploading files/images

### 4. Schedule the Daily Report

The scheduler script automatically loads environment variables from the `.env` file in the project root.

#### Option A: Using Cron Job (Linux/macOS)
```bash
# Edit crontab
crontab -e

# Add this line to run at 00:01 IST daily
1 0 * * * cd /path/to/project && /path/to/python daily_metrics_scheduler.py
```

#### Option B: Using Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at 00:01
4. Set action to start program: `python.exe`
5. Add arguments: `C:\path\to\daily_metrics_scheduler.py`

## Manual Testing

### Test Slack Connection
```bash
python manage.py shell
>>> from core.slack_service import SlackService
>>> slack = SlackService()
>>> slack.test_connection()
```

### Test the Scheduler Script
```bash
# Run the scheduler script manually
python daily_metrics_scheduler.py

# Test individual components
python test_daily_metrics.py
```

## File Structure

```
core/
├── metrics_service.py      # Business metrics calculation
├── plotting_service.py     # Chart generation
└── slack_service.py        # Slack integration

daily_metrics_scheduler.py  # Main scheduler script
test_daily_metrics.py      # Test script
```

## Configuration Options

### Timezone
The system explicitly uses IST (Asia/Kolkata) timezone for all calculations, regardless of the server's timezone setting.

### Schedule
The scheduler script checks if the current time is within 5 minutes of 00:01 IST before running the report.

### Chart Customization
Modify `core/plotting_service.py` to customize:
- Chart colors
- Chart sizes
- Data point annotations
- Chart styling

## Troubleshooting

### Common Issues

1. **Slack Authentication Error**
   - Verify webhook URL or bot token
   - Check Slack app permissions
   - Test connection manually

2. **Chart Generation Error**
   - Ensure matplotlib is installed
   - Check write permissions for media directory
   - Verify time series data is not empty

3. **Timezone Issues**
   - The system uses IST timezone explicitly
   - Server timezone doesn't affect the calculations

4. **Cron Job Not Running**
   - Check cron service is running
   - Verify the path to Python and script
   - Check cron logs for errors

### Logs
The scheduler script creates a log file `daily_metrics.log` with detailed information about each run.

## Production Deployment

### Using Cron Job
```bash
# Add to crontab - make sure to cd to project directory first
1 0 * * * cd /path/to/project && /path/to/python daily_metrics_scheduler.py >> /var/log/daily_metrics.log 2>&1
```

### Using Windows Task Scheduler
1. Create a scheduled task
2. Set to run daily at 00:01
3. Configure to run the Python script
4. Set working directory to project folder

### Monitoring
- Monitor the log file for errors
- Set up alerts for failed runs
- Check Slack channel for reports

## Security Considerations

- Store Slack tokens securely (use environment variables)
- Restrict Slack bot permissions to minimum required
- Monitor for unauthorized access to metrics data
- Use proper file permissions for log files
