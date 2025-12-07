# Komiix Backend

Backend API for the Komiix manga translation application.

## Architecture

This backend follows a professional layered architecture:

```
backend/
├── app/                        # Main application
│   ├── api/                    # API layer
│   │   ├── deps.py            # Shared dependencies (auth, rate limiting)
│   │   └── v1/                # API version 1
│   │       ├── router.py      # Main v1 router
│   │       └── endpoints/     # API endpoints
│   │           ├── fonts.py
│   │           ├── models.py
│   │           ├── ocr.py
│   │           └── translate.py
│   │
│   ├── core/                   # Core configuration
│   │   ├── config.py          # Application settings
│   │   └── logging.py         # Logging configuration
│   │
│   ├── schemas/                # Pydantic models (DTOs)
│   │   ├── ocr.py
│   │   └── translate.py
│   │
│   ├── services/               # Business logic (future)
│   ├── repositories/           # Data access layer
│   │   ├── cache_repository.py
│   │   ├── file_repository.py
│   │   └── metadata_repository.py
│   │
│   ├── utils/                  # Shared utilities
│   └── main.py                 # Application entry point
│
├── lib/                        # External libraries
│   ├── manga_ocr/             # Japanese OCR
│   └── onnx_ocr/              # ONNX OCR
│
├── assets/                     # Static resources
│   ├── fonts/                 # Font files
│   └── ml_models/             # ML models
│       ├── fragmented/
│       └── full/
│
├── data/                       # Configuration data
│   ├── fonts_metadata.json
│   └── model_metadata.json
│
├── scripts/                    # Utility scripts
├── tests/                      # Tests
├── Dockerfile
└── pyproject.toml
```

## Features

- **OCR**: Text recognition for manga (Japanese and other languages)
- **Translation**: Multi-language translation with Japanese-English specialization
- **Font Management**: Font serving with caching
- **Model Management**: ML model distribution with integrity checking

## Technology Stack

- **Framework**: FastAPI
- **Package Manager**: uv
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis
- **OCR**: ONNX PaddleOCR, MangaOCR
- **Translation**: LibreTranslate, Llama (for Japanese)

## Setup

### Prerequisites

- Python 3.12+
- uv package manager
- Redis (for caching)

### Installation

1. Install dependencies:
```bash
uv sync
```

2. Set up environment variables (create `.env` file):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000|http://localhost:5173
LIBRETRANSLATE_URL=http://libretranslate:5000
```

### Running Locally

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Running with Docker

```bash
docker build -t komiix-backend .
docker run -p 8000:8000 komiix-backend
```

### Running with Podman

Build the image:
```bash
podman build -t komiix-backend:latest -f Dockerfile .
```

Or use the helper script:
```bash
# Build the image
./podman-helper.sh build

# Run the container
./podman-helper.sh run

# View logs
./podman-helper.sh logs

# Stop the container
./podman-helper.sh stop

# Restart the container
./podman-helper.sh restart

# Open a shell in the container
./podman-helper.sh shell
```

### Running with Podman Compose

From the project root:
```bash
podman-compose up -d komiix-backend
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### OCR
- `POST /api/ocr` - Perform OCR on an image

### Translation
- `POST /api/translate` - Translate text
- `POST /api/detect` - Detect language

### Fonts
- `GET /api/font-list` - List available fonts
- `GET /api/font-url/{font_id}` - Get font file

### Models
- `GET /api/model-version/{model_key}` - Get model version
- `GET /api/get-fragment/{model_key}/{fragment_name}` - Get model fragment
- `GET /api/get-model-fragments/{model_key}` - Get model fragments metadata
- `GET /api/get-globes` - Get text bubble detection model
- `GET /api/get-text` - Get text detection model
- `GET /api/get-inpainting` - Get inpainting model

## Development

### Project Structure Philosophy

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Injection**: Using FastAPI's dependency system
- **Configuration Management**: Centralized in `app/core/config.py`
- **Type Safety**: Pydantic models for validation
- **Testability**: Layered architecture enables easy testing

### Adding New Endpoints

1. Create schema in `app/schemas/`
2. Create endpoint in `app/api/v1/endpoints/`
3. Add router to `app/api/v1/router.py`

### Adding New Services

1. Create service in `app/services/`
2. Use repositories for data access
3. Inject into endpoints via dependencies

## License

[Your License]
