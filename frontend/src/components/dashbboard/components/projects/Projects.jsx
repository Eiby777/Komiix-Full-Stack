import { useState, useEffect } from 'react';
import { useDashboard } from "../../../../hooks/useDashboard";
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../../../stores/editorStore';
import { useProjectHandler } from '../../../../hooks/getProjects';
import CreateProjectModal from './components/createProjectModal/CreateProjectModal';
import { handleDeleteProject } from './handlers/deleteProjects';


const Projects = ({
    isProfileMenuOpen,
}) => {

    const {
        isLoading 
    } = useDashboard();

    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [deletingProjects, setDeletingProjects] = useState(new Set());
    const { 
        projects,
        removeProject,
        setImages, 
        setActiveImageIndex, 
        setImagesLoaded, 
        resetCanvasInstances, 
        resetActiveTools,
        setProjectId
    } = useEditorStore();
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const { handleProjectImages } = useProjectHandler(null);

    const handleConfirmDelete = (projectId) => {
        setDeletingProjects((prev) => new Set(prev).add(projectId));
        setShowConfirmModal(false);
        handleDeleteProject(projectId, removeProject).then(() => {
            setDeletingProjects((prev) => {
                const newSet = new Set(prev);
                newSet.delete(projectId);
                return newSet;
            });
        });
    };

    const openDeleteConfirmation = (project) => {
        setProjectToDelete(project);
        setShowConfirmModal(true);
    };

    const handleEditProject = async (projectId) => {
        try {
            const images = await handleProjectImages(projectId);
            if (images && images.length > 0) {
                resetActiveTools();
                resetCanvasInstances();
                setImagesLoaded(false);
                setImages(images);
                setActiveImageIndex(0);
                setProjectId(projectId)
                navigate(`/editor/${projectId}`);
            }
        } catch (error) {
            console.error("Error editing project:", error);
        }
    };

    return (
        <>
            <div
                className={`h-full relative flex-1 transition-all duration-300 ${isProfileMenuOpen ? 'pointer-events-none opacity-50 z-10' : 'opacity-100 z-10'
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black backdrop-blur-sm z-[-1]" />

                <main className="relative p-8 z-0">
                    <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Tus Proyectos
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <svg
                                className="animate-spin h-12 w-12 text-blue-500"
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
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <button
                                onClick={() => setShowCreateProjectModal(true)}
                                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl group transition-all duration-300 flex items-center justify-center h-32 w-full border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden"
                            >
                                <div className="text-5xl text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                                    +
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/20 group-hover:from-blue-500/20 group-hover:to-blue-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <span className="absolute bottom-4 text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    New Project
                                </span>
                            </button>

                            {projects.map((project) => {
                                const isDeleting = deletingProjects.has(project.id);

                                return (
                                    <div
                                        key={project.id}
                                        className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full min-h-[180px] border border-gray-200 dark:border-gray-700 overflow-hidden ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                                            }`}
                                        style={{
                                            backgroundImage: project.banner ? `url(${project.banner})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black/50 z-0" />
                                        <div className="relative flex items-center justify-between p-6 z-10 h-full">
                                            <div className="text-left text-white space-y-2">
                                                <div className="text-xl font-semibold">{project.name}</div>
                                                <div className="text-sm">Status: {project.status}</div>
                                                <div className="text-sm">
                                                    Last Updated: {project.last_updated}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => openDeleteConfirmation(project)}
                                                    disabled={isDeleting}
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isDeleting ? (
                                                        <svg
                                                            className="animate-spin h-6 w-6 text-white"
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
                                                    ) : (
                                                        <svg
                                                            className="w-6 h-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEditProject(project.id)}
                                                    disabled={isDeleting}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-16 h-16 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <svg
                                                        className="w-8 h-8"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Confirmar Eliminación
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                ¿Estás seguro de querer eliminar "{projectToDelete?.name}"? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleConfirmDelete(projectToDelete.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isProfileMenuOpen && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-auto z-5" />
                )}
            </div>
            {showCreateProjectModal && (
                <CreateProjectModal
                    setShowCreateProjectModal={setShowCreateProjectModal}
                />
            )}
        </>
    )
}

export default Projects