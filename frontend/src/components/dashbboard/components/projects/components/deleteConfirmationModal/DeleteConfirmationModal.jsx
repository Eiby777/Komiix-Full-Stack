import { X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all duration-200 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Are you sure you want to delete this project? This action is permanent and cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-md"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}