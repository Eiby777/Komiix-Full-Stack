import { Download, Layers, Sliders } from 'lucide-react';

const Benefics = () => {
  return (
    <section className="py-16 bg-blue-50/50 dark:bg-gray-900/30" itemScope itemType="https://schema.org/ItemList">
      <div className="container mx-auto px-4">
        <meta itemProp="name" content="Beneficios de Komiix" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 mr-4 dark:bg-blue-500/10">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Siempre en tu control</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Tus imágenes se guardan solo en tu navegador, siempre privadas y seguras.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/10 mr-4">
                <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Flujo Organizado</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Capas especializadas para cada etapa del proceso: detección, limpieza, traducción y exportación.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-500/10 mr-4">
                <Sliders className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Modelos Actualizados</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Nuestros modelos de IA para detección de texto y globos se actualizan periódicamente para mayor precisión.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefics;
