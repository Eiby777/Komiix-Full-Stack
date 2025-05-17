import { ChevronRight, Sparkles, Wand2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Hero = ({ setShowAuthModal }) => {
  const navigate = useNavigate();

  return (

    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-8 pt-20 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge de novedad */}
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6 dark:bg-blue-500/10">
          <Sparkles className="w-5 h-5 text-blue-600 mr-2 dark:text-blue-400" />
          <span className="text-blue-600 font-medium dark:text-blue-400">NUEVO • Versión 1.0</span>
        </div>

        {/* Título y descripción */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-6 dark:from-blue-400 dark:to-indigo-300">
          Revoluciona tu Scanlation
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto dark:text-gray-300">
          Herramientas profesionales de traducción y edición de manga, potenciadas por IA y diseñadas por scanlators para scanlators.
        </p>
        <meta itemProp="name" content="Revoluciona tu Scanlation" />
        <meta itemProp="description" content="Herramientas profesionales de traducción y edición de manga, potenciadas por IA" />

        {/* Botones CTA */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <button
            onClick={async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                navigate('/dashboard');
              } else {
                setShowAuthModal(true);
              }
            }}
            className="relative inline-flex items-center px-8 py-4 overflow-hidden text-lg font-bold group bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
          >
            <span className="absolute w-full h-full transition-all duration-300 ease-out -translate-x-full bg-gradient-to-r from-blue-500 to-indigo-700 group-hover:translate-x-0"></span>
            <span className="relative w-full text-white transition-colors duration-300 ease-in-out group-hover:text-white flex items-center justify-center">
              <span>Comienza Gratis</span>
              <ChevronRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={() => window.scrollTo({ top: document.getElementById('features').offsetTop, behavior: 'smooth' })}
            className="relative inline-flex items-center px-6 py-3.5 overflow-hidden font-medium border-2 border-blue-500 rounded-xl group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-blue-100 group-hover:translate-x-0 dark:bg-blue-400/10"></span>
            <span className="relative text-blue-600 transition-colors duration-300 group-hover:text-blue-700 flex items-center dark:text-blue-400 dark:group-hover:text-blue-300">
              <Wand2 className="w-5 h-5 mr-2" />
              <span>Ver Demostración</span>
            </span>
          </button>
        </div>

        {/* Mini características */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Siempre Local</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Wand2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>5 Capas</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>IA Integrada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
