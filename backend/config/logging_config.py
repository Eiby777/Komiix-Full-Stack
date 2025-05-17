import sys
import logging
from loguru import logger

def configure_logging():
    # Eliminar configuraciones predeterminadas de Loguru
    logger.remove()

    # Configurar logs para archivo y consola
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

    # Redirigir logs de logging a Loguru
    class LoguruHandler(logging.Handler):
        def emit(self, record):
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno
            # Incluir el nombre del logger para identificar el origen
            logger.log(level, f"{record.name}: {record.getMessage()}")

    # Limpiar handlers existentes antes de asignar el nuevo
    for logger_name in ["", "uvicorn", "uvicorn.access", "fastapi"]:
        lg = logging.getLogger(logger_name)
        lg.handlers = []  # Limpiar handlers existentes
        lg.addHandler(LoguruHandler())
        lg.setLevel(logging.INFO)

# Exportar la configuración
configure_logging()