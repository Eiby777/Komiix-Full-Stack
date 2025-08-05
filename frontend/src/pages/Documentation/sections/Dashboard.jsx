import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faFolderPlus, faPlay, faTrash, faImages, 
  faObjectGroup, faDownload, faUpload, faCog, faUser,
  faSun, faMoon, faBars, faSignOutAlt, faCheckCircle,
  faExclamationTriangle, faLightbulb, faRocket
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const Dashboard = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faLayerGroup} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Centro de control de tus proyectos de scanlation
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Navegando el Dashboard"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
        alt="Tutorial completo del dashboard y gestión de proyectos (8 minutos)"
        className="mb-12"
      />

      {/* Estructura del Dashboard */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faLayerGroup} className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Estructura del Dashboard
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sidebar Izquierdo
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Navegación principal con acceso a proyectos, ImageMerge y configuración de cuenta.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                • Gestión de proyectos<br/>
                • Herramienta ImageMerge<br/>
                • Configuración de perfil
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Header Superior
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Controles de tema, configuración de perfil y navegación rápida.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-xs">
                • Toggle modo oscuro/claro<br/>
                • Menú de perfil<br/>
                • Cerrar sesión
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faObjectGroup} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Área Principal
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Contenido dinámico que cambia según la sección seleccionada en el sidebar.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-purple-700 dark:text-purple-300 text-xs">
                • Lista de proyectos<br/>
                • Herramienta ImageMerge<br/>
                • Configuraciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gestión de Proyectos */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faFolderPlus} className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Proyectos
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Crear un Nuevo Proyecto
          </h3>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Requisitos del Proyecto
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Nombre Descriptivo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ejemplo: "One Piece Capítulo 119" o "Attack on Titan Cap 45"
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faImages} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Imágenes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mínimo 1, máximo 50 imágenes por proyecto
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-amber-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Límite de Rendimiento</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Evita saturar el navegador durante la edición
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Formatos Soportados
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">JPG/JPEG (recomendado)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">PNG (con transparencia)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">WebP (moderna)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Consejo de Organización
                </p>
                <p className="text-blue-700 dark:text-blue-200 text-sm">
                  Usa nombres descriptivos que incluyan el título del manga, número de capítulo 
                  y versión si es necesario. Esto facilitará encontrar proyectos específicos 
                  cuando tengas muchos en tu biblioteca.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de Proyecto */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Disponibles
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Abrir Editor</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Accede al editor completo con todas las herramientas de scanlation. 
                    El proyecto se carga automáticamente con todas las imágenes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Eliminar Proyecto</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Elimina permanentemente el proyecto y todas sus imágenes del almacenamiento local.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/introduction/proyect_buttons.mp4"
            isPlaceholder={false}
            placeholderText="GIF: Gestión de proyectos"
            placeholderIcon={<FontAwesomeIcon icon={faFolderPlus} className="w-16 h-16 mx-auto" />}
            alt="Demostración de creación y gestión de proyectos"
          />
        </div>
      </section>

      {/* Herramienta ImageMerge */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faObjectGroup} className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Herramienta ImageMerge
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            ¿Por qué ImageMerge?
          </h3>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                El editor de Komiix está optimizado para manejar imágenes con relación de aspecto 
                7:10, que es el estándar para la mayoría de mangas. Sin embargo, los manhwas 
                suelen tener imágenes mucho más largas que no se adaptan bien a esta proporción.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Corta imágenes largas en secciones manejables</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Mantiene la calidad original</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Recortes libres y personalizables</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Funcionalidades
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• <strong>Unión vertical:</strong> Combina múltiples imágenes en una sola</p>
                <p>• <strong>Recortes libres:</strong> Define áreas de corte personalizadas</p>
                <p>• <strong>Descarga múltiple:</strong> Exporta imagen completa o recortes</p>
                <p>• <strong>Vista previa:</strong> Visualiza el resultado antes de procesar</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  Flujo Recomendado para Manhwa
                </p>
                <p className="text-green-700 dark:text-green-200 text-sm">
                  1. Sube las imágenes largas a ImageMerge<br/>
                  2. Realiza los recortes necesarios<br/>
                  3. Descarga las secciones cortadas<br/>
                  4. Crea un nuevo proyecto con las imágenes procesadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header y Configuración */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Header y Configuración
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Controles del Header
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faSun} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Toggle de Tema</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cambia entre modo claro y oscuro
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faBars} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Menú de Perfil</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acceso a configuración de cuenta y cerrar sesión
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Configuración de Perfil
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Cambiar nombre de usuario</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faImages} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Subir imagen de perfil</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Cerrar sesión</span>
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
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que conoces el dashboard, estás listo para explorar las áreas de trabajo 
            del editor. Cada área está diseñada para una fase específica del proceso de scanlation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('areas-overview')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Áreas de Trabajo</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('annotation-tools')}
              className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
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

export default Dashboard; 