import { X, Facebook } from 'lucide-react';

const Authentication = ({ setShowAuthModal, handleGoogleAuth, handleFacebookAuth, loading, error }) => {
    return (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-300 dark:border-gray-700 transition-all duration-300">
                <button
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Inicia Sesión
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    Elige tu método de autenticación preferido
                </p>

                {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm text-center mb-6">{error}</p>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-gray-700 dark:text-gray-200 mr-2"
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
                            <>
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.58v3.01h3.94c2.31-2.12 3.64-5.24 3.64-8.83z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12.255 24c3.3 0 6.06-1.09 8.08-2.94l-3.94-3.01c-1.09.73-2.48 1.16-4.14 1.16-3.18 0-5.88-2.15-6.84-5.04H1.325v3.11C3.365 21.44 7.575 24 12.255 24z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.415 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.58H1.325a11.86 11.86 0 000 10.83l4.09-3.12z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12.255 4.75c1.8 0 3.42.62 4.68 1.84l3.51-3.51C18.305 1.09 15.555 0 12.255 0 7.575 0 3.365 2.56 1.325 6.58l4.09 3.11c.96-2.89 3.66-5.04 6.84-5.04z"
                                    />
                                </svg>
                                Continuar con Google
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleFacebookAuth}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-gray-700 dark:text-gray-200 mr-2"
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
                            <>
                                <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" />
                                Continuar con Facebook
                            </>
                        )}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Al continuar, aceptas nuestros{' '}
                    <a href="/terms" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                        Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="/privacy" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                        Política de Privacidad
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Authentication;