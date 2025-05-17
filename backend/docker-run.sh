#!/bin/bash

# Nombre de la imagen Docker
IMAGE_NAME="fetchmodels"

# Crear la red si no existe
echo "Creando la red komiix-network si no existe..."
docker network create komiix-network 2>/dev/null || true

# Eliminar contenedores existentes si existen
echo "Eliminando contenedores existentes..."
if docker ps -a | grep -q "komiix-endpoint"; then
    docker stop komiix-endpoint
    docker rm komiix-endpoint
fi
if docker ps -a | grep -q "libretranslate"; then
    docker stop libretranslate
    docker rm libretranslate
fi

# Construir la imagen
echo "Construyendo la imagen Docker..."
docker build -t $IMAGE_NAME .

# Verificar si la construcción fue exitosa
if [ $? -ne 0 ]; then
    echo "Error al construir la imagen"
    exit 1
fi

echo "Iniciando LibreTranslate..."
docker run -d --name libretranslate --network komiix-network -p 5000:5000 libretranslate/libretranslate

# Verificar si LibreTranslate está corriendo
if [ $? -ne 0 ]; then
    echo "Error al iniciar LibreTranslate"
    exit 1
fi

echo "Esperando a que LibreTranslate esté listo..."
sleep 10  # Aumentar el tiempo si es necesario

echo "Ejecutando el contenedor principal..."
docker run -d --name komiix-endpoint \
    --network komiix-network \
    -v $(pwd)/models:/app/models \
    -v $(pwd)/fonts:/app/fonts \
    -v $(pwd)/config:/app/config \
    -p 8000:8000 \
    $IMAGE_NAME

if [ $? -eq 0 ]; then
    echo "Contenedor iniciado exitosamente"
    echo "Accede a la aplicación en http://localhost:8000"
else
    echo "Error al iniciar el contenedor"
fi

# Función para detener y eliminar los contenedores
stop_container() {
    echo "Deteniendo y eliminando los contenedores..."
    docker stop komiix-endpoint libretranslate
    docker rm komiix-endpoint libretranslate
}

# Manejar señales de interrupción (Ctrl+C)
trap stop_container SIGINT SIGTERM