import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, faSearch, faLayerGroup, faFont, faPalette,
  faMagic, faBrush, faEraser, faClone, faDownload,
  faUpload, faSave, faUndo, faRedo, faEye, faEyeSlash,
  faCog, faTools, faDesktop, faNetworkWired, faServer,
  faFileImage, faFileArchive, faGlobe, faLanguage,
  faImage, faCrop, faExpand, faCompress, faRuler,
  faArrowsAltH, faMousePointer, faPlus, faSquare,
  faEdit, faFileAlt, faSliders, faRotateLeft, faTimes,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';
import { DocsContext } from '../DocsContent';

const Glossary = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Glosario de Términos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Definiciones y explicaciones de términos técnicos y conceptos
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Glosario y Términos Técnicos"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial del glosario y términos técnicos (5 minutos)"
        className="mb-12"
      />

      {/* Introducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Glosario de Términos de Komiix
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Este glosario contiene definiciones de términos técnicos, conceptos específicos 
                de Komiix y vocabulario relacionado con el proceso de traducción de manga y manhwa. 
                Los términos están organizados por categorías para facilitar la búsqueda.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Si encuentras un término que no está definido aquí, considera revisar la 
                documentación específica de cada herramienta o contactar al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos Generales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos Generales
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Canvas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Canvas</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              El área de trabajo principal donde se muestra y edita la imagen actual. 
              Es el espacio donde se realizan todas las operaciones de anotación, 
              limpieza y traducción.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Relacionado:</strong> Fabric.js, área de trabajo, imagen activa
              </p>
            </div>
          </div>

          {/* Capa */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faLayerGroup} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Capa (Layer)</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Un nivel de organización en el editor que separa diferentes tipos de elementos. 
              Komiix usa capas para organizar anotaciones, limpieza, texto y la imagen original.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Tipos:</strong> Original, Anotación, Limpieza, Texto
              </p>
            </div>
          </div>

          {/* Proyecto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileArchive} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proyecto</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Una colección de imágenes relacionadas que se procesan juntas. Cada proyecto 
              contiene múltiples páginas de manga o manhwa que se pueden editar y exportar 
              como un conjunto.
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <p className="text-sm text-orange-700 dark:text-orange-200">
                <strong>Características:</strong> Múltiples imágenes, configuración compartida, exportación unificada
              </p>
            </div>
          </div>

          {/* Área de Trabajo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faTools} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Área de Trabajo</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Una fase específica del proceso de traducción con herramientas especializadas. 
              Komiix tiene cinco áreas: Original, Anotación, Limpieza, Traducción y Exportación.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Flujo:</strong> Original → Anotación → Limpieza → Traducción → Exportación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos de Anotación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos de Anotación
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Globo de Texto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSquare} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Globo de Texto</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Un contenedor visual que encierra el diálogo o texto en una imagen. Los globos 
              pueden tener diferentes formas y estilos según el tipo de diálogo (normal, grito, 
              pensamiento, etc.).
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Tipos:</strong> Normal, Grito, Pensamiento, Tocado, Rectángulo
              </p>
            </div>
          </div>

          {/* Anotación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faEdit} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Anotación</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              El proceso de marcar y etiquetar áreas específicas de una imagen, como globos 
              de texto, efectos de sonido o elementos importantes. Las anotaciones guían 
              el proceso de limpieza y traducción.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Herramientas:</strong> Rectángulo, Cruz Guía, Detección Automática
              </p>
            </div>
          </div>

          {/* Detección Automática */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detección Automática</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Proceso que usa inteligencia artificial (modelos ONNX) para identificar 
              automáticamente globos de texto y áreas de diálogo en las imágenes. 
              Optimizado para manga japonés.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Tecnología:</strong> YOLOv4 Tiny, ONNX Runtime, Modelos entrenados
              </p>
            </div>
          </div>

          {/* Cruz Guía */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cruz Guía</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Herramienta de precisión que muestra dos líneas rojas en forma de cruz que 
              siguen el cursor del mouse. Ayuda a alinear y posicionar anotaciones con 
              mayor precisión.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                <strong>Uso:</strong> Alineación precisa, posicionamiento de anotaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos de Limpieza */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos de Limpieza
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Limpieza */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faEraser} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Limpieza</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              El proceso de eliminar el texto original de la imagen para prepararla para 
              la traducción. Incluye técnicas manuales y automáticas para rellenar áreas 
              vacías.
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <p className="text-sm text-orange-700 dark:text-orange-200">
                <strong>Métodos:</strong> Manual, Automática, Inpainting, Clonación
              </p>
            </div>
          </div>

          {/* Inpainting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faMagic} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inpainting</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Técnica de inteligencia artificial que rellena automáticamente áreas seleccionadas 
              de una imagen basándose en el contenido circundante. Usado para eliminar texto 
              y reconstruir fondos.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Limitaciones:</strong> Áreas pequeñas-medianas, fondos simples
              </p>
            </div>
          </div>

          {/* Clonación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faClone} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clonación</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Herramienta que copia una parte de la imagen y la pinta en otra área. Útil 
              para rellenar áreas eliminadas usando texturas y patrones del mismo fondo.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Uso:</strong> Rellenado de fondos, eliminación de elementos
              </p>
            </div>
          </div>

          {/* Pincel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faBrush} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pincel</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Herramienta manual para pintar sobre la imagen. Permite control total sobre 
              el color, tamaño y dureza del trazo. Usado para limpieza manual y retoques.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Configuración:</strong> Tamaño, dureza, color, opacidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos de Traducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos de Traducción
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* OCR */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">OCR</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Reconocimiento Óptico de Caracteres. Tecnología que convierte texto en imágenes 
              a texto editable. Komiix usa OCR para detectar y extraer texto original de 
              los globos de diálogo.
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <p className="text-sm text-indigo-700 dark:text-indigo-200">
                <strong>Proceso:</strong> Detección → Extracción → Conversión a texto
              </p>
            </div>
          </div>

          {/* Texto Objeto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFont} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Texto Objeto</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Un elemento editable en el canvas que contiene texto traducido. Cada objeto 
              de texto puede ser configurado independientemente con diferentes fuentes, 
              tamaños, colores y estilos.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Propiedades:</strong> Fuente, tamaño, color, alineación, estilos
              </p>
            </div>
          </div>

          {/* Caja de Traducción */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSquare} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Caja de Traducción</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Panel central que gestiona todos los textos del proyecto. Permite editar 
              texto original y traducido, aplicar traducción automática y sincronizar 
              estilos entre objetos relacionados.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Funciones:</strong> Gestión centralizada, traducción automática, sincronización
              </p>
            </div>
          </div>

          {/* Traducción Automática */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Traducción Automática</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Proceso que usa servicios de traducción (como LibreTranslate) para convertir 
              automáticamente texto de un idioma a otro. Proporciona múltiples alternativas 
              de traducción.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Servicio:</strong> LibreTranslate, múltiples idiomas, alternativas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos de Exportación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos de Exportación
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Exportación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDownload} className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exportación</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Proceso de guardar el proyecto finalizado en diferentes formatos de imagen. 
              Permite configurar calidad, formato, dimensiones y opciones avanzadas para 
              el archivo de salida.
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <p className="text-sm text-orange-700 dark:text-orange-200">
                <strong>Formatos:</strong> JPEG, PNG, WEBP, múltiples configuraciones
              </p>
            </div>
          </div>

          {/* Backup */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faSave} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backup</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Copia de seguridad del proyecto que incluye todas las imágenes, anotaciones, 
              configuraciones y progreso. Permite restaurar el trabajo en caso de pérdida 
              de datos o para compartir con otros.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Contenido:</strong> Proyecto completo, configuración, progreso
              </p>
            </div>
          </div>

          {/* Metadatos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFileImage} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Metadatos</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Información adicional embebida en el archivo de imagen que incluye detalles 
              sobre el proyecto, herramientas utilizadas, fechas y configuraciones. 
              Útil para seguimiento y organización.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Información:</strong> Proyecto, herramientas, fechas, configuración
              </p>
            </div>
          </div>

          {/* Calidad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faRuler} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calidad</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Parámetro que determina el nivel de compresión y detalle en la imagen exportada. 
              Mayor calidad significa mejor detalle pero archivos más grandes. 
              Ajustable según el uso final.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Rango:</strong> 1-100%, balance entre calidad y tamaño
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Términos Técnicos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Términos Técnicos
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ONNX */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faNetworkWired} className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ONNX</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Open Neural Network Exchange. Formato estándar para modelos de inteligencia 
              artificial que permite ejecutar modelos en diferentes plataformas. Komiix 
              usa modelos ONNX para detección e inpainting.
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <p className="text-sm text-indigo-700 dark:text-indigo-200">
                <strong>Uso:</strong> Modelos de IA, ejecución en navegador, optimización
              </p>
            </div>
          </div>

          {/* Fabric.js */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fabric.js</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Biblioteca JavaScript para crear y manipular objetos en un canvas HTML5. 
              Proporciona herramientas para dibujar, editar y gestionar elementos gráficos 
              de manera interactiva.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-200">
                <strong>Funciones:</strong> Canvas interactivo, objetos gráficos, manipulación
              </p>
            </div>
          </div>

          {/* IndexedDB */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faServer} className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IndexedDB</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Base de datos local del navegador que permite almacenar grandes cantidades 
              de datos estructurados. Komiix usa IndexedDB para guardar proyectos, 
              configuraciones y datos de usuario localmente.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-sm text-purple-700 dark:text-purple-200">
                <strong>Ventajas:</strong> Almacenamiento local, sin conexión, privacidad
              </p>
            </div>
          </div>

          {/* Local-First */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faDesktop} className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Local-First</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Arquitectura de aplicación que prioriza el procesamiento y almacenamiento 
              local sobre servicios en la nube. Komiix procesa el 95% de las operaciones 
              en el navegador del usuario.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Beneficios:</strong> Privacidad, velocidad, trabajo sin conexión
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Búsqueda Rápida */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Búsqueda Rápida de Términos
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Herramientas
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                    <li>• Canvas</li>
                    <li>• Capa</li>
                    <li>• Pincel</li>
                    <li>• Clonación</li>
                    <li>• Inpainting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                    Procesos
                  </h4>
                  <ul className="text-sm text-emerald-700 dark:text-emerald-200 space-y-1">
                    <li>• Anotación</li>
                    <li>• Limpieza</li>
                    <li>• OCR</li>
                    <li>• Traducción</li>
                    <li>• Exportación</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Técnicos
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                    <li>• ONNX</li>
                    <li>• Fabric.js</li>
                    <li>• IndexedDB</li>
                    <li>• Local-First</li>
                    <li>• Metadatos</li>
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
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            ¡Felicidades! Has completado toda la documentación de Komiix. Ahora tienes un 
            conocimiento completo de todas las herramientas, técnicas y conceptos necesarios 
            para crear scanlations profesionales. Puedes volver al inicio para repasar 
            cualquier sección o comenzar tu primer proyecto.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveSection('introduction')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver al Inicio</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => setActiveSection('troubleshooting')}
              className="border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <span>Volver a Solución de Problemas</span>
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

export default Glossary; 