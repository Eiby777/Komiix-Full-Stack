FROM python:3.12-bullseye

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ccache \
    curl \
    cmake \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install UV
RUN pip install uv

# Create models directory and download the translation model
RUN mkdir -p /app/models
RUN curl -L -o /app/models/LFM2-350M-ENJP-MT-Q8_0.gguf https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT-GGUF/resolve/main/LFM2-350M-ENJP-MT-Q8_0.gguf

# Copy pyproject.toml and uv.lock first for better caching
COPY pyproject.toml uv.lock ./
RUN uv sync --no-install-project

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
CMD ["uv", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]