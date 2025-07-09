FROM python:3.12-bullseye

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ccache \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 
RUN paddleocr install_hpi_deps cpu

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
