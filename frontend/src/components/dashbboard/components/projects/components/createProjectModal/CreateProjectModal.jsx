import React, { useState } from 'react';
import ProjectForm from '../projectForm/ProjectForm'

export default function CreateProjectModal({
  setShowCreateProjectModal,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  return (

    <>
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm  z-[5000] overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
          <button
            onClick={() => !isSubmitting && setShowCreateProjectModal(false)}
            disabled={isSubmitting}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isSubmitting
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Crear Nuevo Proyecto</h2>
          <ProjectForm
            setShowCreateProjectModal={setShowCreateProjectModal}
          />
        </div>
      </div>
    </>
  );
}
