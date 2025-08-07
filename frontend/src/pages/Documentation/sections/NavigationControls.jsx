import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUndo, faRedo, faLayerGroup, faSearch, faCog, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faRuler,faMinus,faPlus, faRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const NavigationControls = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faLayerGroup} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Controles de Navegación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Menús flotantes y controles para optimizar tu flujo de trabajo
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      {/*<ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Controles de Navegación - Menús Flotantes"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo de los controles de navegación y menús flotantes (10 minutos)"
        className="mb-12"
      />

      {/* Propósito de los Controles de Navegación */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué los Controles de Navegación?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Los controles de navegación son menús flotantes estratégicamente posicionados que 
                te permiten acceder rápidamente a funciones esenciales sin interrumpir tu flujo 
                de trabajo. Estos controles optimizan la eficiencia y mantienen tu área de trabajo 
                organizada.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Desde deshacer acciones hasta cambiar entre áreas de trabajo, estos controles 
                flotantes te dan acceso instantáneo a las herramientas más importantes, 
                adaptándose automáticamente al tamaño de tu pantalla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menús Flotantes Disponibles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Menús Flotantes Disponibles
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Menú Undo/Redo */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUndo} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Undo/Redo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Historial de acciones</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Controla el historial de acciones en todas las capas. Deshace y rehace cambios 
              de manera eficiente con botones dedicados.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Deshacer última acción</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Rehacer acción deshecha</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Historial por capa</span>
              </div>
            </div>
          </div>

          {/* Menú de Capas */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faLayerGroup} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Selector de Capas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cambio de área de trabajo</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cambia rápidamente entre las diferentes áreas de trabajo: Original, Anotación, 
              Limpieza, Traducción y Exportación.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>5 áreas de trabajo</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Cambio instantáneo</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Indicador visual</span>
              </div>
            </div>
          </div>

          {/* Controles de Zoom */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Controles de Zoom</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ajuste de vista</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Controla el nivel de zoom de la imagen con precisión. Incluye botones de zoom in/out, 
              slider de control y botón de reset.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Zoom in/out con botones</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Slider de control preciso</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Reset automático</span>
              </div>
            </div>
          </div>

          {/* Botón de Configuración */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Panel de Configuración</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mostrar/ocultar sidebar</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Controla la visibilidad del panel de configuración derecho. Maximiza el espacio 
              de trabajo cuando necesites más área para el canvas.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Toggle del panel derecho</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Más espacio de canvas</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Acceso rápido</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Detalladas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Funcionalidades Detalladas
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Características de Diseño
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Posicionamiento Inteligente</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Los menús se posicionan automáticamente en la esquina superior derecha, 
                    adaptándose al tamaño de la ventana.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Escalado Responsivo</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Los controles se escalan automáticamente según la altura de la pantalla, 
                    manteniendo la usabilidad en diferentes resoluciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Estados Colapsados</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Los menús se pueden colapsar en botones compactos para maximizar 
                    el espacio de trabajo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Transiciones Suaves</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Animaciones fluidas entre estados para una experiencia de usuario 
                    profesional y agradable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Optimizaciones de Rendimiento
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">ResizeObserver</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Monitoreo eficiente de cambios de tamaño para reposicionamiento 
                    automático de controles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Medición Dinámica</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Sistema de medición automática de tamaños para evitar superposiciones 
                    entre menús.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Gestión de Estado</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Estado centralizado para visibilidad y configuración de todos 
                    los menús flotantes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Lazy Loading</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Carga eficiente de componentes solo cuando son necesarios, 
                    optimizando el rendimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menú Undo/Redo Detallado */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUndo} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Menú Undo/Redo</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Control total del historial de acciones</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funcionalidad Principal</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                El menú Undo/Redo te permite controlar el historial de acciones en todas las capas 
                del editor. Cada acción que realizas se registra automáticamente, permitiéndote 
                deshacer y rehacer cambios de manera eficiente.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Deshacer Acción</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Revierte la última acción realizada en la capa activa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faRedo} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Rehacer Acción</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Restaura una acción previamente deshecha
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Historial por Capa</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cada capa mantiene su propio historial independiente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Características Avanzadas</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Estados de Capa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El sistema detecta automáticamente cuando una capa tiene cambios 
                    pendientes y actualiza el estado visual del botón.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Escalado Responsivo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los botones se adaptan automáticamente al tamaño de la pantalla, 
                    manteniendo la usabilidad en diferentes resoluciones.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interfaz Intuitiva</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Iconos claros y tooltips informativos para una experiencia 
                    de usuario óptima.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/floating_menus/undo_redo.webp"
            placeholderText="Captura: Menú Undo/Redo"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla del menú undo/redo"
            className="mb-6"
          />
        </div>
      </section>

      {/* Selector de Capas Detallado */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faLayerGroup} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Selector de Capas</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Navegación entre áreas de trabajo</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Áreas de Trabajo</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                El selector de capas te permite cambiar rápidamente entre las cinco áreas 
                de trabajo del editor, cada una con sus herramientas específicas.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Original</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visualización básica y navegación
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Anotación</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Marcado de globos y detección automática
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Limpieza</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Eliminación de texto original
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traducción</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Agregado de texto traducido
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Exportación</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configuración y exportación final
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funcionalidades</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cambio Instantáneo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transición inmediata entre áreas de trabajo con actualización 
                    automática de herramientas disponibles.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Indicador Visual</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El área activa se resalta visualmente para indicar claramente 
                    en qué área de trabajo te encuentras.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Estado de Capa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El sistema detecta automáticamente si hay cambios pendientes 
                    en cada área y actualiza el estado visual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/floating_menus/layers.webp"
            placeholderText="Captura: Selector de Capas"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla del selector de capas"
            className="mb-6"
          />
        </div>
      </section>

      {/* Controles de Zoom Detallados */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Controles de Zoom</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Control preciso de la vista</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Controles Disponibles</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Los controles de zoom te permiten ajustar la vista de la imagen con precisión, 
                desde vista general hasta detalles finos para trabajo preciso.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Zoom In</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Aumenta el nivel de zoom para ver detalles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faMinus} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Zoom Out</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reduce el nivel de zoom para vista general
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Reset Zoom</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Restaura el zoom al nivel óptimo automático
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faRuler} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Slider de Control</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Control preciso del nivel de zoom con slider
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Características Avanzadas</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Zoom Automático</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El sistema calcula automáticamente el zoom óptimo basado en 
                    el tamaño de la imagen y la ventana.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Límites Inteligentes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Límites mínimo y máximo de zoom adaptados a cada imagen 
                    para evitar problemas de rendimiento.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Indicador de Porcentaje</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Muestra el porcentaje actual de zoom para referencia 
                    precisa durante el trabajo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={false}
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/detailed/floating_menus/zoom.webp"
            placeholderText="Captura: Controles de Zoom"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla de los controles de zoom"
            className="mb-6"
          />
        </div>
      </section>

      {/* Mejores Prácticas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Mejores Prácticas para Controles de Navegación
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Optimización del Flujo de Trabajo
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa Undo/Redo frecuentemente para experimentar sin miedo</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Cambia de capa según la fase de trabajo</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Ajusta el zoom según la precisión necesaria</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Oculta el panel de configuración cuando necesites más espacio</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Consejos de Productividad
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén los menús visibles para acceso rápido</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa atajos de teclado cuando estén disponibles</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Colapsa menús no utilizados para más espacio</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa el estado de las capas regularmente</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">
                Pro Tip: Flujo de Trabajo Optimizado
              </p>
              <p className="text-indigo-700 dark:text-indigo-200 text-sm">
                Los controles de navegación están diseñados para minimizar las interrupciones 
                en tu flujo de trabajo. Usa el selector de capas para cambiar rápidamente 
                entre fases del proyecto, mantén el zoom ajustado para la precisión necesaria, 
                y aprovecha el historial de Undo/Redo para trabajar con confianza.
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
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que dominas los controles de navegación, puedes explorar los Casos de Uso 
            para ver ejemplos prácticos de cómo aplicar todas las herramientas y técnicas 
            que has aprendido en proyectos reales de scanlation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('use-cases')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Casos de Uso</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('editor-header')}
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver al Panel de Control</span>
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

export default NavigationControls; 