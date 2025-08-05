import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowUpFromBracket, faDownload, faFileImage, faCog, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faPalette, faLayerGroup, faExpand,
  faCompress, faImage, faFileAlt, faArchive, faRuler,
  faCrop, faMagic, faEye, faEyeSlash,
  faGear, faShield, faNetworkWired, faFileCode, faArrowsAltH
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const ExportArea = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Área de Exportación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Configurar y exportar tu proyecto terminado
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Área de Exportación - Configuración y Formatos"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo del área de exportación y sus opciones (8 minutos)"
        className="mb-12"
      />

      {/* Propósito del Área de Exportación */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué el Área de Exportación?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El Área de Exportación es la fase final de tu proyecto de scanlation, donde 
                transformas todo tu trabajo en archivos listos para compartir. Esta área te 
                permite configurar múltiples opciones de salida para obtener exactamente 
                el resultado que necesitas.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Desde formatos de imagen hasta configuraciones avanzadas de calidad y 
                dimensiones, la herramienta de exportación te da control total sobre 
                cómo se presenta tu trabajo final.
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
          {/* Herramienta Exportar */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exportar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configuración completa de exportación</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta principal para exportar tu proyecto. Abre un panel modal con 
              todas las opciones de configuración para personalizar la salida.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Panel modal con todas las opciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Configuración de formato y calidad</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Opciones avanzadas de procesamiento</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Pan y navegación</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramientas de navegación que están disponibles en múltiples áreas 
              de trabajo para facilitar el flujo de trabajo.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Pan: Navegar por la imagen</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Zoom: Ajustar vista para revisión</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Selección y navegación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opciones de Exportación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Opciones de Exportación Disponibles
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Configuración Básica
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Modo de Exportación</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Selecciona entre exportar la imagen actual o todas las imágenes del proyecto.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Nombre del Archivo</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Define el nombre base para los archivos exportados.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Formato y Calidad</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Elige entre JPEG, PNG, WEBP y ajusta la calidad de compresión.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Dimensiones</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Configura ancho y alto con opción de mantener relación de aspecto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Configuración Avanzada
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Modo de Imagen</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Selecciona entre color (RGB) o escala de grises.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Metadatos</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Incluye o excluye metadatos EXIF de las imágenes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Entrelazado</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Habilita entrelazado para PNG (progresivo loading).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Redimensionado</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Opción para redimensionar todas las imágenes del proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos de Exportación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Formatos de Exportación
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileImage} className="w-8 h-8 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">JPEG</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Formato de compresión con pérdida, ideal para fotografías y contenido con muchos colores.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Compresión ajustable (0-100%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Tamaño de archivo reducido</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Ideal para web y compartir</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileImage} className="w-8 h-8 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PNG</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Formato sin pérdida con soporte para transparencia, perfecto para gráficos y texto.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Sin pérdida de calidad</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Soporte para transparencia</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Entrelazado opcional</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileImage} className="w-8 h-8 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">WEBP</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Formato moderno de Google con excelente compresión y soporte para transparencia.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Compresión superior</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Soporte para transparencia</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Formato web moderno</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo de Exportación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Flujo de Exportación Recomendado
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Para Imagen Única
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Seleccionar Modo</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Elige "Imagen Actual" en el modo de exportación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Configurar Formato</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Selecciona el formato apropiado y ajusta la calidad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Ajustar Dimensiones</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Define el tamaño final con opción de mantener proporción.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Exportar</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Haz clic en "Exportar" para descargar la imagen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Para Proyecto Completo
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Seleccionar Modo</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Elige "Todas las Imágenes" en el modo de exportación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Configurar Lote</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Define formato, calidad y opciones de redimensionado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Procesar</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      El sistema procesa todas las imágenes automáticamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Descargar</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Descarga el archivo ZIP con todas las imágenes procesadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consejos de Exportación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Consejos para una Exportación Efectiva
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Web y Compartir
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa JPEG con calidad 80-90% para fotos</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>PNG para gráficos con transparencia</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>WEBP para mejor compresión</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén relación de aspecto</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Impresión y Archivo
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>PNG sin pérdida para máxima calidad</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Incluye metadatos para organización</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa dimensiones originales o mayores</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Considera escala de grises para ahorrar tinta</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                Consejo de Exportación
              </p>
              <p className="text-green-700 dark:text-green-200 text-sm">
                Para proyectos de scanlation, considera usar PNG para mantener la máxima 
                calidad del texto y gráficos, especialmente si planeas imprimir o 
                archivar el trabajo. Para compartir en redes sociales, JPEG con 
                calidad 85-90% ofrece un buen balance entre calidad y tamaño de archivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Captura de Pantalla */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Interfaz del Área de Exportación
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Captura: Panel de Exportación del Editor"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          alt="Captura de pantalla del panel de exportación mostrando todas las opciones"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Panel Modal</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interfaz modal con fondo oscuro que contiene todas las opciones de exportación organizadas en secciones.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Opciones Organizadas</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configuraciones agrupadas lógicamente: modo, formato, dimensiones, color y opciones avanzadas.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Botón de Exportación</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Botón principal para iniciar el proceso de exportación con indicador de progreso.
            </p>
          </div>
        </div>
      </section>

      {/* Transición Final */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¡Proyecto Completado!
        </h2>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            ¡Felicitaciones! Has completado todo el flujo de trabajo de Komiix. 
            Desde la carga de imágenes hasta la exportación final, has dominado 
            todas las herramientas necesarias para crear scanlations profesionales.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Ver Herramientas Detalladas</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Explorar Guías Avanzadas</span>
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

export default ExportArea; 