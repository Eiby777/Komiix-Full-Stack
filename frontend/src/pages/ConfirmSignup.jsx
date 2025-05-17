import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Book, CheckCircle, Home, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ConfirmSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setError('Enlace de verificación inválido');
        setLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) throw error;

        setSuccess(true);
        setTimeout(() => navigate('/'), 3000); // Redirige al inicio tras 3 segundos
      } catch (err) {
        console.error('Error en la verificación de correo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Barra de navegación */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Komiix
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
          Volver a Inicio
        </button>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-between p-8 pt-20">
        {/* Sección izquierda */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8 z-10">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Verificación de Correo
            </h1>
            <p className="text-xl text-gray-300">
              Estamos verificando tu dirección de correo electrónico...
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            Volver al Inicio
            <Home className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Sección derecha */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
          <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md transition-all duration-300">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {loading ? (
              <div className="flex flex-col items-center space-y-6">
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
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Verificando tu correo...
                </p>
              </div>
            ) : error ? (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Error de Verificación
                </h2>
                <p className="text-red-500 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
                  {error}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ir al Inicio
                </button>
              </div>
            ) : success ? (
              <div className="text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ¡Correo Verificado!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Tu correo ha sido verificado con éxito. Serás redirigido al inicio en breve.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ir al Inicio
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}