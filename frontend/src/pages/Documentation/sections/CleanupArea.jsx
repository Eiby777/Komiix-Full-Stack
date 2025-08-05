import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush, faEraser, faClone, faMagic, faPen, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCog, faPalette, faLayerGroup, 
  faUndo, faRedo, faTrash, faBrain, faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const CleanupArea = () => {
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
            Área de Limpieza
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Eliminar texto original y preparar para traducción
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Área de Limpieza - Eliminación y Restauración"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo del área de limpieza y sus herramientas (10 minutos)"
        className="mb-12"
      />

      {/* Propósito del Área de Limpieza */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué el Área de Limpieza?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El Área de Limpieza es donde transformas las páginas de manga/manhwa eliminando 
                el texto original para prepararlas para la traducción. Esta fase es crucial para 
                crear una base limpia donde se insertará el nuevo texto traducido.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Las herramientas de limpieza te permiten trabajar con precisión, desde la eliminación 
                manual hasta la limpieza automática basada en las anotaciones creadas anteriormente. 
                El objetivo es mantener la integridad visual mientras se elimina completamente el texto original.
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
          {/* Herramienta Pincel */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPaintBrush} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pincel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pintura manual con configuración</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta fundamental para pintar sobre el texto original. Permite control total 
              sobre el tamaño, color y dureza del pincel para una limpieza precisa.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Tamaño ajustable (1-100px)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Dureza configurable (0-100%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Selector de color personalizado</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Eliminar objetos de limpieza</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Elimina objetos de limpieza incorrectos o innecesarios. Esencial para corregir 
              errores y mantener la precisión en el trabajo de limpieza.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Tamaño ajustable</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Solo afecta objetos de limpieza</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Cursor con indicador visual</span>
              </div>
            </div>
          </div>

          {/* Herramienta Clonador */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faClone} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Clonador</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Copiar y pegar áreas</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Copia áreas limpias de la imagen y las pega sobre el texto original. 
              Perfecto para restaurar fondos y texturas complejas.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Ctrl+Click para copiar área</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Click para pegar en nueva ubicación</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Tamaño de clonación configurable</span>
              </div>
            </div>
          </div>

          {/* Herramienta Auto Limpiar */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faMagic} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Auto Limpiar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Limpieza automática con IA</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Utiliza las anotaciones creadas para limpiar automáticamente el texto original. 
              Proceso inteligente que combina OCR y relleno de color.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Basado en anotaciones previas</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>OCR para detectar texto</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Relleno automático de color</span>
              </div>
            </div>
          </div>

          {/* Herramienta Redibujar */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPen} className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Redibujar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">IA para restauración avanzada</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta avanzada que usa modelos de inpainting para restaurar áreas complejas. 
              Ideal para fondos y texturas difíciles de limpiar manualmente.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Modelos ONNX de inpainting</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Creación de máscaras visuales</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Restauración inteligente de fondos</span>
              </div>
            </div>
          </div>

          {/* Herramientas Compartidas */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faMousePointer} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Herramientas Compartidas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pan y selección</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramientas de navegación y selección que están disponibles en múltiples áreas 
              de trabajo para facilitar el flujo de trabajo.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Pan: Navegar por la imagen</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Selección de objetos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Edición y transformación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estrategias de Limpieza */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Estrategias de Limpieza
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Limpieza Manual
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Configurar Pincel</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Ajusta el tamaño, dureza y color del pincel según el área a limpiar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Pintar sobre Texto</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Usa el pincel para cubrir completamente el texto original.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Usar Clonador</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Para fondos complejos, copia áreas limpias y pégalas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Refinar con Borrador</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Elimina errores y ajusta los bordes según sea necesario.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Limpieza Automática
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Verificar Anotaciones</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Asegúrate de que todas las anotaciones estén correctas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ejecutar Auto Limpiar</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Activa la limpieza automática basada en las anotaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Revisar Resultados</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Verifica que toda la limpieza se haya realizado correctamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Refinar Manualmente</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Completa cualquier área que necesite ajuste manual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consejos de Limpieza */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Consejos para una Limpieza Efectiva
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Limpieza Manual
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa pinceles pequeños para detalles finos</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén la dureza alta para bordes limpios</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa el clonador para fondos complejos</span>
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
                <span>Verifica que las anotaciones sean precisas</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa para páginas con mucho texto</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa siempre los resultados</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Combina con limpieza manual si es necesario</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Consejo de Limpieza
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                La combinación de limpieza automática y manual te dará los mejores resultados. 
                Usa Auto Limpiar para las áreas principales y refina manualmente los detalles 
                y bordes para una limpieza perfecta y profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Captura de Pantalla */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Interfaz del Área de Limpieza
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Captura: Área de Limpieza del Editor"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          alt="Captura de pantalla del área de limpieza mostrando herramientas activas"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sidebar Izquierdo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Herramientas específicas: Pincel, Borrador, Clonador, Auto Limpiar, Redibujar y Pan.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Canvas Central</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Áreas pintadas sobre el texto original, objetos de clonación y máscaras de redibujado.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Panel Derecho</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configuraciones de pincel, clonador y redibujado según la herramienta activa.
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
            Una vez que hayas limpiado completamente el texto original de la página, estás listo 
            para la fase de traducción. La siguiente área te permitirá agregar el texto traducido 
            y configurar su apariencia.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('translation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Continuar a Traducción</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('translation-tools')}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
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

export default CleanupArea; 