import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navigation from './Home/Navegation';
import Hero from './Home/Hero';
import Benefics from './Home/Benefics';
import Funtionalities from './Home/Funtionalities';
import Process from './Home/Process';
import Limitations from './Home/Limitations';
import Faq from './Home/Faq';
import CTA from './Home/CTA';
import Authentication from './Home/Authentication';

export default function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const url = "https://komiix.com";
  // const url = "http://localhost:3000";

  useEffect(() => {
    // Listen for auth state changes (e.g., after login or OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Redirect handled by onAuthStateChange
    } catch (err) {
      console.error('Google auth failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      // Redirect handled by onAuthStateChange
    } catch (err) {
      console.error('Facebook auth failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Komiix - Herramientas de edición y procesamiento de imágenes</title>
        <meta name="description" content="Plataforma avanzada para edición y procesamiento de imágenes con IA. Crea, edita y optimiza tus imágenes de forma profesional." />
        <meta name="keywords" content="edición de imágenes, procesamiento de imágenes, IA, herramientas gráficas" />
        <link rel="canonical" href="https://komiix.com/" />
        <meta property="og:title" content="Komiix - Herramientas de edición de imágenes" />
        <meta property="og:description" content="Plataforma avanzada para edición y procesamiento de imágenes con IA" />
        <meta property="og:url" content="https://komiix.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
      <header>
        <Navigation setShowAuthModal={setShowAuthModal} />
      </header>
      <main>
        <Hero setShowAuthModal={setShowAuthModal} />
        <Benefics />
        <Funtionalities />
        <Process />
        <Limitations />
        <Faq />
        <CTA setShowAuthModal={setShowAuthModal} />
      </main>
      
      {/* Footer with Legal Links */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Komiix. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <button 
                onClick={() => navigate('/privacy')}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
              >
                Política de Privacidad
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
              >
                Términos de Servicio
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <Authentication
          setShowAuthModal={setShowAuthModal}
          handleGoogleAuth={handleGoogleAuth}
          handleFacebookAuth={handleFacebookAuth}
          loading={loading}
          error={error}
        />
      )}
    </div>
    </React.Fragment>
  );
}
