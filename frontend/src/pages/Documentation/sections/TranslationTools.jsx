import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFont, faBox, faPen, faSearch, faEye, faSliders, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCog, faPalette, faLayerGroup, 
  faUndo, faRedo, faTrash, faBrain, faWandMagicSparkles,
  faLanguage, faKeyboard, faMagic, faComments, faTextHeight,
  faAlignLeft, faAlignCenter, faAlignRight, faBold, faItalic,
  faUnderline, faStrikethrough, faEraser, faHandPaper,
  faExpand, faCompress, faCrop, faEyeSlash, faAdjust, faFillDrip
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const TranslationTools = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faFont} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Herramientas de Traducción Detalladas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Guía completa de cada herramienta del área de traducción
          </p>
        </div>
      </div>

      {/* Herramienta Texto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Herramienta Texto
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faFont} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Crear y Configurar Texto</h3>
              <p className="text-gray-600 dark:text-gray-400">Crear y configurar objetos de texto traducido</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funcionalidad Principal</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La herramienta Texto es la base para crear contenido traducido en tu proyecto. 
                Permite crear objetos de texto completamente configurables con múltiples opciones 
                de formato y estilo.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faMousePointer} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Creación de Texto</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Arrastra en el canvas para crear cajas de texto editables
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Configuración Completa</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Panel derecho con todas las opciones de formato disponibles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Capa de Texto</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Los objetos se crean en la capa de texto para organización
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Opciones de Configuración</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FontAwesomeIcon icon={faFont} className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Fuente</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Selección de familia tipográfica
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FontAwesomeIcon icon={faTextHeight} className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Tamaño</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tamaño de fuente ajustable
                  </p>
                </div>
                
                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                   <div className="flex items-center space-x-2 mb-2">
                     <FontAwesomeIcon icon={faFillDrip} className="w-4 h-4 text-purple-500" />
                     <span className="font-semibold text-sm">Color</span>
                   </div>
                   <p className="text-xs text-gray-600 dark:text-gray-400">
                     Color de texto y contorno
                   </p>
                 </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FontAwesomeIcon icon={faAlignLeft} className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Alineación</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Izquierda, centro, derecha
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Configuración de Herramienta Texto"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla mostrando la configuración de la herramienta texto"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Caja de Traducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Caja de Traducción
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBox} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión Centralizada</h3>
              <p className="text-gray-600 dark:text-gray-400">Panel central para gestionar traducciones</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gestión Centralizada</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                El panel de Caja de Traducción es el centro de control para todos los textos 
                del proyecto. Permite editar, traducir y organizar el contenido de manera eficiente.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faComments} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Lista de Textos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vista organizada de todos los objetos de texto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traducción Automática</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Integración con servicios de traducción
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Filtros y Búsqueda</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Encuentra y organiza textos fácilmente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Características Avanzadas</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sincronización de Estilos</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los objetos de texto con la misma anotación se sincronizan automáticamente 
                    en formato (negrita, cursiva, fuente) excepto el tamaño.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Alternativas de Traducción</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hasta 3 opciones de traducción automática para cada texto, 
                    permitiendo elegir la más apropiada.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Configuración de Idiomas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selección de idioma origen y destino para traducción automática.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Panel de Caja de Traducción"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla del panel de caja de traducción"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Dibujar Texto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Dibujar Texto
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPen} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detección y OCR</h3>
              <p className="text-gray-600 dark:text-gray-400">Detección y OCR de áreas específicas</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funcionalidad de OCR</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La herramienta Dibujar Texto combina selección manual con OCR automático 
                para extraer texto de áreas específicas de la imagen.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCrop} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Selección de Área</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Arrastra para seleccionar el área de texto a procesar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faBrain} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">OCR Automático</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reconocimiento óptico de caracteres en tiempo real
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traducción Integrada</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Traducción automática del texto detectado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Configuración</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Idioma de Detección</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selector para especificar el idioma del texto original.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Canvas de Vista Previa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Muestra el área recortada para verificar la selección.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Campo de Resultado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Input para copiar el texto detectado y traducido.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Herramienta Dibujar Texto"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla de la herramienta dibujar texto"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Escanear Texto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Escanear Texto
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detección Masiva</h3>
              <p className="text-gray-600 dark:text-gray-400">Detección masiva y traducción automática</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Procesamiento en Lote</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Escanear Texto procesa automáticamente todas las imágenes del proyecto 
                para detectar y traducir todo el texto encontrado de una vez.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faMagic} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Detección Automática</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Encuentra automáticamente todas las áreas de texto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traducción Masiva</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Traduce todos los textos detectados automáticamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Configuración Flexible</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Opciones para procesar imagen actual o todas las imágenes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Opciones de Configuración</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Alcance de Procesamiento</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecciona entre "Todas las imágenes" o "Imagen actual" para el escaneo.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Idiomas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configuración de idioma origen para OCR y idioma destino para traducción.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Barra de Progreso</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seguimiento del progreso del procesamiento con indicadores visuales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Herramienta Escanear Texto"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla de la herramienta escanear texto"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Vista Original */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Vista Original
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faEye} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visibilidad Temporal</h3>
              <p className="text-gray-600 dark:text-gray-400">Ocultar elementos para ver la imagen original</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funcionalidad de Visibilidad</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La herramienta Vista Original oculta temporalmente todos los elementos 
                de texto y limpieza para permitir ver la imagen original sin interferencias.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faEyeSlash} className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Ocultación Temporal</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Oculta texto y elementos de limpieza automáticamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faExpand} className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Vista Limpia</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Muestra solo la imagen original sin elementos superpuestos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faHandPaper} className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Compatibilidad</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Funciona con otras herramientas sin interferir
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Casos de Uso</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Verificación de Limpieza</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Verifica que la limpieza se haya realizado correctamente.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Referencia Original</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Consulta la imagen original para tomar decisiones de traducción.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comparación</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compara el resultado final con la imagen original.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Herramienta Vista Original"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla de la herramienta vista original"
            className="mb-6"
          />
        </div>
      </section>

      {/* Herramienta Ajustar Texto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Ajustar Texto
        </h2>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSliders} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Posicionamiento Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-400">Posicionamiento automático en globos</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Posicionamiento Inteligente</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                La herramienta Ajustar Texto posiciona automáticamente el texto seleccionado 
                dentro de un globo de diálogo anotado previamente.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faKeyboard} className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Activación</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ctrl+Click en un globo anotado para activar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faAdjust} className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Centrado Automático</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Posiciona el texto centrado en el globo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Compatibilidad</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Funciona con anotaciones de todas las áreas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Proceso de Ajuste</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Selección</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecciona el objeto de texto que quieres ajustar.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Activación</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mantén Ctrl y haz clic en el globo anotado objetivo.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Posicionamiento</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El texto se posiciona automáticamente centrado en el globo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ClickableImage
            isPlaceholder={true}
            placeholderText="Captura: Herramienta Ajustar Texto"
            placeholderIcon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            alt="Captura de pantalla de la herramienta ajustar texto"
            className="mb-6"
          />
        </div>
      </section>

      {/* Mejores Prácticas */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Mejores Prácticas para Herramientas de Traducción
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Flujo de Trabajo Optimizado
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa Escanear Texto para el procesamiento inicial masivo</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Refina manualmente con la herramienta Texto</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Organiza todo desde la Caja de Traducción</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa Ajustar Texto para posicionamiento final</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Consejos Técnicos
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén consistencia en fuentes y estilos</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa siempre las traducciones automáticas</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa Vista Original para verificar resultados</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Guarda progreso regularmente</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <p className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                Pro Tip: Combinación de Herramientas
              </p>
              <p className="text-purple-700 dark:text-purple-200 text-sm">
                La combinación de Escanear Texto para detección masiva, seguida de refinamiento 
                manual con la herramienta Texto y organización en la Caja de Traducción, 
                te dará los mejores resultados en el menor tiempo posible.
              </p>
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
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ahora que dominas todas las herramientas de traducción, puedes explorar el 
            Panel de Control Principal para aprender sobre la navegación entre imágenes, 
            gestión de proyectos y funciones de guardado y exportación.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('editor-header')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Explorar Panel de Control</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('translation')}
              className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver al Área de Traducción</span>
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

export default TranslationTools; 