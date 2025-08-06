import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, faHandPaper, faEye, faCheckCircle, 
  faLightbulb, faRocket, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const OriginalArea = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Área Original
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Visualización inicial y navegación básica
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Área Original - Navegación Básica"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial del área original y herramientas de navegación (3 minutos)"
        className="mb-12"
      />

      {/* Propósito del Área Original */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué el Área Original?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El Área Original es tu punto de partida en el proceso de scanlation. Aquí puedes 
                visualizar la imagen sin ninguna modificación, familiarizarte con el contenido 
                y navegar libremente por la página antes de comenzar el trabajo de edición.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Es especialmente útil para evaluar la calidad de la imagen, identificar áreas 
                problemáticas y planificar tu estrategia de trabajo antes de proceder con la 
                anotación y limpieza.
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

        <div className="w-full">
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
              La herramienta Pan te permite mover la vista de la imagen dentro del canvas. 
              Es esencial para navegar por imágenes grandes o cuando necesitas ver diferentes 
              áreas de la página.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Arrastra para mover la vista</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Cursor cambia a mano</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Navegación fluida y precisa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Casos de Uso del Área Original
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Evaluación Inicial
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Antes de comenzar el trabajo, usa el Área Original para:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Evaluar la calidad de la imagen</li>
              <li>• Identificar áreas problemáticas</li>
              <li>• Contar globos de texto</li>
              <li>• Planificar la estrategia de trabajo</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Referencia Durante el Trabajo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Durante el proceso de scanlation, regresa al Área Original para:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Verificar detalles originales</li>
              <li>• Comparar con tu trabajo</li>
              <li>• Resolver dudas sobre el contenido</li>
              <li>• Asegurar precisión en la traducción</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Consejo de Trabajo
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                Siempre comienza tu trabajo en el Área Original para familiarizarte con la imagen. 
                Toma tu tiempo para identificar todos los elementos que necesitarás trabajar antes 
                de proceder con la anotación. Esto te ahorrará tiempo y mejorará la calidad de tu trabajo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Captura de Pantalla */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Interfaz del Área Original
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Captura: Área Original del Editor"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          alt="Captura de pantalla del área original mostrando la imagen sin modificaciones"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sidebar Izquierdo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Solo muestra la herramienta Pan, manteniendo la interfaz limpia y enfocada.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Canvas Central</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Muestra la imagen original sin ninguna anotación o modificación visible.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Panel Derecho</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sin configuraciones específicas, ya que Pan no requiere ajustes especiales.
            </p>
          </div>
        </div>
      </section>

      {/* Transición a la Siguiente Área */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué Sigue?
        </h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Una vez que te hayas familiarizado con la imagen en el Área Original, estás listo 
            para proceder con la anotación. La siguiente área te permitirá marcar y categorizar 
            todos los elementos importantes de la página.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('annotation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Continuar a Anotación</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('annotation-tools')}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Ver Herramientas de Anotación</span>
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

export default OriginalArea; 