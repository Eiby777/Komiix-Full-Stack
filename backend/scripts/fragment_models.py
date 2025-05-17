import os
import secrets
from pathlib import Path
import hashlib
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import json
import shutil
from loguru import logger
import sys
from typing import List, Dict, Optional
import datetime
import argparse

# Directorios base
BASE_DIR = Path(__file__).parent.parent
FRAGMENTS_DIR = BASE_DIR / "models" / "fragmented_models"
METADATA_FILE = BASE_DIR / "config" / "model_metadata.json"
BACKUP_DIR = BASE_DIR / "backup"

# Modelos a procesar
MODELS_TO_PROCESS = {
    "globes": "globes.onnx",
    "text": "text.onnx"
}

# Configuración
NUM_FRAGMENTS = 4
ENCRYPTED_FRAGMENT_INDEX = 3
FRAGMENT_EXTENSIONS = [".css", ".js", ".png", ".txt"]

# Excepciones personalizadas
class FragmentationError(Exception):
    pass

class EncryptionError(Exception):
    pass

class MetadataError(Exception):
    pass

class BackupError(Exception):
    pass

class VersionError(Exception):
    pass

def get_next_version(current_version: str) -> str:
    """Incrementa la versión menor de una versión dada (X.Y.Z -> X.Y.(Z+1))."""
    try:
        parts = current_version.split('.')
        if len(parts) != 3 or not all(part.isdigit() for part in parts):
            raise ValueError(f"Formato de versión inválido: {current_version}. Debe ser X.Y.Z")
        major, minor, patch = map(int, parts)
        return f"{major}.{minor}.{patch + 1}"
    except Exception as e:
        raise VersionError(f"Error al procesar la versión {current_version}: {str(e)}")

class Fragment:
    def __init__(self, filename: str, sha256: str, is_encrypted: bool = False):
        self.filename = filename
        self.sha256 = sha256
        self.is_encrypted = is_encrypted

class ModelFragmenter:
    def __init__(self, model_path: Path, output_dir: Path, version: str, apply: bool = True):
        self.model_path = model_path
        self.model_name = model_path.stem
        self.output_dir = output_dir / self.model_name / "fragments"
        self.key_dir = output_dir / self.model_name / "key"
        self.version = version
        self.apply = apply
        self.fragments: List[Fragment] = []
        self.encryption_key: Optional[bytes] = None

    def clean_old_data(self):
        """Elimina fragmentos y claves existentes del modelo antes de generar nuevos."""
        try:
            if not self.apply:
                logger.info(f"[DRY-RUN] Would delete old fragments in {self.output_dir}")
                logger.info(f"[DRY-RUN] Would delete key in {self.key_dir}")
                return

            # Eliminar directorio de fragmentos si existe
            if self.output_dir.exists():
                shutil.rmtree(self.output_dir)
                logger.info(f"Deleted old fragments directory: {self.output_dir}")

            # Eliminar archivo de clave si existe
            key_path = self.key_dir / f"{self.model_name}_key.bin"
            if key_path.exists():
                key_path.unlink()
                logger.info(f"Deleted old encryption key: {key_path}")

            # Eliminar directorio de clave si está vacío
            if self.key_dir.exists() and not any(self.key_dir.iterdir()):
                self.key_dir.rmdir()
                logger.info(f"Deleted empty key directory: {self.key_dir}")

        except Exception as e:
            raise FragmentationError(f"Failed to clean old data for {self.model_name}: {str(e)}")

    def fragment_model(self) -> Dict:
        """Fragmenta el modelo ONNX y encripta un fragmento."""
        try:
            logger.info(f"Fragmenting model: {self.model_path} (version: {self.version})")
            with open(self.model_path, "rb") as f:
                model_data = f.read()
            original_checksum = hashlib.sha256(model_data).hexdigest()
            total_size = len(model_data)

            if total_size < NUM_FRAGMENTS:
                raise FragmentationError(f"Model {self.model_name} is too small to fragment into {NUM_FRAGMENTS} parts")

            fragment_size = total_size // NUM_FRAGMENTS
            fragments_data = [
                model_data[i * fragment_size : (i + 1) * fragment_size]
                for i in range(NUM_FRAGMENTS - 1)
            ]
            fragments_data.append(model_data[(NUM_FRAGMENTS - 1) * fragment_size:])

            self.encryption_key = get_random_bytes(32)
            fragments_data[ENCRYPTED_FRAGMENT_INDEX] = self._encrypt_fragment(
                fragments_data[ENCRYPTED_FRAGMENT_INDEX], self.encryption_key
            )

            fragment_names = self._generate_fragment_names()
            self.fragments = [
                Fragment(
                    name,
                    hashlib.sha256(data).hexdigest(),
                    is_encrypted=(i == ENCRYPTED_FRAGMENT_INDEX)
                )
                for i, (name, data) in enumerate(zip(fragment_names, fragments_data))
            ]

            if self.apply:
                self.output_dir.mkdir(parents=True, exist_ok=True)
                for fragment, data in zip(self.fragments, fragments_data):
                    fragment_path = self.output_dir / fragment.filename
                    with open(fragment_path, "wb") as f:
                        f.write(data)
                    logger.info(f"Created fragment: {fragment_path}")
                self._save_encryption_key()

            return {
                "version": self.version,
                "original_name": f"{self.model_name}.onnx",
                "sha256": original_checksum,
                "is_fragmented": True,
                "fragments": [
                    {"filename": frag.filename, "sha256": frag.sha256, "is_encrypted": frag.is_encrypted}
                    for frag in self.fragments
                ]
            }
        except Exception as e:
            raise FragmentationError(f"Failed to fragment model {self.model_name}: {str(e)}")

    def _encrypt_fragment(self, data: bytes, key: bytes) -> bytes:
        """Encripta un fragmento usando AES-CBC."""
        try:
            iv = get_random_bytes(AES.block_size)
            cipher = AES.new(key, AES.MODE_CBC, iv)
            padded_data = self._pad(data)
            encrypted_data = cipher.encrypt(padded_data)
            return iv + encrypted_data
        except Exception as e:
            raise EncryptionError(f"Encryption failed: {str(e)}")

    def _pad(self, data: bytes) -> bytes:
        """Añade padding PKCS7 al fragmento."""
        block_size = AES.block_size
        padding_size = block_size - len(data) % block_size
        padding = bytes([padding_size] * padding_size)
        return data + padding

    def _generate_fragment_names(self) -> List[str]:
        """Genera nombres únicos para los fragmentos."""
        return [
            f"{self.model_name}_chunk_{secrets.token_hex(8)}{ext}"
            for ext in FRAGMENT_EXTENSIONS
        ]

    def _save_encryption_key(self):
        """Guarda la clave de encriptación en un archivo."""
        key_path = self.key_dir / f"{self.model_name}_key.bin"
        try:
            if self.apply:
                self.key_dir.mkdir(parents=True, exist_ok=True)
                with open(key_path, "wb") as f:
                    f.write(self.encryption_key)
                logger.info(f"Encryption key saved to {key_path}")
        except Exception as e:
            raise EncryptionError(f"Failed to save encryption key: {str(e)}")

class MetadataManager:
    def __init__(self, metadata_file: Path, apply: bool = True):
        self.metadata_file = metadata_file
        self.apply = apply
        self.metadata: Dict = {}

    def load_metadata(self):
        """Carga el archivo de metadatos existente."""
        try:
            if self.metadata_file.exists():
                with open(self.metadata_file, "r") as f:
                    self.metadata = json.load(f)
                logger.info(f"Loaded metadata from {self.metadata_file}")
            else:
                self.metadata = {}
                logger.info("No existing metadata found, starting fresh")
        except Exception as e:
            raise MetadataError(f"Failed to load metadata: {str(e)}")

    def update_metadata(self, model_name: str, model_metadata: Dict):
        """Actualiza los metadatos con la información del modelo."""
        self.metadata[model_name] = model_metadata
        logger.info(f"Updated metadata for {model_name}")

    def save_metadata(self):
        """Guarda los metadatos actualizados en el archivo."""
        try:
            if self.apply:
                self.metadata_file.parent.mkdir(parents=True, exist_ok=True)
                with open(self.metadata_file, "w") as f:
                    json.dump(self.metadata, f, indent=2)
                logger.info(f"Metadata saved to {self.metadata_file}")
            else:
                logger.info("[DRY-RUN] Metadata would be saved")
        except Exception as e:
            raise MetadataError(f"Failed to save metadata: {str(e)}")

    def get_model_version(self, model_name: str) -> str:
        """Obtiene la versión actual del modelo desde los metadatos."""
        return self.metadata.get(model_name, {}).get("version", "1.0.0")

class BackupManager:
    def __init__(self, backup_dir: Path, apply: bool = True):
        self.backup_dir = backup_dir
        self.apply = apply

    def backup_file(self, file_path: Path):
        """Crea un backup de un archivo individual."""
        try:
            if not file_path.exists():
                logger.warning(f"File {file_path} does not exist, skipping backup")
                return
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"{file_path.stem}_{timestamp}{file_path.suffix}"
            backup_path = self.backup_dir / backup_name
            if self.apply:
                self.backup_dir.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, backup_path)
                logger.info(f"Backed up {file_path} to {backup_path}")
            else:
                logger.info(f"[DRY-RUN] Would backup {file_path} to {backup_path}")
        except Exception as e:
            raise BackupError(f"Failed to backup file {file_path}: {str(e)}")

    def backup_directory(self, dir_path: Path):
        """Crea un backup de un directorio completo."""
        try:
            if not dir_path.exists():
                logger.warning(f"Directory {dir_path} does not exist, skipping backup")
                return
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = self.backup_dir / f"{dir_path.name}_{timestamp}"
            if self.apply:
                self.backup_dir.mkdir(parents=True, exist_ok=True)
                shutil.copytree(dir_path, backup_path)
                logger.info(f"Backed up directory {dir_path} to {backup_path}")
            else:
                logger.info(f"[DRY-RUN] Would backup directory {dir_path} to {backup_path}")
            return backup_path
        except Exception as e:
            raise BackupError(f"Failed to backup directory {dir_path}: {str(e)}")

def validate_version(version: str) -> bool:
    """Valida que la versión tenga el formato X.Y.Z."""
    parts = version.split('.')
    return len(parts) == 3 and all(part.isdigit() for part in parts)

def main(
    apply: bool = False,
    globes_version: Optional[str] = None,
    text_version: Optional[str] = None,
    process_globes: bool = True,
    process_text: bool = True
):
    """Función principal para procesar los modelos."""
    try:
        # Validar que no se especifiquen versiones para modelos no procesados
        if not process_globes and globes_version:
            raise VersionError("No se puede especificar --globes-version si --process-globes no está habilitado")
        if not process_text and text_version:
            raise VersionError("No se puede especificar --text-version si --process-text no está habilitado")

        backup_manager = BackupManager(BACKUP_DIR, apply)
        metadata_manager = MetadataManager(METADATA_FILE, apply)

        # Cargar metadatos existentes
        metadata_manager.load_metadata()

        # Determinar modelos a procesar
        models_to_process = {}
        if process_globes:
            models_to_process["globes"] = MODELS_TO_PROCESS["globes"]
        if process_text:
            models_to_process["text"] = MODELS_TO_PROCESS["text"]
        
        if not models_to_process:
            raise ValueError("No se especificó ningún modelo para procesar")

        # Determinar versiones para cada modelo
        new_versions = {}
        for model in models_to_process:
            current_version = metadata_manager.get_model_version(model)
            specified_version = globes_version if model == "globes" else text_version
            if specified_version:
                if not validate_version(specified_version):
                    raise VersionError(f"Versión especificada para {model} inválida: {specified_version}. Debe ser X.Y.Z")
                new_versions[model] = specified_version
            else:
                new_versions[model] = get_next_version(current_version)
            logger.info(f"Versión para {model}: {new_versions[model]}")

        # Backup de la carpeta fragmented_models
        backup_path = None
        if FRAGMENTS_DIR.exists():
            backup_path = backup_manager.backup_directory(FRAGMENTS_DIR)
        else:
            logger.warning("Fragmented models directory does not exist, no backup created")

        # Procesar cada modelo seleccionado
        for model_key, model_file in models_to_process.items():
            model_path = FRAGMENTS_DIR / model_key / model_file
            if not model_path.exists():
                logger.error(f"Model file {model_path} does not exist, skipping")
                continue

            fragmenter = ModelFragmenter(model_path, FRAGMENTS_DIR, new_versions[model_key], apply)
            # Limpiar datos antiguos después del backup
            if backup_path or not FRAGMENTS_DIR.exists():
                fragmenter.clean_old_data()
            else:
                logger.warning(f"Skipping cleanup for {model_key} due to failed backup")
            model_metadata = fragmenter.fragment_model()
            metadata_manager.update_metadata(model_key, model_metadata)

        # Backup del archivo de metadatos antes de guardar
        if METADATA_FILE.exists():
            backup_manager.backup_file(METADATA_FILE)

        # Guardar metadatos actualizados
        metadata_manager.save_metadata()

    except (FragmentationError, EncryptionError, MetadataError, BackupError, VersionError, ValueError) as e:
        logger.error(f"Error in main process: {str(e)}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fragmenta modelos ONNX en fragmentos más pequeños")
    parser.add_argument('--apply', action='store_true', help='Aplica los cambios reales (por defecto solo simula)')
    parser.add_argument('--globes-version', type=str, help='Especifica la versión para el modelo globes (formato X.Y.Z)')
    parser.add_argument('--text-version', type=str, help='Especifica la versión para el modelo text (formato X.Y.Z)')
    parser.add_argument('--process-globes', action='store_true', default=True, help='Procesa el modelo globes (por defecto: sí)')
    parser.add_argument('--process-text', action='store_true', default=True, help='Procesa el modelo text (por defecto: sí)')
    args = parser.parse_args()

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    main(
        apply=args.apply,
        globes_version=args.globes_version,
        text_version=args.text_version,
        process_globes=args.process_globes,
        process_text=args.process_text
    )