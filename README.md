
# Komiix - Traductor de Mangas y Manhwas con IA

![Komiix Banner](https://via.placeholder.com/1200x300?text=Komiix+AI+Manga+Translator)

> 🌐 **¡Pruébalo GRATIS ahora mismo en la web oficial!**  
> 👉 [www.komiix.com](https://www.komiix.com)

**Komiix** es una herramienta web avanzada diseñada para revolucionar el mundo del *scanlation*. Utilizando inteligencia artificial de última generación, automatiza el tedioso proceso de limpiar, traducir y editar mangas y manhwas, permitiendo a los traductores enfocarse en la calidad lingüística y creativa.

Esta aplicación combina un potente **Backend en Python** (FastAPI) para el procesamiento pesado de IA con un **Frontend en React** altamente interactivo para la edición fina.

---

## 🚀 Características Principales

Komiix ofrece un flujo de trabajo completo para scanlators:

-   **🤖 Detección Inteligente**: Detección automática de burbujas de texto utilizando modelos **YOLOv4**.
-   **🧹 Limpieza Automática (Inpainting)**: Eliminación de texto original y reconstrucción del fondo de manera automática.
-   **📝 OCR Multiidioma**: Extracción de texto precisa desde japonés, coreano, chino e inglés.
-   **🌍 Traducción Asistida**: Integración con motores de traducción (LibreTranslate, LLMs) para borradores rápidos.
-   **🎨 Editor Profesional**:
    -   5 áreas de trabajo especializadas.
    -   Herramientas vectoriales (Fabric.js).
    -   Soporte para fuentes personalizadas y estilos.
-   **⚡ Rendimiento**: Procesamiento optimizado con aceleración por GPU (cuando está disponible) y gestión de colas con Redis.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Lenguaje**: TypeScript / JavaScript
-   **Estilos**: TailwindCSS
-   **Estado**: Zustand + Redux Toolkit
-   **Gráficos**: Fabric.js (Canvas HTML5)
-   **IA en Navegador**: ONNX Runtime Web, Tesseract.js
-   **Cliente**: Supabase Client

### Backend
-   **Framework**: FastAPI (Python 3.12+)
-   **IA & Visión**:
    -   `opencv-python-headless`: Procesamiento de imagen.
    -   `onnxruntime`: Inferencia de modelos.
    -   `scikit-image`, `pillow`: Manipulación de imágenes.
    -   `llama-cpp-python`: Integración con LLMs locales.
-   **Base de Datos/Auth**: Supabase (PostgREST, GoTrue).
-   **Cola de Tareas**: Redis (con `aiohttp` para async).
-   **Traducción**: LibreTranslate (Self-hosted).

### Infraestructura
-   **Contenedores**: Docker & Docker Compose.
-   **Servidor Web**: Nginx (como proxy inverso en prod).

---

## 📋 Prerrequisitos

Para ejecutar este proyecto localmente, necesitarás:

-   [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (Recomendado)
-   **O**
-   [Node.js](https://nodejs.org/) (v18+)
-   [Python](https://www.python.org/) (v3.12+)
-   [Redis](https://redis.io/)

---

## 🔧 Instalación y Despliegue

### 🐳 Opción 1: Docker (Recomendado)

La forma más rápida de levantar todo el stack.

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/komiix-full-stack.git
    cd komiix-full-stack
    ```

2.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz (basado en un ejemplo si existe, o con tus credenciales de Supabase).
    ```env
    # Ejemplo básico
    VITE_SUPABASE_URL=tu_supabase_url
    VITE_SUPABASE_KEY=tu_supabase_anon_key
    SUPABASE_JWT_SECRET=tu_jwt_secret
    ```

3.  **Iniciar Servicios**:
    ```bash
    docker-compose up -d --build
    ```
    Esto levantará:
    -   `komiix-backend`: Puerto **8001**
    -   `komiix-frontend`: Puerto **3000**
    -   `redis`: Puerto **6379**
    -   `libretranslate`: Puerto **5000**

4.  **Acceder**: Abre `http://localhost:3000` en tu navegador.

### 💻 Opción 2: Manual (Desarrollo)

#### Backend
1.  Navega a `backend/`:
    ```bash
    cd backend
    ```
2.  Instala dependencias (se recomienda usar entorno virtual):
    ```bash
    python -m venv venv
    source venv/bin/activate  # o venv\Scripts\activate en Windows
    pip install -e .
    ```
3.  Ejecuta el servidor:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

#### Frontend
1.  Navega a `frontend/`:
    ```bash
    cd frontend
    ```
2.  Instala dependencias:
    ```bash
    npm install
    # o
    bun install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## 📂 Estructura del Proyecto

```
komiix-full-stack/
├── backend/                # API FastAPI y Lógica de IA
│   ├── app/                # Código fuente de la aplicación
│   ├── Dockerfile          # Configuración de imagen Docker
│   └── pyproject.toml      # Dependencias Python
├── frontend/               # Aplicación React
│   ├── src/                # Componentes, Hooks, Stores
│   ├── Dockerfile          # Configuración de imagen Docker
│   └── package.json        # Dependencias Node
├── Centralizador de texto/ # Herramientas auxiliares de procesamiento
└── docker-compose.yml      # Orquestación de servicios
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Komiix es un proyecto nacido de la pasión por el manga y la tecnología.

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

---

## 📞 Comunidad y Soporte

Únete a nuestra comunidad para estar al día con las actualizaciones, reportar bugs o simplemente charlar.

-   **Sitio Web**: [komiix.com](https://komiix.com)
-   **Discord**: [Únete al servidor](https://discord.gg/komiix)

---

Hecho con ❤️ por [Eiby777](https://github.com/Eiby777)
