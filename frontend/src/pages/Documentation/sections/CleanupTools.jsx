import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush, faEraser, faClone, faMagic, faPen, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCog, faPalette, faLayerGroup, 
  faUndo, faRedo, faTrash, faBrain, faWandMagicSparkles,
  faSliders, faCrosshairs, faCopy, faPaste, faEye,
  faSearch, faDownload, faUpload, faSync
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const CleanupTools = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faPaintBrush} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Herramientas de Limpieza
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Guía completa de todas las herramientas de eliminación y restauración
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      {/*<ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Herramientas de Limpieza Detalladas"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial detallado de todas las herramientas de limpieza (20 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Herramientas de Precisión
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Las herramientas de limpieza están diseñadas para ofrecer control total sobre el proceso 
                de eliminación del texto original. Cada herramienta tiene funciones específicas que se 
                complementan para lograr una limpieza perfecta y profesional.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Desde la pintura manual hasta la restauración inteligente con IA, estas herramientas 
                te permiten trabajar con cualquier tipo de fondo y complejidad, asegurando que el 
                resultado final esté listo para la traducción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Herramienta Pincel - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Pincel
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPaintBrush} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pintura Manual de Precisión</h3>
              <p className="text-gray-600 dark:text-gray-400">Control total sobre el proceso de limpieza</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Funcionalidades Principales
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pintura Libre</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pinta libremente sobre el texto original con trazos suaves
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Configuración Avanzada</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Control total sobre tamaño, dureza y color del pincel
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCrosshairs} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cursor Dinámico</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cursor que se adapta al tamaño y configuración del pincel
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
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Tamaño del Pincel</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rango de 1 a 100 píxeles con control de zoom
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Dureza</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    0% (muy suave) a 100% (bordes duros)
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Color</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selector de color personalizado para cualquier fondo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/limpieza/pincel.webp"
            placeholderText="Captura: Panel de Configuración del Pincel"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            alt="Panel de configuración del pincel mostrando controles de tamaño, dureza y color"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Borrador - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Borrador
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faEraser} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Eliminación Selectiva</h3>
              <p className="text-gray-600 dark:text-gray-400">Corregir errores y ajustar limpieza</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Características Técnicas
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Eliminación Directa</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Elimina objetos de limpieza con un solo clic
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Capa Específica</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Solo afecta objetos de la capa de limpieza
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCrosshairs} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cursor Visual</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cursor con indicador "X" para identificar borrador
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Acción Reversible</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Todas las eliminaciones se pueden deshacer
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
                  <p className="font-medium text-red-800 dark:text-red-300 mb-1">Corrección de Errores</p>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Eliminar áreas pintadas incorrectamente
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Ajuste de Bordes</p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Refinar los bordes de las áreas limpiadas
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-300 mb-1">Limpieza Parcial</p>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Eliminar solo partes específicas de la limpieza
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
                  Usa el borrador para corregir errores rápidamente. Es especialmente útil cuando 
                  trabajas con pinceles grandes y necesitas eliminar solo pequeñas áreas. 
                  El borrador respeta las capas, por lo que solo afecta objetos de limpieza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Herramienta Clonador - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Clonador
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faClone} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Restauración de Fondos</h3>
              <p className="text-gray-600 dark:text-gray-400">Copiar y pegar áreas para restauración</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Funcionalidades Principales
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCopy} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Copiar Área</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ctrl+Click para copiar una sección de la imagen
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPaste} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pegar Área</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click para pegar la área copiada en nueva ubicación
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faEye} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Vista Previa</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cursor muestra la área que se va a clonar
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Tamaño Configurable</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ajusta el tamaño del área de clonación
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Proceso de Clonación
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Seleccionar Herramienta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Activa la herramienta clonador desde el sidebar
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Copiar Área</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mantén Ctrl y haz clic en el área que quieres copiar
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pegar Área</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Haz clic donde quieres pegar la área copiada
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Repetir si es Necesario</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Puedes copiar múltiples áreas según sea necesario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/limpieza/clonador.webp"
            placeholderText="Captura: Proceso de Clonación"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            alt="Proceso de clonación mostrando área copiada y área de destino"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Auto Limpiar - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Auto Limpiar
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faMagic} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Limpieza Automática Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-400">IA basada en anotaciones previas</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tecnología Utilizada
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">OCR Inteligente</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Detecta texto dentro de las anotaciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Relleno de Color</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rellena automáticamente con color apropiado
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Procesamiento por Capas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Respeta la estructura de capas del proyecto
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSync} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Procesamiento en Lote</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Puede procesar una imagen o todas las imágenes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Proceso de Limpieza Automática
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Análisis de Anotaciones</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lee todas las anotaciones creadas en la fase anterior
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Recorte de Áreas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recorta cada área anotada para procesamiento
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Detección de Texto</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      OCR identifica el texto en cada área recortada
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Aplicación de Limpieza</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rellena las áreas de texto con color apropiado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  Consejo de Auto Limpieza
                </p>
                <p className="text-green-700 dark:text-green-200 text-sm">
                  Auto Limpiar funciona mejor cuando las anotaciones son precisas y cubren completamente 
                  el texto. Para mejores resultados, revisa las anotaciones antes de ejecutar la limpieza 
                  automática y refina manualmente cualquier área que necesite ajuste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Herramienta Redibujar - Detallada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Redibujar
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPen} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Restauración con IA</h3>
              <p className="text-gray-600 dark:text-gray-400">Modelos de inpainting para restauración avanzada</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Características Avanzadas
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faBrain} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Modelos ONNX</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modelos de inpainting optimizados para el navegador
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Máscaras Visuales</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Crea máscaras visuales para áreas a restaurar
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Restauración Inteligente</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      IA restaura fondos y texturas complejas
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Configuración Flexible</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ajusta el tamaño del pincel y opciones de procesamiento
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
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">Tamaño del Pincel</p>
                  <p className="text-sm text-orange-700 dark:text-orange-200">
                    Controla el tamaño del área de máscara
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Ámbito de Procesamiento</p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Procesar imagen actual o todas las imágenes
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-300 mb-1">Gestión de Máscaras</p>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Resetear máscaras de imagen actual o todas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/limpieza/redibujo.webp"
            placeholderText="Captura: Proceso de Redibujado con IA"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            alt="Proceso de redibujado mostrando máscaras y restauración con IA"
            className="mb-6"
          />

          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
                  Consejo de Redibujado
                </p>
                <p className="text-orange-700 dark:text-orange-200 text-sm">
                  Redibujar es ideal para fondos complejos y texturas difíciles de limpiar manualmente. 
                  Usa pinceles pequeños para mayor precisión y procesa áreas grandes en secciones 
                  para mejores resultados. La IA funciona mejor con máscaras bien definidas.
                </p>
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
              Para Limpieza Manual
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Comienza con pinceles pequeños para detalles</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa el clonador para fondos complejos</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén alta dureza para bordes limpios</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa en diferentes niveles de zoom</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Limpieza Automática
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Verifica anotaciones antes de ejecutar</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa para páginas con mucho texto</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Combina con limpieza manual para refinar</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa resultados en diferentes zooms</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Consejo General
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                La combinación de todas las herramientas te dará los mejores resultados. Usa Auto Limpiar 
                como base, refina con pincel y clonador, y aplica Redibujar para áreas complejas. 
                Siempre revisa tu trabajo en diferentes niveles de zoom para asegurar calidad profesional.
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
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que dominas las herramientas de limpieza, estás listo para explorar las 
            herramientas de traducción. Estas te permitirán agregar el texto traducido 
            y configurar su apariencia para crear el resultado final.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('translation-tools')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Herramientas de Traducción</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('cleanup')}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver al Área de Limpieza</span>
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

export default CleanupTools; 