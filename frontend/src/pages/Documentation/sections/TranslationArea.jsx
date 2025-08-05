import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFont, faBox, faPen, faSearch, faEye, faSliders, 
  faCheckCircle, faLightbulb, faRocket, faInfoCircle,
  faMousePointer, faCog, faPalette, faLayerGroup, 
  faUndo, faRedo, faTrash, faBrain, faWandMagicSparkles,
  faLanguage, faKeyboard, faMagic, faComments
} from '@fortawesome/free-solid-svg-icons';
import ClickableImage from '../components/ClickableImage';

const TranslationArea = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faFont} className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Área de Traducción
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Agregar texto traducido y configurar su apariencia
          </p>
        </div>
      </div>

      {/* Video Tutorial Placeholder */}
      <ClickableImage
        isPlaceholder={true}
        placeholderText="Video: Área de Traducción - Texto y Configuración"
        placeholderIcon={
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
        alt="Tutorial completo del área de traducción y sus herramientas (12 minutos)"
        className="mb-12"
      />

      {/* Propósito del Área de Traducción */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué el Área de Traducción?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                El Área de Traducción es donde das vida a tu proyecto de scanlation agregando el texto 
                traducido. Esta fase transforma las páginas limpias en contenido completamente traducido 
                y listo para ser compartido.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Las herramientas de traducción te permiten crear texto desde cero, escanear y traducir 
                automáticamente, ajustar la posición del texto en los globos, y configurar la apariencia 
                visual para que se vea profesional y legible.
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
          {/* Herramienta Texto */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faFont} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Texto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crear objetos de texto</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta principal para crear objetos de texto traducido. Permite configurar 
              completamente la apariencia del texto con múltiples opciones de formato.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Arrastra para crear cajas de texto</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Configuración completa de formato</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Fuentes, colores y estilos</span>
              </div>
            </div>
          </div>

          {/* Herramienta Caja de Traducción */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faBox} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Caja de Traducción</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gestionar traducciones</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Panel central para gestionar todos los textos del proyecto. Permite editar, 
              traducir y organizar el contenido de manera eficiente.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Lista de todos los textos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Traducción automática</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Filtros y organización</span>
              </div>
            </div>
          </div>

          {/* Herramienta Dibujar Texto */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPen} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dibujar Texto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detección y OCR</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramienta para detectar y extraer texto de áreas específicas de la imagen. 
              Combina OCR con traducción automática.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Arrastra para seleccionar área</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>OCR automático</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Traducción integrada</span>
              </div>
            </div>
          </div>

          {/* Herramienta Escanear Texto */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Escanear Texto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detección masiva</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Escanea automáticamente todas las imágenes del proyecto para detectar y traducir 
              todo el texto encontrado de una vez.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Procesamiento en lote</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>OCR + Traducción automática</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Configuración de idiomas</span>
              </div>
            </div>
          </div>

          {/* Herramienta Vista Original */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vista Original</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ocultar elementos</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Oculta temporalmente todos los elementos de texto y limpieza para ver la imagen 
              original sin interferencias.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Oculta texto y limpieza</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Vista de imagen original</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Compatible con otras herramientas</span>
              </div>
            </div>
          </div>

          {/* Herramienta Ajustar Texto */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faSliders} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ajustar Texto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posicionamiento automático</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ajusta automáticamente la posición del texto seleccionado dentro de un globo 
              de diálogo anotado previamente.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Ctrl+Click en globo</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Centrado automático</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Compatibilidad con anotaciones</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Pan, Borrador y selección</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Herramientas de navegación y edición que están disponibles en múltiples áreas 
              de trabajo para facilitar el flujo de trabajo.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Pan: Navegar por la imagen</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Borrador: Eliminar objetos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Selección y edición de objetos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo de Trabajo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Flujo de Trabajo Recomendado
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Traducción Manual
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Crear Texto</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Usa la herramienta Texto para crear cajas de texto en los globos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Configurar Apariencia</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Ajusta fuente, tamaño, color y estilo del texto.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ajustar Posición</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Usa Ajustar Texto para centrar en los globos anotados.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Gestionar en Caja de Traducción</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Organiza y edita todos los textos desde el panel central.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Traducción Automática
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Configurar Idiomas</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Selecciona idioma origen y destino en Escanear Texto.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ejecutar Escaneo</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Activa el escaneo automático de todas las imágenes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Revisar Resultados</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Verifica y corrige las traducciones automáticas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Refinar Manualmente</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Ajusta posiciones y estilos según sea necesario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consejos de Traducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Consejos para una Traducción Efectiva
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Traducción Manual
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa fuentes apropiadas para el género</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mantén consistencia en el estilo</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa Ajustar Texto para posicionamiento</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa la legibilidad en diferentes zooms</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Para Traducción Automática
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Verifica la configuración de idiomas</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Revisa siempre las traducciones automáticas</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Usa como punto de partida, no resultado final</span>
              </li>
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Ajusta manualmente el contexto y tono</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <p className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                Consejo de Traducción
              </p>
              <p className="text-purple-700 dark:text-purple-200 text-sm">
                La combinación de traducción automática y manual te dará los mejores resultados. 
                Usa el escaneo automático para acelerar el proceso inicial, pero siempre revisa 
                y refina manualmente para asegurar que el contexto, tono y estilo sean apropiados 
                para el contenido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Captura de Pantalla */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Interfaz del Área de Traducción
        </h2>
        
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Captura: Área de Traducción del Editor"
          placeholderIcon={
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          alt="Captura de pantalla del área de traducción mostrando textos y herramientas activas"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sidebar Izquierdo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Herramientas específicas: Texto, Caja de Traducción, Dibujar Texto, Escanear Texto, Vista Original, Ajustar Texto, Pan y Borrador.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Canvas Central</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Objetos de texto traducido, cajas de texto editables y elementos de posicionamiento.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Panel Derecho</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configuraciones de texto, panel de traducción y opciones de formato según la herramienta activa.
            </p>
          </div>
        </div>
      </section>

      {/* Transición a la Siguiente Área */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Qué Sigue?
        </h2>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Una vez que hayas completado la traducción de todas las páginas, estás listo 
            para la fase final: la exportación. La siguiente área te permitirá configurar 
            y exportar tu proyecto terminado en diferentes formatos.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
              <div className="flex items-center justify-between">
                <span>Continuar a Exportación</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </div>
            </button>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-left">
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

export default TranslationArea; 