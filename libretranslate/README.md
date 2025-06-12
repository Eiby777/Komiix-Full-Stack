# LibreTranslate Service

This directory contains the configuration for running a LibreTranslate instance as part of the Komiix application stack.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.template .env
   ```

2. Edit the `.env` file to configure your LibreTranslate instance.

3. The Docker container will be built and started automatically via the main `docker-compose.yml` file.

## Configuration

### Environment Variables

- `LT_LOAD_ONLY`: Comma-separated list of language codes to load (e.g., "es,en,fr")
- `LT_PACKAGE_DIR`: Directory where language models are stored (mounted as a volume)
- `LT_API_KEYS`: Optional API key for authentication
- `REQUIRE_API_KEY`: Set to "true" to require API key for all requests
- `ENABLE_WEB_UI`: Set to "false" to disable the web interface
- `UPDATE_FREQUENCY`: How often to check for model updates (in hours)

### Volumes

The following volumes are used:

- `/app/models`: Contains the downloaded language models (persisted via Docker volume)

## Usage

Once running, the LibreTranslate API will be available at `http://localhost:5000`.

### Example API Request

```bash
curl -X POST "http://localhost:5000/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "q": "Hello world",
    "source": "en",
    "target": "es"
  }'
```

## Building the Image

The Docker image will be built automatically when you run `docker-compose up`. If you need to rebuild it manually:

```bash
docker-compose build libretranslate
```

## Troubleshooting

- If models fail to download, check the container logs with `docker-compose logs libretranslate`
- Ensure the `/app/models` directory has proper write permissions
- For large models, the initial download may take some time depending on your internet connection
