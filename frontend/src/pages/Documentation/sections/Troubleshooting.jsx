import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, faCheckCircle, faTimes, faInfoCircle,
  faLightbulb, faTools, faCog, faNetworkWired,
  faDownload, faUpload, faSave, faUndo, faRedo, faSearch,
  faEye, faEyeSlash, faLayerGroup, faFont, faPalette,
  faMagic, faBrush, faEraser, faClone, faFileImage,
  faFileArchive, faServer, faGlobe, faWifi,
  faMemory, faHdd, faMicrochip, faDesktop, faMobile, faTablet,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import { DocsContext } from '../DocsContent';

const Troubleshooting = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Solución de Problemas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Resolución de problemas comunes y errores frecuentes
          </p>
        </div>
      </div>

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Guía de Solución de Problemas
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Esta sección te ayudará a resolver los problemas más comunes que pueden 
                surgir durante el uso de Komiix. Los problemas están organizados por 
                categorías para facilitar la búsqueda de soluciones.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Si no encuentras la solución a tu problema aquí, considera revisar la 
                documentación específica de cada herramienta o contactar al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas de Rendimiento */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Problemas de Rendimiento
        </h2>

        <div className="space-y-6">
          {/* Lentitud General */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMicrochip} className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aplicación Lenta</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Síntomas</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Interfaz lenta al responder</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Retrasos en las herramientas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Procesamiento lento de imágenes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Soluciones</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Cierra otras pestañas:</strong> Libera memoria del navegador
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Reduce el número de imágenes:</strong> Procesa en lotes más pequeños
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Actualiza el navegador:</strong> Usa la versión más reciente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problemas de Memoria */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMemory} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error de Memoria</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Síntomas</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Navegador se cierra inesperadamente</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Error "Out of Memory"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Procesamiento falla en imágenes grandes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Soluciones</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Reduce resolución:</strong> Usa imágenes de menor resolución
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Procesa por partes:</strong> Divide proyectos grandes
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      <strong>Reinicia navegador:</strong> Libera memoria acumulada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas de Herramientas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Problemas con Herramientas Específicas
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Detección Automática */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detección Automática</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Problema: No detecta globos</h4>
                <div className="space-y-2 text-sm text-red-700 dark:text-red-200">
                  <p><strong>Causas posibles:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Imagen de baja calidad</li>
                    <li>Globos no tradicionales</li>
                    <li>Contenido no optimizado (manhwa)</li>
                    <li>Modelo no cargado correctamente</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Usa anotación manual como respaldo</li>
                  <li>• Mejora la calidad de la imagen</li>
                  <li>• Recarga la página para reiniciar modelos</li>
                  <li>• Verifica conexión a internet</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Herramientas de Limpieza */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMagic} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Limpieza Automática</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Problema: Resultados pobres</h4>
                <div className="space-y-2 text-sm text-red-700 dark:text-red-200">
                  <p><strong>Causas posibles:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Áreas muy grandes o complejas</li>
                    <li>Fondo complejo o texturado</li>
                    <li>Texto muy pequeño o borroso</li>
                    <li>Modelo de inpainting limitado</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Usa herramientas manuales (pincel, clonador)</li>
                  <li>• Divide áreas grandes en secciones</li>
                  <li>• Usa Photoshop para reconstrucciones complejas</li>
                  <li>• Ajusta configuración del pincel</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Herramientas de Texto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFont} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Herramientas de Texto</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Problema: Texto no se muestra</h4>
                <div className="space-y-2 text-sm text-red-700 dark:text-red-200">
                  <p><strong>Causas posibles:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Fuente no disponible</li>
                    <li>Color igual al fondo</li>
                    <li>Texto fuera del canvas</li>
                    <li>Capa incorrecta seleccionada</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Cambia la fuente por una disponible</li>
                  <li>• Ajusta el color del texto</li>
                  <li>• Verifica la posición en el canvas</li>
                  <li>• Selecciona la capa correcta</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exportación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDownload} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exportación</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Problema: Error al exportar</h4>
                <div className="space-y-2 text-sm text-red-700 dark:text-red-200">
                  <p><strong>Causas posibles:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Espacio insuficiente en disco</li>
                    <li>Imagen muy grande</li>
                    <li>Formato no soportado</li>
                    <li>Problemas de permisos</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Libera espacio en disco</li>
                  <li>• Reduce la resolución de exportación</li>
                  <li>• Usa formato JPEG o PNG</li>
                  <li>• Verifica permisos de descarga</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas de Conexión */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Problemas de Conexión y Servicios
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Problemas de Internet */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faWifi} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Problemas de Internet</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Síntomas</h4>
                <ul className="text-sm text-red-700 dark:text-red-200 space-y-1">
                  <li>• OCR no funciona</li>
                  <li>• Traducción automática falla</li>
                  <li>• Modelos no cargan</li>
                  <li>• Errores de conexión</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Verifica conexión a internet</li>
                  <li>• Recarga la página</li>
                  <li>• Usa herramientas offline disponibles</li>
                  <li>• Contacta soporte si persiste</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Problemas de Autenticación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faServer} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Problemas de Autenticación</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Síntomas</h4>
                <ul className="text-sm text-red-700 dark:text-red-200 space-y-1">
                  <li>• No puedes iniciar sesión</li>
                  <li>• Sesión expirada frecuentemente</li>
                  <li>• Errores de permisos</li>
                  <li>• Datos no se guardan</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Limpia cookies del navegador</li>
                  <li>• Verifica credenciales</li>
                  <li>• Usa modo incógnito</li>
                  <li>• Contacta soporte técnico</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas de Navegador */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Problemas de Navegador
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compatibilidad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compatibilidad</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Navegadores Soportados</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-200 space-y-1">
                  <li>✅ Chrome 90+ (Recomendado)</li>
                  <li>✅ Firefox 88+</li>
                  <li>✅ Edge 90+</li>
                  <li>⚠️ Safari 14+ (Limitado)</li>
                  <li>❌ Internet Explorer (No soportado)</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Recomendaciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Usa Chrome para mejor rendimiento</li>
                  <li>• Mantén el navegador actualizado</li>
                  <li>• Habilita JavaScript</li>
                  <li>• Permite cookies y almacenamiento local</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración del Navegador</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Problemas Comunes</h4>
                <ul className="text-sm text-red-700 dark:text-red-200 space-y-1">
                  <li>• JavaScript deshabilitado</li>
                  <li>• Bloqueadores de anuncios</li>
                  <li>• Modo privado restrictivo</li>
                  <li>• Extensiones conflictivas</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Soluciones</h4>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Habilita JavaScript</li>
                  <li>• Desactiva bloqueadores temporalmente</li>
                  <li>• Usa modo normal en lugar de privado</li>
                  <li>• Desactiva extensiones problemáticas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pasos de Diagnóstico */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Pasos de Diagnóstico General
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Diagnóstico Básico
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Verifica Conexión</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Asegúrate de tener una conexión estable a internet
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Recarga la Página</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Refresca el navegador para reiniciar la aplicación
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Limpia Caché</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Borra datos temporales del navegador
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Prueba Otro Navegador</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Verifica si el problema persiste en diferentes navegadores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Diagnóstico Avanzado
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Verifica Consola</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Revisa errores en las herramientas de desarrollador
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Modo Incógnito</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Prueba sin extensiones ni configuraciones personalizadas
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Verifica Recursos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Monitorea uso de CPU, memoria y red
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Contacta Soporte</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Si el problema persiste, contacta al equipo técnico
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto de Soporte */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Necesitas Ayuda Adicional?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Si no has encontrado la solución a tu problema en esta guía, no dudes en 
                contactar al equipo de soporte técnico. Proporciona la mayor cantidad de 
                información posible para ayudarte de manera más eficiente.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Información Útil para Reportar
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Navegador y versión</li>
                    <li>• Sistema operativo</li>
                    <li>• Pasos para reproducir el error</li>
                    <li>• Capturas de pantalla del problema</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Canales de Soporte
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Email: soporte@komiix.com</li>
                    <li>• Discord: Servidor oficial</li>
                    <li>• GitHub: Issues del proyecto</li>
                    <li>• Documentación: Guías detalladas</li>
                  </ul>
                </div>
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
        
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que conoces cómo resolver los problemas más comunes, puedes explorar el 
            Glosario de Términos para familiarizarte con la terminología técnica y los 
            conceptos específicos utilizados en Komiix y el mundo del scanlation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('glossary')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Glosario de Términos</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('use-cases')}
              className="border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver a Casos de Uso</span>
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

export default Troubleshooting; 