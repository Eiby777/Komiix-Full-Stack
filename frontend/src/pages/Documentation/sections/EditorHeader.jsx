import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, faChevronRight, faTachometerAlt, faFileArchive, 
  faSave, faUpload, faChevronDown, faTimes, faImage,
  faPercent, faKeyboard, faMousePointer, faCog, faDesktop,
  faLayerGroup, faUndo, faRedo, faFileImport, faFileExport
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const EditorHeader = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faLayerGroup} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Header del Editor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Panel de control principal para navegación y gestión de proyectos
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Funciones del Header del Editor"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial del header del editor (8 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Panel de Control Principal
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El header del editor es el centro de control principal que te permite navegar entre 
                imágenes, gestionar el proyecto y acceder a todas las funciones esenciales. 
                Está diseñado para ser completamente responsivo y adaptarse a diferentes tamaños de pantalla.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                El header se mantiene fijo en la parte superior y se compone de tres secciones principales: 
                navegación de imágenes, barra de progreso y botones de acción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características Principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Características Principales
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Diseño Responsivo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
                             <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Diseño Responsivo</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Se adapta automáticamente al tamaño de la ventana</p>
              <p>• Altura mínima de 46px, máxima de 100px</p>
              <p>• Todos los elementos se escalan proporcionalmente</p>
              <p>• Optimizado para diferentes resoluciones</p>
            </div>
          </div>

          {/* Posición Fija */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faLayerGroup} className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Posición Fija</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Siempre visible en la parte superior</p>
              <p>• No interfiere con el área de trabajo</p>
              <p>• Z-index alto para estar por encima del contenido</p>
              <p>• Margen izquierdo para el sidebar</p>
            </div>
          </div>

          {/* Navegación Intuitiva */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMousePointer} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navegación Intuitiva</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Botones de anterior/siguiente</p>
              <p>• Input para saltar a imagen específica</p>
              <p>• Barra de progreso visual</p>
              <p>• Indicadores de estado</p>
            </div>
          </div>

          {/* Gestión de Proyectos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileArchive} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestión de Proyectos</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Guardar progreso automáticamente</p>
              <p>• Exportar proyecto completo</p>
              <p>• Cargar proyectos existentes</p>
              <p>• Volver al dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Componente ProgressBar */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Barra de Progreso
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-4 mb-6">
                         <FontAwesomeIcon icon={faPercent} className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Navegación de Imágenes</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Funcionalidades</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Botones de Navegación</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Botones anterior/siguiente con iconos de chevron. Se deshabilitan automáticamente 
                      en los extremos de la lista de imágenes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Barra de Progreso</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Muestra el progreso visual del proyecto con porcentaje de completado. 
                      Se actualiza automáticamente al cambiar de imagen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Input de Navegación</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Campo de texto para saltar directamente a una imagen específica. 
                      Valida automáticamente el rango y se actualiza al perder el foco o presionar Enter.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Indicadores de Estado</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Muestra "Image X of Y" y el porcentaje de completado. 
                      Se actualiza en tiempo real durante la navegación.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Características Técnicas</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Escalado Responsivo</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Todos los elementos se escalan proporcionalmente basándose en la altura del header. 
                    Factor de escala mínimo de 0.7 para mantener legibilidad.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Estados de Botones</h5>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Los botones cambian de color y se deshabilitan automáticamente cuando no hay 
                    más imágenes en esa dirección. Transiciones suaves para mejor UX.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Validación de Input</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    El campo de texto valida automáticamente el rango (1 a total de imágenes) 
                    y restaura el valor anterior si es inválido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente ActionButtons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Botones de Acción
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Proyectos</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Botones Principales</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                                     <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                     <FontAwesomeIcon icon={faTachometerAlt} className="w-4 h-4 text-white" />
                   </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Dashboard</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Regresa al panel principal de proyectos. Navega de vuelta al dashboard 
                      manteniendo el estado actual del proyecto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faFileExport} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Exportar</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Descarga el proyecto completo como archivo JSON. Incluye todas las imágenes, 
                      anotaciones, traducciones y configuraciones del proyecto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Guardar</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Guarda el progreso actual en el almacenamiento local. Muestra animación 
                      de carga durante 1 segundo para confirmar la acción.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Menú Desplegable</h4>
              <div className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Botón Cargar</h5>
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Abre el modal de carga para importar proyectos existentes. 
                    Permite cargar archivos JSON exportados previamente.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Diseño Responsivo</h5>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Todos los botones se escalan proporcionalmente con la altura del header. 
                    Mantiene la legibilidad en diferentes tamaños de pantalla.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Estados de Carga</h5>
                  <p className="text-sm text-orange-700 dark:text-orange-200">
                    El botón de guardar muestra "Guardando..." con animación de spinner 
                    durante el proceso de guardado para feedback visual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente LoadModal */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Modal de Carga
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <FontAwesomeIcon icon={faFileImport} className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Importar Proyectos</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Funcionalidades</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Drag & Drop</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Arrastra y suelta archivos JSON directamente en el área designada. 
                      Cambia visualmente cuando un archivo está sobre el área.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Selector de Archivos</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Botón para abrir el explorador de archivos del sistema. 
                      Solo acepta archivos con extensión .json.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Carga Automática</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Una vez seleccionado el archivo, se carga automáticamente en el editor. 
                      El modal se cierra y se restauran todos los datos del proyecto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Cierre Intuitivo</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Se puede cerrar haciendo clic en el botón X, en el fondo oscuro 
                      o presionando la tecla Escape.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Características de Diseño</h4>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Overlay Oscuro</h5>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Fondo semi-transparente con efecto de blur que oscurece el contenido 
                    detrás del modal para enfocar la atención.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Feedback Visual</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    El área de drop cambia de color y estilo cuando se arrastra un archivo 
                    sobre ella, proporcionando feedback visual inmediato.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Z-Index Alto</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    El modal tiene un z-index muy alto (600) para asegurar que aparezca 
                    por encima de todos los demás elementos de la interfaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Técnicas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Características Técnicas
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gestión de Estado */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestión de Estado</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Integración con Zustand store</p>
              <p>• Sincronización automática de imágenes</p>
              <p>• Persistencia en IndexedDB</p>
              <p>• Manejo de estados de carga</p>
            </div>
          </div>

          {/* Responsividad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
                             <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Responsividad</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Escalado proporcional automático</p>
              <p>• Altura mínima garantizada</p>
              <p>• Adaptación a diferentes pantallas</p>
              <p>• Mantenimiento de proporciones</p>
            </div>
          </div>

          {/* Navegación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMousePointer} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navegación</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Navegación por imágenes</p>
              <p>• Saltos directos por número</p>
              <p>• Validación de rangos</p>
              <p>• Feedback visual inmediato</p>
            </div>
          </div>

          {/* Persistencia */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileArchive} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Persistencia</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Guardado automático local</p>
              <p>• Exportación completa</p>
              <p>• Importación de proyectos</p>
              <p>• Backup de datos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consejos de Uso */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Consejos de Uso
        </h2>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Navegación Eficiente
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Usa el input numérico para saltos rápidos</li>
                <li>• Monitorea el progreso con la barra visual</li>
                <li>• Guarda frecuentemente para no perder trabajo</li>
                <li>• Exporta antes de cambios importantes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gestión de Proyectos
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Usa nombres descriptivos al exportar</li>
                <li>• Mantén backups regulares</li>
                <li>• Verifica la carga de proyectos importados</li>
                <li>• Usa el dashboard para organizar proyectos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditorHeader; 