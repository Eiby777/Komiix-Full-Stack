import { Zap, Eye, Globe, Shield } from 'lucide-react';

const DetailedFeatures = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900" itemScope itemType="https://schema.org/ItemList">
      <div className="container mx-auto px-4">
        <meta itemProp="name" content="Características Detalladas de Komiix" />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Características Avanzadas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Herramientas profesionales diseñadas específicamente para scanlators
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-500/10 mr-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Procesamiento Rápido</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Algoritmos optimizados para procesar páginas de manga en segundos, manteniendo la calidad HD.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-500/10 mr-4">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detección Precisa</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              IA especializada en identificar globos de diálogo, texto y elementos gráficos con alta precisión.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-500/10 mr-4">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Multiidioma</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Soporte completo para japonés, chino, coreano, inglés y español con OCR avanzado.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/10 mr-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Privacidad Total</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Todo el procesamiento se realiza localmente en tu navegador. Tus archivos nunca salen de tu dispositivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeatures;