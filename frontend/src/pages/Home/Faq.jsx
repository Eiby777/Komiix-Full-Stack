import { HelpCircle, ChevronRight } from 'lucide-react';

const Faq = () => {
    return (
        <section id="faq" className="py-20 bg-gray-100 dark:bg-gray-900/30" itemScope itemType="https://schema.org/FAQPage">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white" itemProp="name">¿Cómo maneja Komiix la privacidad de mis proyectos?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <div className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150" itemProp="text">
                                <p className="mb-3">
                                    Komiix utiliza IndexedDB, una base de datos local del navegador, para almacenar todos tus proyectos, imágenes originales, traducciones y configuraciones exclusivamente en tu dispositivo. Esta tecnología avanzada permite manejar archivos de gran tamaño sin limitaciones de almacenamiento típicas de cookies o localStorage.
                                </p>
                                <p className="mb-2">
                                    <strong>Ventajas de privacidad:</strong>
                                </p>
                                <ul className="text-sm space-y-1 ml-4">
                                    <li>• Zero uploads - Nada se envía a servidores externos</li>
                                    <li>• Sin tracking ni analíticas de comportamiento</li>
                                    <li>• Cumple con GDPR, CCPA y normativas internacionales</li>
                                    <li>• Tus datos se eliminan al limpiar el navegador (si así lo deseas)</li>
                                </ul>
                            </div>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white" itemProp="name">¿Qué formatos de imagen son compatibles?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <div className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150" itemProp="text">
                                <p className="mb-3">
                                    Komiix está optimizado para trabajar con los formatos de imagen más utilizados en scanlation, soportando archivos de hasta 50MB por imagen y resoluciones de hasta 8K.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold mb-2">📥 Importación:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• <strong>JPEG:</strong> Ideal para RAWs escaneados</li>
                                            <li>• <strong>PNG:</strong> Perfecto para imágenes limpias</li>
                                            <li>• <strong>WEBP:</strong> Balance entre calidad y tamaño</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-2">📤 Exportación:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• <strong>PNG:</strong> Sin pérdida, máxima calidad</li>
                                            <li>• <strong>JPEG:</strong> Compresión personalizable (1-100%)</li>
                                            <li>• <strong>WEBP:</strong> 30% menor tamaño que JPEG</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white" itemProp="name">¿Puedo colaborar con otros en un proyecto?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <div className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150" itemProp="text">
                                <p className="mb-3">
                                    Komiix v1.5 está optimizado para flujos de trabajo individuales, pero ofrece varias opciones para equipos de scanlation:
                                </p>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-semibold mb-1">🔄 Colaboración Actual:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• Exporta proyectos completos en formato .komiix</li>
                                            <li>• Comparte configuraciones de detección personalizadas</li>
                                            <li>• Exporta capas individuales para revisión</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">🚀 Próximas Funciones:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• Sincronización en tiempo real (v2.0)</li>
                                            <li>• Comentarios y revisiones colaborativas</li>
                                            <li>• Roles de equipo (traductor, editor, QC)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white" itemProp="name">¿Qué idiomas soporta el traductor?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <div className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150" itemProp="text">
                                <p className="mb-3">
                                    Nuestro sistema OCR está entrenado específicamente para reconocer texto en contextos de manga y cómic, con modelos optimizados para cada idioma:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold mb-2">🎯 Idiomas Principales:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• <strong>🇯🇵 Japonés:</strong> Hiragana, Katakana, Kanji (98% precisión)</li>
                                            <li>• <strong>🇨🇳 Chino:</strong> Simplificado y Tradicional (96% precisión)</li>
                                            <li>• <strong>🇰🇷 Coreano:</strong> Hangul completo (97% precisión)</li>
                                            <li>• <strong>🇺🇸 Inglés:</strong> Todas las tipografías (99% precisión)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-2">⚡ Características Avanzadas:</p>
                                        <ul className="space-y-1 ml-4">
                                            <li>• Reconoce texto vertical y horizontal</li>
                                            <li>• Detecta efectos sonoros (onomatopeyas)</li>
                                            <li>• Funciona con tipografías decorativas</li>
                                            <li>• Optimizado para texto pequeño y borroso</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    💡 <strong>Tip:</strong> Para mejores resultados, usa imágenes de al menos 300 DPI y asegúrate de que el texto tenga buen contraste con el fondo.
                                </p>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
};

export default Faq;