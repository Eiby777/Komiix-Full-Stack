FROM python:3.12-bullseye

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ccache \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements first for better caching
COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt

# Install paddleocr dependencies
RUN paddleocr install_hpi_deps cpu

# Create necessary directories
RUN mkdir -p /app/models/fragmented_models/globes/key /app/models/fragmented_models/text/key

# Copy application code
COPY . .

# Set proper permissions for key files
RUN chmod 600 /app/models/fragmented_models/globes/key/globes_key.bin /app/models/fragmented_models/text/key/text_key.bin 2>/dev/null || true

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

EXPOSE 8000

# Use exec form and proper signal handling
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]