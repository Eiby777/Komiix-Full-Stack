import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Mail, ChevronRight, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password#access_token=`,
      });

      if (error) throw error;

      setSuccessMessage('¡Enlace de restablecimiento enviado! Revisa tu correo.');
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              Restablece tu Contraseña
            </h1>
            <p className="text-xl text-gray-300">
              Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            Volver al Inicio
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
          <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md transition-all duration-300">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
              ¿Olvidaste tu Contraseña?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Te ayudaremos a recuperar tu cuenta
            </p>

            <form className="space-y-6" onSubmit={handlePasswordReset}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shadow-md">
                  {error}
                </p>
              )}
              {successMessage && (
                <p className="text-green-500 dark:text-green-400 text-sm text-center bg-green-100 dark:bg-green-900/30 p-2 rounded-lg shadow-md">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                ) : null}
                Enviar Enlace
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}