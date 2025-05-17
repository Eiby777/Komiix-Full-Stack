import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronRight, FileText } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Navigation from './Home/Navegation';
import Authentication from './Home/Authentication';

const TermsOfService = () => {
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
        <title>Términos de Servicio - Komiix</title>
        <meta name="description" content="Términos y condiciones de uso de Komiix. Conoce las reglas para usar nuestra herramienta de edición de manga."/>
        <meta name="keywords" content="términos de servicio, komiix, condiciones de uso, política"/>
        <link rel="canonical" href="https://komiix.com/terms"/>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Términos de Servicio de Komiix",
            "description": "Términos y condiciones que rigen el uso de Komiix",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://komiix.com"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "Términos de Servicio"
              }]
            }
          })}
        </script>
      </Helmet>
      <Navigation setShowAuthModal={setShowAuthModal} />
      
      <div className="container mx-auto px-4 pt-36 pb-20 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 mb-6">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 mb-4">
            Condiciones de Servicio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Última actualización: 14 de mayo de 2024
          </p>
        </div>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Bienvenido a Komiix, una herramienta gratuita para scanlators diseñada para facilitar la traducción y edición de manga. Al usar Komiix, aceptas cumplir con estas Condiciones de Servicio. Si no estás de acuerdo, por favor no utilices la aplicación.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">1</span>
            Uso de la aplicación
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
              Komiix es una herramienta gratuita sostenida por anuncios proporcionados por Google AdSense. Ofrecemos:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Procesamiento local de imágenes y proyectos utilizando IndexedDB en tu navegador.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Modelos de inteligencia artificial que se ejecutan localmente y se actualizan automáticamente desde nuestro endpoint de FastAPI cuando es necesario.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Acceso ilimitado a proyectos sin restricciones de uso, incluso con múltiples cuentas.</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              No hay una edad mínima para usar Komiix, pero debes tener una cuenta de Google o Facebook para iniciar sesión.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">2</span>
            Responsabilidad del usuario
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Eres completamente responsable del uso que hagas de Komiix, incluyendo cualquier contenido que subas, edites o exportes.</strong> Al usar Komiix, aceptas:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">No utilizar Komiix para actividades ilegales, ya sea de forma directa o indirecta, incluyendo la violación de derechos de autor, propiedad intelectual o cualquier otra ley aplicable.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">No subir, editar ni exportar contenido que sea ilegal, ofensivo o que infrinja los derechos de terceros.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Proteger la seguridad de tu cuenta y dispositivo, incluyendo el uso de contraseñas seguras y la actualización de tu navegador.</span>
              </li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r">
              <p className="text-blue-800 dark:text-blue-300 italic">
                El propietario de Komiix, sus desarrolladores y afiliados no serán responsables bajo ninguna circunstancia por el uso indebido de la aplicación, el contenido generado o exportado por los usuarios, ni por cualquier consecuencia legal, financiera o de otro tipo derivada de tus acciones.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">3</span>
            Propiedad intelectual
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Komiix y su tecnología subyacente (incluyendo la interfaz, los modelos de IA y el código) son propiedad del propietario de Komiix. No tienes derecho a copiar, modificar ni distribuir ningún componente de Komiix sin autorización expresa.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Eres responsable de asegurarte de que cualquier contenido que subas o edites cumple con las leyes de propiedad intelectual aplicables. Komiix no verifica ni asume responsabilidad por el contenido de los usuarios.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">4</span>
            Limitación de responsabilidad
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Komiix se proporciona "tal cual", sin garantías de ningún tipo, ya sean expresas o implícitas. No garantizamos que:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">La aplicación esté libre de errores o interrupciones.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Los modelos de IA sean siempre precisos o cumplan con tus expectativas.</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Los datos almacenados localmente en tu navegador estén protegidos contra pérdida o corrupción debido a fallos de tu dispositivo.</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              El propietario de Komiix no será responsable por ningún daño directo, indirecto, incidental o consecuente derivado del uso o la imposibilidad de usar la aplicación.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">5</span>
            Actualizaciones y cambios
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Nos reservamos el derecho de actualizar Komiix, incluyendo la interfaz, las funcionalidades y los modelos de IA, en cualquier momento. También podemos modificar estas Condiciones de Servicio. Te notificaremos de cambios significativos a través de la aplicación o por correo electrónico.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">6</span>
            Terminación
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Podemos suspender o cancelar tu acceso a Komiix si violas estas Condiciones de Servicio o si determinamos que tu uso representa un riesgo para la aplicación o para otros usuarios. También puedes eliminar tu cuenta en cualquier momento contactándonos.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">7</span>
            Ley aplicable
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Estas Condiciones de Servicio se rigen por las leyes de la República Dominicana. Cualquier disputa será resuelta en los tribunales competentes de la República Dominicana.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full mr-3 text-sm font-semibold">8</span>
            Contacto
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Si tienes preguntas sobre estas Condiciones de Servicio, contáctanos en:
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

export default TermsOfService;
