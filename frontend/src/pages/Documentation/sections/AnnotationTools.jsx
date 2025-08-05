import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSquare as faSquareRegular, faPlus, faSearch, faHandPaper, 
  faEraser, faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCrosshairs, faBrain, faCog, faPalette,
  faLayerGroup, faUndo, faRedo, faTrash
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const AnnotationTools = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faSquareRegular} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Herramientas de Anotación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Guía completa de todas las herramientas de marcado y detección
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Herramientas de Anotación Detalladas"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial detallado de todas las herramientas de anotación (15 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Herramientas Especializadas
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Las herramientas de anotación están diseñadas para maximizar la precisión y eficiencia 
                en el proceso de marcado. Cada herramienta tiene funciones específicas que se complementan 
                entre sí para crear anotaciones perfectas.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Puedes usar las herramientas de forma individual o combinarlas para obtener los mejores 
                resultados. La compatibilidad entre herramientas te permite trabajar de manera fluida 
                y eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Herramienta Anotar - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Anotar
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSquareRegular} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Rectángulos de Anotación</h3>
              <p className="text-gray-600 dark:text-gray-400">Herramienta principal para marcar elementos</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Funcionalidades Principales
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faMousePointer} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Creación por Arrastre</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Haz clic y arrastra para crear rectángulos de cualquier tamaño
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Categorización por Color</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cada tipo de globo tiene un color específico para identificación
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Selección y Edición</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selecciona rectángulos para mover, redimensionar o cambiar tipo
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Historial de Cambios</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deshacer y rehacer acciones con el historial automático
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuraciones Disponibles
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Tipos de Globos</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    5 categorías predefinidas + categoría especial para texto
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Colores Automáticos</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cada tipo tiene un color específico asignado automáticamente
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Bordes y Estilos</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bordes visibles con colores que cambian según el tipo seleccionado
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Panel de Configuración de Anotación"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            alt="Panel de configuración mostrando los tipos de globos disponibles"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Cruz Guía - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Cruz Guía
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Precisión Milimétrica</h3>
              <p className="text-gray-600 dark:text-gray-400">Cruz roja que sigue al cursor</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Características Técnicas
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCrosshairs} className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cruz Roja</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Líneas rojas horizontales y verticales que se cruzan
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faMousePointer} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Seguimiento del Cursor</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      La cruz sigue el movimiento del mouse en tiempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Capa Superior</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se muestra por encima de todos los elementos del canvas
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Sin Configuración</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Funciona automáticamente sin necesidad de ajustes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Casos de Uso
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="font-medium text-red-800 dark:text-red-300 mb-1">Elementos Pequeños</p>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Para marcar textos pequeños o elementos difíciles de ver
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Alineación Perfecta</p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Para crear rectángulos perfectamente alineados
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-300 mb-1">Precisión en Bordes</p>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Para definir exactamente dónde comienza y termina un elemento
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Consejo de Uso
                </p>
                <p className="text-red-700 dark:text-red-200 text-sm">
                  Activa la Cruz Guía antes de comenzar a crear anotaciones. Es especialmente útil 
                  cuando trabajas con imágenes de alta resolución o elementos muy pequeños. 
                  La combinación de Cruz Guía + Herramienta Anotar te dará la máxima precisión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Herramienta Detectar - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Detectar
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detección Automática con IA</h3>
              <p className="text-gray-600 dark:text-gray-400">Modelos YOLOv4 optimizados</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tecnología Utilizada
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faBrain} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">YOLOv4 Tiny</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modelo de detección de objetos optimizado para velocidad
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ONNX Runtime</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ejecución local en el navegador sin necesidad de servidor
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Modelos Fragmentados</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Carga progresiva para optimizar el rendimiento
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Actualizaciones Automáticas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modelos mejorados periódicamente por el equipo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Proceso de Detección
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Carga del Modelo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se cargan los modelos ONNX fragmentados localmente
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Procesamiento de Imagen</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      La imagen se procesa y se envía al modelo de IA
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Detección de Elementos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      El modelo identifica globos, textos y otros elementos
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Creación de Anotaciones</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se crean automáticamente los rectángulos de anotación
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Proceso de Detección Automática"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            alt="Proceso de detección automática mostrando el progreso"
            className="mb-6"
          />

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                  Consejo de Detección
                </p>
                <p className="text-purple-700 dark:text-purple-200 text-sm">
                  La detección automática es muy precisa, pero siempre revisa los resultados. 
                  Puede haber elementos que la IA no detecte o anotaciones que necesiten ajuste. 
                  Usa la detección como punto de partida y refina manualmente según sea necesario.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas Compartidas - Detalladas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramientas Compartidas
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Herramienta Pan */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faHandPaper} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pan (Atrastrar)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Navegación por la imagen</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta esencial para navegar por imágenes grandes o cuando necesitas ver 
              diferentes áreas de la página durante el proceso de anotación.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Cursor cambia a mano</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Arrastra para mover la vista</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Navegación fluida y precisa</span>
              </div>
            </div>
          </div>

          {/* Herramienta Borrador */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faEraser} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Borrador</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Eliminar anotaciones</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Elimina anotaciones incorrectas o innecesarias. Es esencial para mantener 
              la precisión en tu trabajo de anotación.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Haz clic para eliminar</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Solo afecta objetos de anotación</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Acción reversible con Ctrl+Z</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mejores Prácticas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Mejores Prácticas
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Anotación Manual
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa la Cruz Guía para máxima precisión</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Cubre completamente cada elemento</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Selecciona el tipo correcto antes de crear</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa y ajusta las anotaciones después</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Detección Automática
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa siempre los resultados de la IA</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Agrega anotaciones faltantes manualmente</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Corrige anotaciones incorrectas</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa como punto de partida, no como resultado final</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                Consejo General
              </p>
              <p className="text-green-700 dark:text-green-200 text-sm">
                La combinación de detección automática y anotación manual te dará los mejores 
                resultados. Usa la IA para acelerar el proceso inicial, pero siempre revisa 
                y refina manualmente para asegurar la máxima precisión en tu trabajo de scanlation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué Sigue?
        </h2>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que dominas las herramientas de anotación, estás listo para explorar las 
            herramientas de limpieza. Estas te permitirán eliminar el texto original de los 
            globos anotados y preparar la imagen para la traducción.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Explorar Herramientas de Limpieza</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Volver al Área de Anotación</span>
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

export default AnnotationTools; 