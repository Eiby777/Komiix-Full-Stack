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

          <button
            onClick={() => window.open('https://discord.gg/GU53CsXabn', '_blank')}
            className="relative inline-flex items-center px-6 py-3.5 overflow-hidden font-medium border-2 border-purple-500 rounded-xl group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-purple-100 group-hover:translate-x-0 dark:bg-purple-400/10"></span>
            <span className="relative text-purple-600 transition-colors duration-300 group-hover:text-purple-700 flex items-center dark:text-purple-400 dark:group-hover:text-purple-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Únete a Discord</span>
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
