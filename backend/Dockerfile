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
    cmake \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create models directory and download the translation model
RUN mkdir -p /app/models
RUN curl -L -o /app/models/LFM2-350M-ENJP-MT-Q8_0.gguf https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT-GGUF/resolve/main/LFM2-350M-ENJP-MT-Q8_0.gguf

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements first for better caching
COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt

# Install paddleocr dependencies
RUN paddleocr install_hpi_deps cpu

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app

# Change ownership of the app directory
USER root
RUN chown -R app:app /app
USER app

EXPOSE 8000

# Use exec form and proper signal handling
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]