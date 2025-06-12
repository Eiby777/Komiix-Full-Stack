# Use Python 3.11 slim Debian as the base image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.7.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/venv"

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - 
ENV PATH="${POETRY_HOME}/bin:${PATH}"

# Copy only requirements first to leverage Docker cache
COPY pyproject.toml poetry.lock* ./ 

# Install Python dependencies
RUN python -m venv $VENV_PATH \
    && . $VENV_PATH/bin/activate \
    && pip install --upgrade pip \
    && pip install poetry==$POETRY_VERSION \
    && poetry install --no-dev --no-interaction --no-ansi

# Copy the rest of the application
COPY . .

# Set environment variables for LibreTranslate
ENV LT_LOAD_ONLY=${LT_LOAD_ONLY:-es,ja,zh,ko,en} \
    LT_PACKAGE_DIR=/app/models \
    PATH="$VENV_PATH/bin:$PATH"

# Expose the port LibreTranslate runs on
EXPOSE 5000

# Create a non-root user and switch to it
RUN useradd -m -u 1000 libretranslate \
    && chown -R libretranslate:libretranslate /app
USER libretranslate

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:5000/ || exit 1

# Run LibreTranslate
CMD ["libretranslate", "--host", "0.0.0.0", "--port", "5000"]
