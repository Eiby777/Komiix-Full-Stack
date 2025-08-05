import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faHeart, faGlobe, faCogs, faShieldAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { DocsContext } from '../DocsContent';
import ClickableImage from '../components/ClickableImage';

const Introduction = () => {
  const { setActiveSection } = useContext(DocsContext);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <FontAwesomeIcon icon={faRocket} className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Bienvenido a Komiix
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
              La herramienta definitiva para scanlation profesional
            </p>
          </div>
        </div>
        
        {/* Placeholder para video/gif de introducción */}
        <ClickableImage
          isPlaceholder={true}
          placeholderText="Video de introducción a Komiix"
          placeholderIcon={
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
          className="mb-8"
        />
      </div>

      {/* Historia del Proyecto */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nacido de la Pasión por el Scanlation
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Komiix fue creado por un fan apasionado del manga con años de experiencia en scanlation. 
            Como traductor activo, experimentó de primera mano lo tedioso y laborioso que puede ser 
            traducir manualmente incluso un solo capítulo de manga. Las horas interminables dedicadas 
            a limpiar globos de texto, ajustar tipografías y mantener la calidad visual, mientras se 
            intenta preservar la esencia de la obra original.
          </p>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Tras años de trabajo manual, surgió la visión de crear una herramienta que revolucionara 
            el proceso de scanlation. No solo para facilitar el trabajo individual, sino para elevar 
            la calidad y eficiencia de toda la comunidad de traductores de manga y manhwa. Así nació 
            Komiix: una plataforma completa, profesional y completamente gratuita.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Nuestra Misión</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Democratizar las herramientas profesionales de scanlation, reduciendo el tiempo de 
              trabajo de horas a minutos, mientras mantenemos la más alta calidad y respetamos 
              el arte original de los mangakas.
            </p>
          </div>
        </div>
      </section>

      {/* ¿Qué es Komiix? */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faCogs} className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ¿Qué es Komiix?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Komiix es una plataforma web fullstack diseñada específicamente para proporcionar 
              herramientas profesionales de traducción y edición de manga y manhwa. Nuestra 
              aplicación integra tecnologías de inteligencia artificial de vanguardia con una 
              interfaz intuitiva y potente.
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              La plataforma está optimizada para funcionar completamente en tu navegador, 
              manteniendo tus proyectos privados y seguros en tu dispositivo local, mientras 
              aprovecha servicios en la nube solo cuando es absolutamente necesario para tareas 
              computacionalmente intensivas como OCR y traducción automática.
            </p>
          </div>

          <ClickableImage
            src="https://nipcrtpffrxguklitppt.supabase.co/storage/v1/object/public/documentation/introduction/workspace.webp"
            isPlaceholder={false}
            placeholderText="Imagen/GIF del workspace principal"
            placeholderIcon={
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            alt="Vista general del editor con las 5 áreas de trabajo"
          />
        </div>
      </section>

      {/* Características Principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Características Principales
        </h2>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Completamente Local
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Tus proyectos se almacenan y procesan localmente en tu navegador usando IndexedDB. 
              Sin subidas innecesarias, sin riesgos de privacidad.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Procesamiento offline</li>
              <li>• Sin límites de almacenamiento del servidor</li>
              <li>• Control total de tus datos</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faCogs} className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                IA Integrada
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Modelos ONNX optimizados para detección automática de globos de texto, 
              limpieza con inpainting y OCR multiidioma.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Detección automática YOLOv4</li>
              <li>• Limpieza por inpainting</li>
              <li>• OCR con múltiples idiomas</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faUsers} className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Flujo Profesional
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cinco áreas de trabajo especializadas que guían tu proceso desde la imagen 
              original hasta la exportación final.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Workflow optimizado</li>
              <li>• Herramientas especializadas</li>
              <li>• Control granular</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tecnologías Utilizadas */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tecnologías y Arquitectura
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Frontend y Procesamiento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Fabric.js:</strong> Manipulación avanzada de canvas y objetos gráficos
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>IndexedDB:</strong> Base de datos local para almacenamiento offline
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>ONNX Runtime:</strong> Modelos de IA ejecutados en el navegador
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>React:</strong> Interfaz de usuario moderna y reactiva
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Backend y Servicios
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Supabase:</strong> Autenticación de usuarios y gestión de sesiones
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>FastAPI:</strong> Servicio de los modelos de IA, Endpoints para OCR y traducción automática
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>LibreTranslate:</strong> Servicio de traducción autoalojado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
            Filosofía de Arquitectura: Local-First
          </h4>
          <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
            Komiix sigue una filosofía "local-first", donde el 95% del procesamiento ocurre en tu 
            navegador. Solo utilizamos servicios remotos para tareas específicas como OCR avanzado 
            y traducción automática, que requieren modelos demasiado grandes para ejecutar localmente 
            de manera eficiente. Esto garantiza privacidad, velocidad y control total sobre tus proyectos.
          </p>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comienza tu Viaje con Komiix
        </h2>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Esta documentación te guiará paso a paso desde la creación de tu primer proyecto 
            hasta la exportación de manga traducido de calidad profesional. Cada sección incluye 
            explicaciones detalladas, capturas de pantalla y videos demostrativos.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveSection('first-steps')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Continuar a Primeros Pasos →
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Ver Casos de Uso
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Introduction;