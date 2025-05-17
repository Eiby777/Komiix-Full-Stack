import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Navigation from './Home/Navegation';
import Authentication from './Home/Authentication';

const PrivacyPolicy = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
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
    } catch (err) {
      console.error('Facebook auth failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Helmet>
        <title>Política de Privacidad - Komiix</title>
        <meta name="description" content="Política de privacidad de Komiix. Conoce cómo protegemos tus datos en nuestra herramienta de edición de manga."/>
        <meta name="keywords" content="política de privacidad, komiix, privacidad, datos personales, protección de datos"/>
        <link rel="canonical" href="https://komiix.com/privacy"/>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            "name": "Política de Privacidad de Komiix",
            "datePublished": "2024-05-14",
            "url": "https://komiix.com/privacy",
            "description": "Política de privacidad que explica cómo Komiix maneja tus datos personales"
          })}
        </script>
      </Helmet>
      <Navigation setShowAuthModal={setShowAuthModal} />
      
      <div className="container mx-auto px-4 pt-36 pb-20 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Última actualización: 14 de mayo de 2024
          </p>
        </div>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              En Komiix, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tus datos mientras utilizas nuestra aplicación. Komiix es una herramienta diseñada para scanlators, y todos los procesos de edición y traducción se realizan localmente en tu navegador.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">1</span>
            Datos que recopilamos
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Solo recopilamos la información mínima necesaria para proporcionarte acceso a Komiix:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Autenticación:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    Cuando inicias sesión con Google o Facebook, recopilamos tu correo electrónico, nombre de usuario y, en algunos casos, la foto de perfil asociada a tu cuenta. Estos datos son gestionados por Supabase, nuestro proveedor de autenticación.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Datos del proyecto:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    Todas las imágenes, proyectos y datos generados en Komiix se almacenan exclusivamente en tu navegador utilizando IndexedDB. No enviamos ni almacenamos estos datos en nuestros servidores ni en la nube.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Modelos de IA:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    Los modelos de inteligencia artificial utilizados para detección de texto y globos se descargan automáticamente en tu navegador desde nuestro endpoint de FastAPI cuando es necesario (por ejemplo, al detectar una nueva versión o si no hay modelos presentes). La inferencia se realiza completamente en tu dispositivo.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">2</span>
            Cómo usamos tus datos
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Los datos recopilados se utilizan únicamente para los siguientes propósitos:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Autenticación:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    Tu correo electrónico, nombre de usuario y foto de perfil se usan para gestionar tu acceso a Komiix y proporcionarte una experiencia personalizada.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Mejora de la aplicación:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    No recopilamos datos de uso, pero los modelos de IA descargados pueden actualizarse periódicamente para mejorar la precisión y funcionalidad.
                  </span>
                </div>
              </li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r">
              <p className="text-blue-800 dark:text-blue-300 italic">
                No compartimos, vendemos ni transferimos tus datos a terceros, salvo lo necesario para la autenticación con Google o Facebook a través de Supabase.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">3</span>
            Anuncios
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Komiix es gratuito y está respaldado por anuncios proporcionados por Google AdSense. Estos anuncios no utilizan cookies de seguimiento ni recopilan información personal más allá de lo estrictamente necesario para verificar que los anuncios se están mostrando. No compartimos datos personales con Google AdSense ni con ningún otro proveedor de anuncios.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">4</span>
            Almacenamiento y seguridad
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Todos los datos de tus proyectos se almacenan localmente en tu navegador mediante IndexedDB, lo que garantiza que permanezcan privados y bajo tu control. Los datos de autenticación gestionados por Supabase están protegidos con medidas de seguridad estándar de la industria. Sin embargo, eres responsable de mantener la seguridad de tu cuenta y dispositivo.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">5</span>
            Tus derechos
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Tienes derecho a:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Acceder a los datos de autenticación que hemos recopilado.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Solicitar la eliminación de tu cuenta y datos de autenticación.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Optar por no iniciar sesión y usar Komiix sin cuenta, aunque algunas funciones pueden estar limitadas.</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Para ejercer estos derechos, contáctanos en{' '}
              <a 
                href="mailto:komiix@googlegroups.com" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                komiix@googlegroups.com
              </a>.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">6</span>
            Cambios en esta política
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas o en la legislación aplicable. Te notificaremos de cualquier cambio significativo a través de la aplicación o por correo electrónico.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">7</span>
            Contacto
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                <span className="font-medium text-gray-900 dark:text-white">Correo electrónico:</span>{' '}
                <a 
                  href="mailto:komiix@googlegroups.com" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  komiix@googlegroups.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-blue-800 dark:text-blue-300 text-lg">
                Komiix está basado en la República Dominicana y cumple con las leyes locales aplicables, incluyendo la Ley No. 172-13 sobre Protección de Datos Personales.
              </p>
            </div>
          </div>
        </section>

      </div>
      
      {/* Auth Modal */}
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
  );
};

export default PrivacyPolicy;
