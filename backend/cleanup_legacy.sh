#!/bin/bash

# Safe Cleanup Script for Komiix Backend
# Removes legacy files and directories after restructuring

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  WARNING: This script will delete legacy files and directories. ⚠️${NC}"
echo -e "${YELLOW}Make sure you have tested the new structure and have a backup!${NC}"
echo ""
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Cleanup cancelled.${NC}"
    exit 1
fi

echo ""
echo "Cleaning up..."

# Helper function to remove with logging
remove_path() {
    if [ -e "$1" ]; then
        rm -rf "$1"
        echo -e "${GREEN}✓ Removed: $1${NC}"
    else
        echo -e "${YELLOW}Skipped (not found): $1${NC}"
    fi
}

# Directories
remove_path "config"
remove_path "dependencies"
remove_path "endpoints"
remove_path "fonts"
remove_path "models"
remove_path "manga_ocr_japanese"
remove_path "onnxocr"

# Files
remove_path "server.py"

echo ""
echo -e "${GREEN}✨ Cleanup complete! The backend is now fully migrated to the new structure.${NC}"
echo -e "${YELLOW}Don't forget to commit these changes to git!${NC}"
