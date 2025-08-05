import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSquare as faSquareRegular, faPlus, faSearch, faHandPaper, 
  faEraser, faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCrosshairs, faBrain
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const AnnotationArea = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faSquareRegular} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Área de Anotación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Identificar y categorizar elementos importantes
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Área de Anotación - Marcado y Detección"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo del área de anotación y sus herramientas (8 minutos)"
        className="mb-12"
      />

      {/* Propósito del Área de Anotación */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué el Área de Anotación?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El Área de Anotación es la fase fundamental del proceso de scanlation. Aquí identificas 
                y marcas todos los elementos importantes de la página: globos de diálogo, textos, 
                onomatopeyas y cualquier elemento que requiera traducción o edición.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta fase es crucial porque define qué elementos serán procesados en las siguientes 
                etapas. Una anotación precisa y completa asegura que no se pierda ningún elemento 
                importante durante la limpieza y traducción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas Disponibles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramientas Disponibles
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Herramienta Anotar */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSquareRegular} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Anotar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crear rectángulos de anotación</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Crea rectángulos para marcar globos de diálogo, textos y otros elementos. 
              Cada anotación se categoriza por tipo y color para facilitar el procesamiento posterior.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Arrastra para crear rectángulos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>5 tipos de globos predefinidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Categoría especial para texto</span>
              </div>
            </div>
          </div>

          {/* Herramienta Cruz Guía */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cruz Guía</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Precisión en anotación</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Muestra una cruz roja que sigue al cursor para mayor precisión al crear anotaciones. 
              Especialmente útil para marcar elementos pequeños o alinear rectángulos perfectamente.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Cruz roja que sigue al mouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Precisión milimétrica</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Compatible con herramienta Anotar</span>
              </div>
            </div>
          </div>

          {/* Herramienta Detectar */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detectar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">IA para detección automática</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Utiliza modelos de IA entrenados para detectar automáticamente globos de diálogo 
              y elementos de texto. Ahorra tiempo en anotaciones repetitivas.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Detección automática con YOLOv4</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Modelos ONNX optimizados</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Ejecución local en el navegador</span>
              </div>
            </div>
          </div>

          {/* Herramientas Compartidas */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faMousePointer} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Herramientas Compartidas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pan y Borrador</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Además de las herramientas específicas, el Área de Anotación incluye herramientas 
              de navegación y edición que están disponibles en múltiples áreas de trabajo.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Pan: Navegar por la imagen</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Borrador: Eliminar anotaciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Selección y edición de objetos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Anotación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tipos de Anotación
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Categorías de Globos
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Normal</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Diálogos estándar</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Scream</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gritos y exclamaciones</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Touched</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pensamientos íntimos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Think</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pensamientos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sentence</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Narración</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Text</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Texto independiente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                Consejo de Categorización
              </p>
              <p className="text-green-700 dark:text-green-200 text-sm">
                Usa las categorías correctas para optimizar el procesamiento posterior. Los tipos 
                de globos afectan cómo se aplican las fuentes y estilos en la fase de traducción. 
                La categoría "Text" es especial para elementos que no son globos de diálogo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo de Trabajo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Flujo de Trabajo Recomendado
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Anotación Manual
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Activar Cruz Guía</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Para mayor precisión, activa la cruz guía antes de comenzar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Seleccionar Tipo</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Elige el tipo de globo apropiado en el panel de configuración.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Crear Anotaciones</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Arrastra para crear rectángulos que cubran completamente cada elemento.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ajustar si es Necesario</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Selecciona y ajusta las anotaciones para mayor precisión.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Detección Automática
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Activar Detección</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Haz clic en la herramienta de detección automática.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Esperar Procesamiento</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    El modelo de IA analiza la imagen y detecta elementos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Revisar Resultados</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Verifica que todas las detecciones sean correctas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ajustar Manualmente</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Corrige o agrega anotaciones que la IA pudo haber perdido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Captura de Pantalla */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Interfaz del Área de Anotación
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Captura: Área de Anotación del Editor"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          alt="Captura de pantalla del área de anotación mostrando rectángulos de diferentes colores"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sidebar Izquierdo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Herramientas específicas: Anotar, Cruz Guía, Detectar, Pan y Borrador.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Canvas Central</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rectángulos de anotación con colores según el tipo de globo seleccionado.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Panel Derecho</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selector de tipos de globos con iconos y colores para categorización.
            </p>
          </div>
        </div>
      </section>

      {/* Transición a la Siguiente Área */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué Sigue?
        </h2>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Una vez que hayas anotado todos los elementos importantes de la página, estás listo 
            para proceder con la limpieza. La siguiente área te permitirá eliminar el texto 
            original de los globos anotados.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Continuar a Limpieza</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Ver Herramientas Detalladas</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnotationArea; 