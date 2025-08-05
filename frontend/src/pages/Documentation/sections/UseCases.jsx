import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, faImage, faPalette, faLanguage, faDownload,
  faCheckCircle, faExclamationTriangle, faInfoCircle,
  faLightbulb, faRocket, faCog, faTools, faFileAlt,
  faArrowsAltH, faExpand, faCompress, faMagic, faEye,
  faLayerGroup, faUndo, faRedo, faSearch, faCrop,
  faFileImage, faFileArchive, faNetworkWired, faServer,
  faDesktop, faMobile, faTablet, faLaptop, faGlobe, faUser, faUsers, faSuitcase
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const UseCases = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Casos de Uso
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Escenarios reales y aplicaciones prácticas de Komiix
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Casos de Uso y Aplicaciones Prácticas"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial de casos de uso y aplicaciones prácticas (15 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Casos de Uso de Komiix
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Komiix está diseñado para facilitar el proceso de traducción de manga y manhwa, 
                pero cada tipo de contenido tiene sus propias características y consideraciones. 
                Esta sección te guiará a través de los diferentes escenarios de uso y te ayudará 
                a optimizar tu flujo de trabajo según el tipo de contenido.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Desde proyectos personales hasta trabajos colaborativos, Komiix se adapta a 
                diferentes necesidades y niveles de experiencia, proporcionando herramientas 
                tanto para principiantes como para usuarios avanzados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Contenido */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Tipos de Contenido y Optimizaciones
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Manga */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manga Japonés</h3>
                <p className="text-gray-600 dark:text-gray-400">Contenido optimizado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-2" />
                  Relación de Aspecto Ideal
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  El editor está optimizado para la relación de aspecto típica del manga (aproximadamente 7:10), 
                  proporcionando la mejor experiencia de trabajo.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-2" />
                  Detección Automática Superior
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Los modelos de detección han sido entrenados específicamente con manga, 
                  ofreciendo la máxima precisión en la detección de globos y texto.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-2" />
                  Flujo de Trabajo Optimizado
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Todas las herramientas están diseñadas pensando en las características 
                  específicas del manga japonés.
                </p>
              </div>
            </div>
          </div>

          {/* Manhwa */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manhwa Coreano</h3>
                <p className="text-gray-600 dark:text-gray-400">Compatibilidad con limitaciones</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 mr-2" />
                  Relación de Aspecto Diferente
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Las imágenes de manhwa suelen ser más largas verticalmente. Usa Image Merge 
                  para dividir imágenes largas en secciones manejables.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 mr-2" />
                  Detección Limitada
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Los modelos pueden funcionar por generalización, pero la precisión será menor. 
                  Es posible que necesites más trabajo manual de anotación.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  <FontAwesomeIcon icon={faLightbulb} className="w-4 h-4 mr-2" />
                  Solución Recomendada
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Usa Image Merge para dividir imágenes largas, luego procesa cada sección 
                  por separado en el editor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso Principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Casos de Uso Principales
        </h2>

        <div className="space-y-8">
          {/* Proyecto Personal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Proyecto Personal</h3>
                <p className="text-gray-600 dark:text-gray-400">Traducción individual para aprendizaje o disfrute</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Características</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-1" />
                    <span>Proceso a tu propio ritmo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-1" />
                    <span>Enfoque en calidad sobre velocidad</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-1" />
                    <span>Experimentación con diferentes estilos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-1" />
                    <span>Uso completo de todas las herramientas</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flujo Recomendado</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Anotación manual detallada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Limpieza cuidadosa con herramientas manuales</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Traducción y ajuste manual de texto</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Revisión y refinamiento final</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proyecto Colaborativo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Proyecto Colaborativo</h3>
                <p className="text-gray-600 dark:text-gray-400">Trabajo en equipo con múltiples roles</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roles del Equipo</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Anotador</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se encarga de marcar globos y áreas de texto
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Limpiador</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Elimina el texto original y limpia las imágenes
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Traductor</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Traduce y adapta el texto al idioma objetivo
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Editor</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Revisa y ajusta el trabajo final
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flujo de Trabajo</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Anotación masiva con detección automática</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Limpieza automática y manual</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Traducción masiva con revisión</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Exportación y distribución</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proyecto Comercial */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faSuitcase} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Proyecto Comercial</h3>
                <p className="text-gray-600 dark:text-gray-400">Producción profesional con estándares altos</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Consideraciones</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Calidad de imagen de alta resolución</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Revisión múltiple de traducciones</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Consistencia en fuentes y estilos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Exportación en múltiples formatos</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Herramientas Complementarias</h4>
                <div className="space-y-3">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <p className="text-sm text-orange-700 dark:text-orange-200">
                      <strong>Photoshop/GIMP:</strong> Para redibujos complejos y efectos especiales
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <p className="text-sm text-orange-700 dark:text-orange-200">
                      <strong>InDesign:</strong> Para maquetación y preparación para impresión
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <p className="text-sm text-orange-700 dark:text-orange-200">
                      <strong>Herramientas de QA:</strong> Para revisión de calidad y consistencia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitaciones del Proyecto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Limitaciones y Consideraciones Importantes
        </h2>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Limitaciones Actuales del Proyecto
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Es importante conocer las limitaciones actuales de Komiix para establecer 
                expectativas realistas y planificar el uso de herramientas complementarias 
                cuando sea necesario.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Modelo de Inpainting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMagic} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modelo de Inpainting</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Lo que funciona bien:</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Reconstrucciones pequeñas y medianas</li>
                  <li>• Eliminación de texto simple</li>
                  <li>• Rellenado de áreas con patrones simples</li>
                  <li>• Optimizado para velocidad en navegador</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">⚠️ Limitaciones:</h4>
                <ul className="text-sm text-red-700 dark:text-red-200 space-y-1">
                  <li>• Áreas muy grandes y complejas</li>
                  <li>• Reconstrucción de detalles finos</li>
                  <li>• Patrones complejos o texturas</li>
                  <li>• Elementos arquitectónicos complejos</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Solución:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Para redibujos complejos, usa herramientas especializadas como Photoshop, 
                  GIMP o Krita para el trabajo manual de reconstrucción.
                </p>
              </div>
            </div>
          </div>

          {/* Detección Automática */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detección Automática</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Optimizado para:</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Manga japonés (máxima precisión)</li>
                  <li>• Estilos de globos tradicionales</li>
                  <li>• Texto en japonés</li>
                  <li>• Formatos estándar de manga</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Limitaciones:</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-200 space-y-1">
                  <li>• Manhwa (precisión reducida)</li>
                  <li>• Estilos de globos no tradicionales</li>
                  <li>• Texto en otros idiomas</li>
                  <li>• Formatos experimentales</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Solución:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Para contenido no optimizado, combina detección automática con anotación 
                  manual para mejores resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escenarios Específicos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Escenarios Específicos
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Primer Capítulo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Primer Capítulo de una Serie
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Establece estándares:</strong> Define fuentes, estilos y colores que usarás 
                    consistentemente en toda la serie.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Prueba herramientas:</strong> Experimenta con diferentes configuraciones 
                    para encontrar tu flujo óptimo.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Documenta proceso:</strong> Anota configuraciones exitosas para 
                    referencia futura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Capítulo Complejo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Capítulo con Escenas Complejas
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Identifica áreas problemáticas:</strong> Marca escenas que requerirán 
                    trabajo manual adicional.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Usa herramientas complementarias:</strong> Photoshop para reconstrucciones 
                    complejas, Komiix para el resto.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Mantén consistencia:</strong> Asegúrate de que el trabajo manual 
                    se integre bien con el procesamiento automático.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Proyecto Rápido */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proyecto con Tiempo Limitado
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Prioriza automatización:</strong> Usa detección automática y 
                    limpieza automática al máximo.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Enfócate en lo esencial:</strong> Perfecciona solo las áreas 
                    más visibles o importantes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Usa plantillas:</strong> Reutiliza configuraciones y estilos 
                    de proyectos anteriores.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Proyecto de Calidad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proyecto de Alta Calidad
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Revisión múltiple:</strong> Revisa cada paso del proceso 
                    con atención al detalle.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Herramientas especializadas:</strong> Usa Photoshop para 
                    reconstrucciones complejas y efectos especiales.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Control de calidad:</strong> Implementa un proceso de 
                    revisión y aprobación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pro Tips para Casos de Uso
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Optimización de Flujo
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                    <li>• Usa Image Merge para manhwa largo</li>
                    <li>• Combina detección automática y manual</li>
                    <li>• Establece estándares desde el primer capítulo</li>
                    <li>• Documenta configuraciones exitosas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Herramientas Complementarias
                  </h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
                    <li>• Photoshop para reconstrucciones complejas</li>
                    <li>• GIMP como alternativa gratuita</li>
                    <li>• InDesign para maquetación profesional</li>
                    <li>• Herramientas de QA para revisión</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué Sigue?
        </h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que conoces los casos de uso y aplicaciones prácticas, puedes explorar la 
            sección de Solución de Problemas para aprender cómo resolver los desafíos más 
            comunes que pueden surgir durante el proceso de scanlation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('troubleshooting')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Solución de Problemas</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('navigation-controls')}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver a Controles de Navegación</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UseCases; 