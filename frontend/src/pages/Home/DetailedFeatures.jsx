import { Brain, Shield, Zap, Globe, Users, Cpu, FileText, ImageIcon, Sparkles } from 'lucide-react';

const DetailedFeatures = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50" itemScope itemType="https://schema.org/ItemList">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white" itemProp="name">
            Tecnología Avanzada para Scanlation Profesional
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Komiix utiliza las últimas innovaciones en inteligencia artificial y procesamiento de imágenes para revolucionar 
            el mundo de la scanlation. Descubre por qué más de 2,500 scanlators en todo el mundo confían en nuestra plataforma.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-blue-700 dark:text-blue-300 font-semibold">
              🚀 Utilizada por grupos de scanlation en 45+ países
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* IA y Machine Learning */}
          <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50" 
               itemScope itemProp="itemListElement" itemType="https://schema.org/Thing">
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-500/10 mr-4">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" itemProp="name">
                Inteligencia Artificial Especializada
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed" itemProp="description">
              Nuestros modelos de IA están entrenados específicamente en más de 100,000 páginas de manga, manhwa y manhua. 
              Utilizamos redes neuronales convolucionales (CNN) avanzadas para detectar globos de diálogo, texto y efectos 
              sonoros con una precisión superior al 95%.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><strong>OCR Multiidioma:</strong> Japonés, Chino, Coreano, Inglés con 98% precisión</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><strong>Detección de Globos:</strong> Reconoce 15+ tipos diferentes de burbujas</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><strong>Efectos Sonoros:</strong> Identifica onomatopeyas y texto decorativo</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><strong>Actualización Continua:</strong> Modelos mejorados mensualmente</span>
              </div>
            </div>
          </div>

          {/* Seguridad y Privacidad */}
          <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50"
               itemScope itemProp="itemListElement" itemType="https://schema.org/Thing">
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-500/10 mr-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" itemProp="name">
                Privacidad y Seguridad Garantizada
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed" itemProp="description">
              Tu privacidad es nuestra prioridad. Komiix funciona completamente offline usando tecnologías web modernas 
              como IndexedDB y Web Workers. Tus proyectos, imágenes y traducciones nunca abandonan tu dispositivo, 
              cumpliendo con GDPR y las regulaciones de privacidad más estrictas.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span><strong>100% Local:</strong> Procesamiento exclusivamente en tu navegador</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span><strong>Sin Tracking:</strong> No recopilamos datos personales ni de uso</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span><strong>Encriptación:</strong> Datos cifrados localmente con AES-256</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span><strong>GDPR Compliant:</strong> Cumple normativas europeas de privacidad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Características Técnicas Detalladas */}
        <div className="bg-white dark:bg-gray-800/30 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Especificaciones Técnicas y Compatibilidad
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-500/10 mx-auto mb-4 w-fit">
                <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rendimiento</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• WebGL acelerado</li>
                <li>• Multi-threading</li>
                <li>• Procesamiento en lotes</li>
                <li>• Cache inteligente</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-500/10 mx-auto mb-4 w-fit">
                <ImageIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Formatos</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• JPEG, PNG, WEBP</li>
                <li>• Hasta 50MB por imagen</li>
                <li>• Resoluciones hasta 8K</li>
                <li>• Preservación de metadatos</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-full bg-teal-100 dark:bg-teal-500/10 mx-auto mb-4 w-fit">
                <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Navegadores</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Chrome 90+</li>
                <li>• Firefox 88+</li>
                <li>• Safari 14+</li>
                <li>• Edge 90+</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-500/10 mx-auto mb-4 w-fit">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Colaboración</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Exportación de proyectos</li>
                <li>• Plantillas compartibles</li>
                <li>• Configuración de equipo</li>
                <li>• Workflow personalizable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparación con Herramientas Tradicionales */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800/50">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            ¿Por qué Migrar de Photoshop/GIMP a Komiix?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-500/10 mx-auto mb-4 w-fit">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Herramientas Tradicionales</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li>❌ Proceso manual de 2-3 horas por capítulo</li>
                <li>❌ Requiere experiencia en diseño gráfico</li>
                <li>❌ Detección manual de globos y texto</li>
                <li>❌ Sin funciones específicas para manga</li>
                <li>❌ Licencias costosas ($20-50/mes)</li>
                <li>❌ Configuración compleja</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-500/10 mx-auto mb-4 w-fit">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Komiix</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li>✅ Proceso automatizado de 20-30 minutos</li>
                <li>✅ Interfaz intuitiva para principiantes</li>
                <li>✅ IA detecta automáticamente elementos</li>
                <li>✅ Herramientas especializadas para scanlation</li>
                <li>✅ Completamente gratuito</li>
                <li>✅ Listo para usar en segundos</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-500/10 mx-auto mb-4 w-fit">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resultado</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                <li>📈 70% reducción en tiempo de trabajo</li>
                <li>🎯 95% menos errores de detección</li>
                <li>💰 Ahorro de $240-600 anuales</li>
                <li>🚀 10x más rápido para principiantes</li>
                <li>🔄 Workflow estandarizado</li>
                <li>📱 Accesible desde cualquier dispositivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeatures;
