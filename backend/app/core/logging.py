import sys
import logging
from loguru import logger


def configure_logging():
    """Configure logging for the application"""
    # Remove default Loguru configurations
    logger.remove()

    # Configure logs for file and console
    logger.add(
        "app.log",
        level="INFO",
        rotation="1 MB",
        retention="10 days",
        compression="zip",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} - {message}"
    )
    logger.add(
        sys.stderr,
        level="INFO",
        colorize=True,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} - {message}"
    )

    # Redirect logging to Loguru
    class LoguruHandler(logging.Handler):
        def emit(self, record):
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno
            # Include logger name to identify the source
            logger.log(level, f"{record.name}: {record.getMessage()}")

    # Clear existing handlers before assigning the new one
    for logger_name in ["", "uvicorn", "uvicorn.access", "fastapi"]:
        lg = logging.getLogger(logger_name)
        lg.handlers = []  # Clear existing handlers
        lg.addHandler(LoguruHandler())
        lg.setLevel(logging.INFO)
