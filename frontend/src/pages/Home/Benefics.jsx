import { Download, Layers, Sliders } from 'lucide-react';

const Benefics = () => {
  return (
    <section className="py-16 bg-blue-50/50 dark:bg-gray-900/30" itemScope itemType="https://schema.org/ItemList" aria-labelledby="beneficios-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="beneficios-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white" itemProp="name">
            ¿Por qué Elegir Komiix para tu Scanlation?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Más de 1,000 scanlators confían en Komiix para acelerar su flujo de trabajo y crear traducciones de calidad profesional
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50" itemScope itemProp="itemListElement" itemType="https://schema.org/Thing">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 mr-4 dark:bg-blue-500/10">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold" itemProp="name">Privacidad Total Garantizada</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3" itemProp="description">
              Tus proyectos de manga y scanlation se almacenan exclusivamente en tu navegador usando IndexedDB. Zero uploads, zero tracking, zero riesgos de filtración.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Almacenamiento local 100% offline</li>
              <li>• No requiere registro de datos personales</li>
              <li>• Compatible con GDPR y regulaciones de privacidad</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50" itemScope itemProp="itemListElement" itemType="https://schema.org/Thing">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/10 mr-4">
                <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white" itemProp="name">Flujo de Trabajo Profesional</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3" itemProp="description">
              Sistema de 5 capas diseñado específicamente para scanlation: Original, Anotación, Cleanup, Texto y Salida. Cada etapa optimizada para máxima eficiencia.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Reduce tiempo de trabajo en 70%</li>
              <li>• Workflow basado en mejores prácticas</li>
              <li>• Compatible con equipos de scanlation</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50" itemScope itemProp="itemListElement" itemType="https://schema.org/Thing">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-500/10 mr-4">
                <Sliders className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white" itemProp="name">IA de Última Generación</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3" itemProp="description">
              Modelos de machine learning entrenados específicamente en manga japonés, manhwa coreano y manhua chino. Actualizaciones constantes para mayor precisión.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• 95% precisión en detección de globos</li>
              <li>• OCR optimizado para tipografías asiáticas</li>
              <li>• Reconocimiento de efectos sonoros</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefics;
