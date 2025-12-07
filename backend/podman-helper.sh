#!/bin/bash

# Komiix Backend - Podman Helper Script
# This script helps manage the Komiix backend container with Podman

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ../.env ]; then
    print_error ".env file not found in parent directory!"
    print_info "Please create a .env file with the required environment variables"
    exit 1
fi

# Load environment variables
set -a
source ../.env
set +a

case "$1" in
    build)
        print_info "Building Komiix backend image with Podman..."
        podman build -t komiix-backend:latest -f Dockerfile .
        print_info "Build complete!"
        ;;
    
    run)
        print_info "Running Komiix backend container..."
        podman run -d \
            --name komiix-backend \
            -p 8001:8000 \
            -e PYTHONPATH=/app \
            -e REDIS_HOST=redis \
            -e REDIS_PORT=6379 \
            -e CORS_ORIGINS="${CORS_ORIGINS}" \
            -e SUPABASE_URL="${SUPABASE_URL}" \
            -e SUPABASE_KEY="${SUPABASE_KEY}" \
            -e SUPABASE_JWT_SECRET="${SUPABASE_JWT_SECRET}" \
            -e LIBRETRANSLATE_URL=http://libretranslate:5000 \
            komiix-backend:latest
        print_info "Container started! Access at http://localhost:8001"
        ;;
    
    stop)
        print_info "Stopping Komiix backend container..."
        podman stop komiix-backend
        print_info "Container stopped!"
        ;;
    
    remove)
        print_info "Removing Komiix backend container..."
        podman rm -f komiix-backend 2>/dev/null || true
        print_info "Container removed!"
        ;;
    
    logs)
        print_info "Showing logs for Komiix backend..."
        podman logs -f komiix-backend
        ;;
    
    restart)
        print_info "Restarting Komiix backend..."
        $0 stop
        $0 remove
        $0 run
        ;;
    
    shell)
        print_info "Opening shell in Komiix backend container..."
        podman exec -it komiix-backend /bin/bash
        ;;
    
    *)
        echo "Komiix Backend - Podman Helper"
        echo ""
        echo "Usage: $0 {build|run|stop|remove|logs|restart|shell}"
        echo ""
        echo "Commands:"
        echo "  build    - Build the Docker image"
        echo "  run      - Run the container"
        echo "  stop     - Stop the container"
        echo "  remove   - Remove the container"
        echo "  logs     - Show container logs"
        echo "  restart  - Restart the container"
        echo "  shell    - Open a shell in the container"
        exit 1
        ;;
esac
