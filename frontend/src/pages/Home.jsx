import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navigation from './Home/Navegation';
import Hero from './Home/Hero';
import Benefics from './Home/Benefics';
import Funtionalities from './Home/Funtionalities';
import Process from './Home/Process';
import DetailedFeatures from './Home/DetailedFeatures';
import Limitations from './Home/Limitations';
import Faq from './Home/Faq';
import CTA from './Home/CTA';
import Authentication from './Home/Authentication';

export default function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUrl = window.location.href.replace(/\/$/, '');

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
          redirectTo: currentUrl,
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



  return (
    <React.Fragment>
      <Helmet>
        <html lang="es" />
        <title>Komiix - Herramientas de Scanlation con IA para Manga</title>
        <meta name="description" content="Plataforma gratuita de scanlation con IA para traducir manga. Detección automática de globos, limpieza y OCR multiidioma. Flujo optimizado para scanlators." />
        <meta name="keywords" content="scanlation, traducción manga, edición manga, herramientas scanlator, IA manga, traducción automática, limpieza manga, globos diálogo, OCR japonés, editor manga online" />
        <meta name="author" content="Komiix Team" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="Komiix" />
        
        {/* Canonical and alternate URLs */}
        <link rel="canonical" href="https://komiix.com/" />
        <link rel="alternate" hrefLang="es" href="https://komiix.com/" />
        <link rel="alternate" hrefLang="en" href="https://komiix.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://komiix.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Komiix - Herramientas Profesionales de Scanlation y Traducción de Manga" />
        <meta property="og:description" content="Plataforma gratuita de scanlation con IA para traducir y editar manga. Herramientas profesionales para scanlators con detección automática y flujo optimizado." />
        <meta property="og:url" content="https://komiix.com/" />
        <meta property="og:site_name" content="Komiix" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:image" content="https://komiix.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Komiix - Herramientas de Scanlation con IA" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Komiix - Herramientas Profesionales de Scanlation" />
        <meta name="twitter:description" content="Plataforma gratuita de scanlation con IA para traducir y editar manga. Flujo optimizado para scanlators." />
        <meta name="twitter:image" content="https://komiix.com/twitter-image.jpg" />
        <meta name="twitter:image:alt" content="Komiix - Herramientas de Scanlation" />
        <meta name="twitter:creator" content="@komiixapp" />
        <meta name="twitter:site" content="@komiixapp" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Komiix" />
        
        {/* Performance and Core Web Vitals optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://discord.gg" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        
        {/* Critical resources preload for mobile performance */}
        <link rel="preload" as="image" href="/hero-image.webp" />
        <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Mobile performance optimizations */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Komiix" />
        
        {/* Reduce render-blocking resources */}
        <link rel="preload" href="/critical.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <noscript>{`<link rel="stylesheet" href="/critical.css" />`}</noscript>
        
        {/* Optimize JavaScript loading */}
        <script>
          {`
            // Performance optimization: Defer non-critical JavaScript
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
            
            // Preload critical images
            const criticalImages = ['/hero-image.webp', '/logo.png'];
            criticalImages.forEach(src => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = src;
              document.head.appendChild(link);
            });
          `}
        </script>
        
        {/* Structured Data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Komiix",
            "applicationCategory": "GraphicsApplication",
            "operatingSystem": "Web Browser",
            "description": "Plataforma gratuita de scanlation con herramientas profesionales de IA para traducir y editar manga. Incluye detección automática de globos, limpieza de imágenes y traducción optimizada para scanlators.",
            "url": "https://komiix.com",
            "author": {
              "@type": "Organization",
              "name": "Komiix Team",
              "url": "https://komiix.com"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            },
            "featureList": [
              "Detección automática de globos y texto",
              "Limpieza avanzada de imágenes",
              "Traducción con IA integrada",
              "Flujo de trabajo en 5 capas",
              "Almacenamiento local privado",
              "Exportación en múltiples formatos"
            ]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Komiix",
            "url": "https://komiix.com",
            "logo": "https://komiix.com/logo.png",
            "description": "Herramientas profesionales de scanlation y traducción de manga con IA",
            "foundingDate": "2024",
            "sameAs": [
              "https://discord.gg/GU53CsXabn"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://discord.gg/GU53CsXabn"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Komiix",
            "url": "https://komiix.com",
            "description": "Plataforma profesional de scanlation con herramientas de IA para traducir y editar manga",
            "inLanguage": "es-ES",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://komiix.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white" itemScope itemType="https://schema.org/WebPage">
      <header role="banner">
        <Navigation setShowAuthModal={setShowAuthModal} />
      </header>
      <main role="main" itemScope itemType="https://schema.org/WebPageElement" itemProp="mainContentOfPage">
        <Hero setShowAuthModal={setShowAuthModal} />
        <Benefics />
        <Funtionalities />
        <Process />
        <DetailedFeatures />
        <Limitations />
        <Faq />
        <CTA setShowAuthModal={setShowAuthModal} />
      </main>
      
      {/* Footer with Legal Links and Additional SEO Content */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="container mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                Komiix - Scanlation Profesional
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                La plataforma más avanzada para scanlation y traducción de manga. Herramientas profesionales con IA integrada para detectar, limpiar y traducir globos de diálogo de forma automática. Diseñado por scanlators para la comunidad de scanlation mundial.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 dark:text-gray-500">Tecnología:</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">React</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">IA Local</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">Fabric.js</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Herramientas</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-gray-600 dark:text-gray-400">Detección de Globos</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">OCR Multiidioma</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">Limpieza Automática</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">Editor de Texto</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">Exportación HD</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Idiomas Soportados</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-gray-600 dark:text-gray-400">🇯🇵 Japonés</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">🇨🇳 Chino Simplificado</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">🇰🇷 Coreano</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">🇺🇸 Inglés</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">🇪🇸 Español</span></li>
              </ul>
            </div>
          </div>
          
          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  © {new Date().getFullYear()} Komiix. Todos los derechos reservados.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  Hecho con ❤️ para la comunidad de scanlation
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigate('/privacy')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                  aria-label="Ver Política de Privacidad"
                >
                  Política de Privacidad
                </button>
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                  aria-label="Ver Términos de Servicio"
                >
                  Términos de Servicio
                </button>
                <button 
                  onClick={() => navigate('/docs')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                  aria-label="Ver Documentación"
                >
                  Documentación
                </button>
                <button 
                  onClick={() => window.open('https://discord.gg/GU53CsXabn', '_blank')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                  aria-label="Únete a nuestro Discord"
                >
                  Comunidad Discord
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <Authentication
          setShowAuthModal={setShowAuthModal}
          handleGoogleAuth={handleGoogleAuth}
          loading={loading}
          error={error}
        />
      )}
    </div>
    </React.Fragment>
  );
}
