# Capture Archival Feature

This document describes the capture archival feature that automatically archives old captures after 7 days.

## Overview

The archival feature:
- Automatically archives captures older than 7 days
- Deletes HTML and PNG files from S3
- Marks captures as archived in the database
- Filters out archived captures from API responses
- Returns appropriate error messages for archived captures

## Components

### 1. Database Changes

- **New Field**: `archived` (BooleanField, default=False) added to the `Capture` model
- **Migration**: `0002_capture_archived.py` - Run with `python manage.py migrate`

### 2. Archival Service (`captures/archival_service.py`)

The `ArchivalService` class handles:
- Deleting files from S3
- Marking captures as archived
- Finding captures to archive
- Processing archival in batches

Key methods:
- `archive_capture(capture)`: Archives a single capture
- `get_captures_to_archive(days_old=7)`: Gets captures older than specified days
- `archive_old_captures(days_old=7)`: Archives all old captures

### 3. Daily Archival Scheduler (`daily_archival_scheduler.py`)

A cron job script that:
- Runs daily at 3:00 AM IST
- Processes captures older than 7 days
- Logs all operations to `daily_archival.log`
- Continues processing even if individual captures fail

### 4. API Changes

#### Capture Listing API
- Now filters out archived captures: `Capture.objects.filter(user=user, archived=False)`

#### Capture Detail API
- Returns 400 error with message "Capture is not available anymore (it is deleted after 7 days)" for archived captures

#### File Serving APIs (HTML/PNG)
- Returns 400 error for archived captures
- Prevents access to deleted S3 files

## Setup Instructions

### 1. Run Database Migration

```bash
python manage.py migrate
```

### 2. Set Up Cron Job

Add the following line to your crontab to run the archival process daily at 3:00 AM IST:

```bash
# Run daily archival at 3:00 AM IST
0 3 * * * cd /path/to/your/project && python daily_archival_scheduler.py >> /var/log/daily_archival.log 2>&1
```

Or using the systemd timer approach (recommended for production):

Create `/etc/systemd/system/capture-archival.service`:
```ini
[Unit]
Description=Capture Archival Service
After=network.target

[Service]
Type=oneshot
User=your-user
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/python3 daily_archival_scheduler.py
StandardOutput=journal
StandardError=journal
```

Create `/etc/systemd/system/capture-archival.timer`:
```ini
[Unit]
Description=Run Capture Archival Daily at 3 AM IST
Requires=capture-archival.service

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start the timer:
```bash
sudo systemctl enable capture-archival.timer
sudo systemctl start capture-archival.timer
```

### 3. Environment Variables

Ensure your `.env` file contains the required AWS S3 configuration:

```env
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
# ... other AWS credentials
```

## Testing

### Manual Testing

Use the test script to verify the archival functionality:

```bash
python test_archival.py
```

### Testing Archival Service

```python
from captures.archival_service import ArchivalService

# Initialize service
archival_service = ArchivalService()

# Get captures to archive
captures = archival_service.get_captures_to_archive(days_old=7)
print(f"Found {captures.count()} captures to archive")

# Archive captures (be careful in production!)
summary = archival_service.archive_old_captures(days_old=7)
print(f"Archival summary: {summary}")
```

## Monitoring

### Log Files

- **Archival Log**: `daily_archival.log` - Contains detailed logs of archival operations
- **System Logs**: Check system logs for cron job execution

### Log Analysis

The archival process logs:
- Number of captures found for archival
- Success/failure status for each capture
- Summary statistics
- Error details for failed operations

### Example Log Output

```
2024-01-15 03:00:01 - __main__ - INFO - Starting daily archival process
2024-01-15 03:00:01 - __main__ - INFO - Archiving captures older than 7 days
2024-01-15 03:00:01 - captures.archival_service - INFO - Found 15 captures to archive
2024-01-15 03:00:02 - captures.archival_service - INFO - Successfully archived capture abc-123-def
2024-01-15 03:00:03 - captures.archival_service - INFO - Archival process completed. Summary: {'total_captures': 15, 'successful_archivals': 15, 'failed_archivals': 0, 'errors': []}
2024-01-15 03:00:03 - __main__ - INFO - Daily archival process completed successfully
```

## Error Handling

The archival process is designed to be resilient:
- Individual capture failures don't stop the entire process
- All errors are logged with details
- S3 deletion failures are logged but don't prevent marking as archived
- The process continues even if some captures fail

## Configuration

### Archival Age

To change the archival age (default: 7 days), modify the `days_old` parameter in:
- `daily_archival_scheduler.py`: `archival_service.archive_old_captures(days_old=7)`
- `ArchivalService.get_captures_to_archive(days_old=7)`

### Time Zone

The scheduler uses IST (Asia/Kolkata) timezone. To change:
- Modify the timezone in `daily_archival_scheduler.py`
- Update the cron schedule accordingly

## Troubleshooting

### Common Issues

1. **Migration Fails**: Ensure database is accessible and user has proper permissions
2. **S3 Deletion Fails**: Check AWS credentials and bucket permissions
3. **Cron Job Not Running**: Verify cron service is running and check system logs
4. **Permission Errors**: Ensure the cron user has access to the project directory

### Debug Mode

To run the archival process manually for testing:

```bash
python daily_archival_scheduler.py
```

This will run the archival process regardless of the current time (useful for testing).

## Security Considerations

- Ensure AWS credentials are properly configured
- The archival process runs with the same permissions as the cron user
- Archived captures are permanently deleted from S3
- Consider backup strategies for critical captures

## Performance Impact

- The archival process processes captures one by one to avoid overwhelming S3
- Database queries are optimized with proper indexing
- Logging is asynchronous to minimize performance impact
- The process runs during low-traffic hours (3 AM IST)
