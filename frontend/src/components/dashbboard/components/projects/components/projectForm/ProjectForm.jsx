import { useState, useEffect } from "react";
import {
  convertToBanner,
  convertFileArrayToBufferArrayObject,
} from "../../../../../../lib/projects";
import { useDashboard } from "../../../../../../hooks/useDashboard";
import { v4 as uuidv4 } from "uuid";
import { useFileUpload } from "../../../../../../hooks/useFileUpload";
import { handleCreateLocalProject } from "./handlers/createProjects";
import { useEditorStore } from "../../../../../../stores/editorStore";

export default function ProjectForm({ setShowCreateProjectModal }) {
  const {
    isDragging,
    setIsDragging,
  } = useDashboard();
  const { addProject } = useEditorStore();

  const {
    fileInputRef,
    handleFileUpload,
    uploadedFiles,
    handleDeleteFile,
    setUploadedFiles,
    clearFiles
  } = useFileUpload();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [creationError, setCreationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    return () => {
      if (typeof clearFiles === "function") {
        clearFiles();
      }
    };
  }, [clearFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError(null);
    setImageError(null);
    setNetworkError(null);
    setCreationError(null);

    let hasError = false;
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Por favor, ingresa un nombre para el proyecto");
      hasError = true;
    }

    if (uploadedFiles.length === 0) {
      setImageError("Por favor, sube al menos una imagen");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      // Generate a local project ID
      const projectId = uuidv4();

      // Update files to show "saving" status
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          status: "saving",
          progress: 0,
          stage: "saving",
        }))
      );

      const filesImages = uploadedFiles.map((f) => f.file);
      const banner = await convertToBanner(filesImages);

      // Simulate progress for local storage
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          status: "saving",
          progress: 50,
          stage: "saving",
        }))
      );

      // Store project locally in IndexedDB
      await handleCreateLocalProject({
        projectId,
        name,
        images: await convertFileArrayToBufferArrayObject(filesImages),
        lastUpdated: Date.now(),
        banner,
      });

      addProject({
        id: projectId,
        name,
        last_updated: new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        banner: URL.createObjectURL(new Blob([banner], { type: "image/webp" })),
        status: "Pendiente",
      });

      // Update files to show "completed" status
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          status: "completed",
          progress: 100,
          stage: "completed",
        }))
      );

      

      setShowCreateProjectModal(false);
    } catch (error) {
      setCreationError("Failed to save project locally");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[calc(100vh-180px)] flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6 rounded-xl shadow-lg z-[3000]"
    >
      <div className="flex-1 min-h-0 flex flex-col space-y-6">
        {/* Project Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            Nombre del Proyecto
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Digite el nombre del proyecto"
          />
        </div>

        {/* Error Messages */}
        <div className="space-y-2">
          {nameError && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
              {nameError}
            </p>
          )}
          {imageError && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
              {imageError}
            </p>
          )}
          {creationError && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
              {creationError}
            </p>
          )}
          {networkError && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
              {networkError}
            </p>
          )}
        </div>

        {/* File Upload Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <div
              className={`border-2 border-dashed rounded-xl p-8 bg-white dark:bg-gray-800 transition-all duration-200 ${isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300"
                }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(Array.from(e.dataTransfer.files));
              }}
            >
              <input
                type="file"
                id="images"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-full text-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Arrastre y suelte imágenes aquí o haga clic para cargarlas.
              </button>
            </div>

            {/* Uploaded Files Grid */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200"
                  >
                    <img
                      src={URL.createObjectURL(file.file)}
                      alt={file.file.name}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transform transition-all duration-200 group-hover:scale-110"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="relative h-5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                          style={{ width: `${file.progress || 0}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {file.status === "pending" && "Pending"}
                          {file.status === "saving" && `Saving (${file.progress}%)`}
                          {file.status === "completed" && "Done"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 shrink-0">
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            "Crear el Proyecto"
          )}
        </button>
      </div>
    </form>
  );
}