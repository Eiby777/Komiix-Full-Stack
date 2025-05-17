import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Limpiar URLs al desmontar
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(file.file);
      });
      setUploadedFiles([]);
    };
  }, []);

  const handleFileUpload = async (inputFiles) => {
    const validFiles = [];

    // Convert input to FileList if necessary
    let files;

    if (inputFiles instanceof FileList) {
      files = inputFiles;
    } else {
      const dataTransfer = new DataTransfer();
      Array.from(inputFiles).forEach((file) => {
        if (file instanceof File) {
          dataTransfer.items.add(file);
        }
      });
      files = dataTransfer.files;
    }

    for (const file of Array.from(files)) {
      try {
        if (!(file instanceof File) || !file.type.startsWith("image/")) {
          continue;
        }

        const img = new Image();
        try {
          img.src = URL.createObjectURL(file);
        } catch (error) {
          continue;
        }

        // Validación temporal deshabilitada para pruebas
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const fileData = {
          file,
          progress: 0,
          status: "pending",
          id: Date.now() + Math.random().toString(36).substring(2, 9),
        };

        validFiles.push(fileData);

        URL.revokeObjectURL(img.src);
      } catch (error) {
        alert(error.message);
        continue;
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => {
        const newFiles = [...prev, ...validFiles];
        return newFiles;
      });
    }
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((file) => file.id !== fileId);
      return newFiles;
    });
  };

  const fileInputRef = useRef(null);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadedFiles,
    isDragging,
    setIsDragging,
    handleFileUpload,
    handleDeleteFile,
    setUploadedFiles,
    fileInputRef,
    clearFiles,
  };
}
