import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faUserPlus, faFolderPlus, faImages,
  faPlay, faCheckCircle, faExclamationTriangle, faLightbulb,
  faRocket, faDownload, faUpload, faTrash
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const FirstSteps = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
            Primeros Pasos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Tu primera experiencia con Komiix
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Primeros Pasos con Komiix"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial paso a paso para nuevos usuarios (5 minutos)"
        className="mb-12"
      />

      {/* Requisitos del Sistema */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Requisitos del Sistema
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Navegadores Compatibles
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Chrome 90+ (Recomendado)</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Firefox 88+</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Safari 14+</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Edge 90+</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recursos Recomendados
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">RAM: 2GB mínimo, 4GB recomendado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Almacenamiento: 500MB libres para proyectos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Internet: Solo para funciones de IA</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Resolución: 1366x768 mínima</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                Consejo de Rendimiento
              </h4>
              <p className="text-amber-700 dark:text-amber-200 text-sm">
                Para mejor rendimiento, cierra otras pestañas pesadas y asegúrate de tener al menos
                2GB de RAM disponible. Los modelos de IA funcionan mejor en dispositivos con
                hardware de aceleración gráfica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paso 1: Registro y Autenticación */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear una Cuenta
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Registro Rápido con Google
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Komiix utiliza Supabase para la autenticación, ofreciendo un proceso seguro y
              confiable. El registro con Google es instantáneo y no requiere verificación adicional.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Haz clic en "Registrarse"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Encontrarás el botón en la esquina superior derecha
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Autoriza con Google</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Serás redirigido automáticamente después del login
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">¡Listo para empezar!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accederás directamente al dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/introduction/register.mp4"
            isPlaceholder={false}
            placeholderText="GIF: Proceso de registro"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            alt="Animación mostrando el flujo de registro completo"
          />
        </div>
      </section>

      {/* Paso 2: Crear Tu Primer Proyecto */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Tu Primer Proyecto
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Preparando las Imágenes
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Formatos Soportados
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">JPG/JPEG (recomendado)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">PNG (con transparencia)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">WebP (moderna)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Especificaciones Recomendadas
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• <strong>Resolución:</strong> 1000-2000px de ancho</p>
                <p>• <strong>Calidad:</strong> 85-95% para JPG</p>
                <p>• <strong>Tamaño:</strong> Máximo 10MB por imagen</p>
                <p>• <strong>Cantidad:</strong> 1-50 imágenes por proyecto</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Consejo para Manhwa
                </p>
                <p className="text-blue-700 dark:text-blue-200 text-sm">
                  Si trabajas con manhwa (imágenes muy largas), usa primero la herramienta
                  ImageMerge para cortar las páginas en secciones manejables con proporción 7:10.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pasos para Crear el Proyecto
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Nombre del Proyecto</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Usa un nombre descriptivo como "One Piece Capítulo 119" o "Attack on Titan Cap 45"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Subir Imágenes</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Arrastra y suelta las imágenes o haz clic para seleccionarlas. Mínimo 1, máximo 50.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Crear Proyecto</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Haz clic en "Crear Proyecto" y espera a que las imágenes se procesen localmente
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/introduction/create_proyect.mp4"
            isPlaceholder={false}
            placeholderText="GIF: Creación de proyecto"
            placeholderIcon={<FontAwesomeIcon icon={faFolderPlus} className="w-16 h-16 mx-auto" />}
            alt="Demostración completa del proceso de creación"
          />
        </div>
      </section>

      {/* Paso 3: Navegar al Editor */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Acceder al Editor
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Una vez creado tu proyecto, aparecerá en la lista del dashboard. Cada proyecto
              muestra una vista previa de las imágenes subidas en modo collage y herramientas de gestión.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Botón Play:</strong> Abre el editor completo
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Eliminar:</strong> Borra el proyecto permanentemente
                </span>
              </div>
            </div>
          </div>

          <ClickableImage
          src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/introduction/workspace.webp"
            isPlaceholder={false}
            placeholderText="Imagen: Dashboard con proyectos"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            alt="Vista del dashboard mostrando proyectos creados"
          />
        </div>
      </section>

      {/* Familiarización con la Interfaz */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Familiarízate con la Interfaz
        </h2>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sidebar Izquierdo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Contiene todas las herramientas organizadas por área de trabajo. Cambia dinámicamente
              según el área activa.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                5 áreas: Original, Anotación, Limpieza, Traducción, Exportación
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Canvas Central
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Aquí visualizas y editas una imagen a la vez. Utiliza Fabric.js para manipulación
              avanzada de objetos.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-xs">
                Zoom, desplazamiento y edición en tiempo real
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Panel de Configuración
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Sidebar derecho con opciones específicas de cada herramienta. Se oculta automáticamente
              cuando no hay configuraciones.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-purple-700 dark:text-purple-300 text-xs">
                Controles dinámicos y contextuales
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

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            ¡Felicidades! Has completado la configuración inicial. Ahora estás listo para explorar
            las cinco áreas de trabajo que transformarán tus imágenes de manga en traducciones
            profesionales.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar el Dashboard</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button
              onClick={() => setActiveSection('areas-overview')}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Ver Áreas de Trabajo</span>
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

export default FirstSteps;