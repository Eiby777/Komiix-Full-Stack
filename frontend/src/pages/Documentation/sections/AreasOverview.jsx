import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWandMagicSparkles, faImage, faSquare as faSquareRegular, 
  faPaintBrush, faFont, faArrowUpFromBracket, faPlay,
  faCheckCircle, faLightbulb, faRocket, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const AreasOverview = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Áreas de Trabajo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            El flujo profesional de scanlation en 5 etapas
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Flujo de Trabajo Completo"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo del flujo de trabajo de scanlation (12 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Flujo Optimizado para Profesionales
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Komiix organiza el proceso de scanlation en 5 áreas de trabajo especializadas, 
                cada una diseñada para una fase específica del proceso. Este flujo optimizado 
                reduce el tiempo de trabajo de horas a minutos, manteniendo la más alta calidad.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Cada área activa automáticamente las herramientas más relevantes para esa fase, 
                guiándote a través del proceso de manera intuitiva y eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Trabajo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Las 5 Áreas de Trabajo
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Área 1: Original */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faImage} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Original</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visualización inicial</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Visualiza la imagen original sin modificaciones. Herramientas básicas de navegación 
              para familiarizarte con el contenido antes de comenzar el trabajo.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Herramienta Pan para navegar</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Vista limpia de la imagen original</span>
              </div>
            </div>
          </div>

          {/* Área 2: Anotación */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSquareRegular} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Anotación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Identificar elementos</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Marca y categoriza globos de texto, diálogos y elementos importantes. 
              Utiliza IA para detección automática o anotación manual precisa.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Anotación manual con rectángulos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Detección automática con IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Categorización de tipos de globos</span>
              </div>
            </div>
          </div>

          {/* Área 3: Limpieza */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPaintBrush} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Limpieza</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Eliminar texto original</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Elimina el texto original de los globos anotados. Herramientas de pintura, 
              clonación y IA para limpieza automática o manual.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Pincel para limpieza manual</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Clonador para rellenar áreas</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Limpieza automática con IA</span>
              </div>
            </div>
          </div>

          {/* Área 4: Traducción */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faFont} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. Traducción</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agregar texto traducido</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Agrega el texto traducido a los globos limpios. Herramientas de texto, 
              OCR automático y gestión de traducciones.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Creación de objetos de texto</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>OCR y traducción automática</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Gestión de fuentes y estilos</span>
              </div>
            </div>
          </div>

          {/* Área 5: Exportación */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 lg:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">5. Exportación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Finalizar y exportar</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Exporta tu trabajo finalizado en múltiples formatos y configuraciones. 
              Control total sobre la calidad y formato de salida.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Múltiples formatos (JPG, PNG, WebP)</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Control de calidad y resolución</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Exportación individual o por lotes</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Metadatos y configuraciones avanzadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo de Trabajo Visual */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Flujo de Trabajo Visual
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Diagrama: Flujo de Trabajo Completo"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          alt="Diagrama visual del flujo de trabajo de scanlation"
          className="mb-8"
        />

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Consejo de Flujo
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                No es necesario seguir las áreas en orden estricto. Puedes saltar entre áreas 
                según tus necesidades. Por ejemplo, puedes hacer anotación y limpieza en paralelo, 
                o volver a la traducción para ajustar textos después de la exportación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navegación entre Áreas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Navegación entre Áreas
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Menú Flotante
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                En el editor, encontrarás un menú flotante que te permite cambiar rápidamente 
                entre las 5 áreas de trabajo. Este menú está siempre visible y accesible.
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Acceso rápido desde cualquier parte del editor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Indicador visual del área activa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Transición suave entre áreas</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Herramientas Dinámicas
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Cada área activa automáticamente las herramientas más relevantes en el sidebar 
                izquierdo, ocultando las que no son necesarias para esa fase del trabajo.
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Sidebar se adapta automáticamente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Herramientas organizadas por relevancia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  <span>Configuraciones específicas por área</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Explora Cada Área
        </h2>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que conoces el flujo general, puedes explorar cada área en detalle. 
            Cada sección incluye explicaciones completas, capturas de pantalla y videos 
            demostrativos de todas las herramientas disponibles.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Explorar Área Original</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
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

export default AreasOverview; 