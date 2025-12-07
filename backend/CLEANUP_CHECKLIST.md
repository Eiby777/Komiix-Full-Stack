# Backend Cleanup Checklist

Once you have fully verified that the new backend structure works correctly in your production environment, you can safely remove the old files and directories to keep the project clean.

**⚠️ WARNING: Make sure you have a backup or git commit before deleting these files.**

## 🗑️ Directories to Delete

These directories have been migrated to the new structure:

- [ ] `config/`
  - *Migrated to:* `app/core/` (code) and `data/` (json files)
- [ ] `dependencies/`
  - *Migrated to:* `app/api/deps.py`
- [ ] `endpoints/`
  - *Migrated to:* `app/api/v1/endpoints/`
- [ ] `fonts/`
  - *Migrated to:* `assets/fonts/`
- [ ] `models/`
  - *Migrated to:* `assets/ml_models/`
- [ ] `manga_ocr_japanese/`
  - *Migrated to:* `lib/manga_ocr/`
- [ ] `onnxocr/`
  - *Migrated to:* `lib/onnx_ocr/`

## 📄 Files to Delete

- [ ] `server.py`
  - *Migrated to:* `app/main.py`

## 🚀 Automation

You can use the provided script `cleanup_legacy.sh` to perform this cleanup automatically:

```bash
chmod +x cleanup_legacy.sh
./cleanup_legacy.sh
```

## 🔍 Verification

After cleanup, verify everything still works:
1. `uv run uvicorn app.main:app`
2. Check endpoints (OCR, Translate, etc.)
