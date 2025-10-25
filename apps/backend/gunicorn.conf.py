"""
Gunicorn configuration file for the Django MCP server application.
Optimized for gthread workers to support thread-local storage in middleware.
"""

import multiprocessing
import os

# Server socket
bind = os.getenv("GUNICORN_BIND", "0.0.0.0:8000")
backlog = 2048

# Worker processes
workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "gthread"
threads = int(os.getenv("GUNICORN_THREADS", 2))
worker_connections = 1000

# Worker lifecycle
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
graceful_timeout = 30

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"  # Log to stderr
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "django-mcp-server"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Performance
preload_app = True
sendfile = True

# SSL (uncomment if using HTTPS)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Development settings (comment out in production)
reload = os.getenv("GUNICORN_RELOAD", "false").lower() == "true"
reload_engine = "auto"

# Application
wsgi_app = "core.wsgi:application"

# Environment variables
raw_env = [
    "DJANGO_SETTINGS_MODULE=core.settings",
]


# Custom settings for MCP server
def when_ready(server):
    """Called just after the server is started."""
    server.log.info("Server is ready. Spawning workers")


def worker_int(worker):
    """Called just after a worker has been initialized."""
    worker.log.info("Worker spawned (pid: %s)", worker.pid)


def pre_fork(server, worker):
    """Called just before a worker has been forked."""
    server.log.info("Worker will be spawned")


def post_fork(server, worker):
    """Called just after a worker has been forked."""
    server.log.info("Worker spawned (pid: %s)", worker.pid)


def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    worker.log.info("Worker initialized (pid: %s)", worker.pid)


def worker_abort(worker):
    """Called when a worker received SIGABRT."""
    worker.log.info("Worker received SIGABRT")


def pre_exec(server):
    """Called just before a new master process is forked."""
    server.log.info("Forked child, re-executing.")


def on_starting(server):
    """Called just before the master process is initialized."""
    server.log.info("Starting gunicorn server")


def on_reload(server):
    """Called to reload the server."""
    server.log.info("Reloading server")


def child_exit(server, worker):
    """Called when a worker has been exited."""
    server.log.info("Worker exited (pid: %s)", worker.pid)
