import { HelpCircle, ChevronRight } from 'lucide-react';

const Faq = () => {
    return (
        <section id="faq" className="py-20 bg-gray-100 dark:bg-gray-900/30" itemScope itemType="https://schema.org/FAQPage">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white">¿Cómo maneja Komiix la privacidad de mis proyectos?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2">
                            <p className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150">
                                Komiix guarda todos tus proyectos e imágenes exclusivamente en tu navegador usando IndexedDB, una tecnología que almacena datos localmente en tu dispositivo. Esto significa que nada se envía a servidores externos ni se sincroniza con la nube, garantizando que tus creaciones permanezcan privadas y bajo tu control total.
                            </p>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white">¿Qué formatos de imagen son compatibles?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2">
                            <p className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150">
                                Komiix soporta los formatos más comunes: JPEG, PNG y WEBP. Para exportación puedes elegir entre PNG (sin pérdida), JPEG (compresión ajustable) y WEBP (baja pérdida).
                            </p>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white">¿Puedo colaborar con otros en un proyecto?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2">
                            <p className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150">
                                Actualmente Komiix está diseñado para trabajo individual. Sin embargo, puedes exportar tu progreso y compartir los archivos manualmente con tu equipo.
                            </p>
                        </div>
                    </details>

                    <details className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-out">
                        <summary className="flex items-center cursor-pointer p-6 list-none focus:outline-none">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 transition-transform duration-300 group-open:rotate-12" />
                            <span className="font-semibold text-lg flex-1 text-gray-900 dark:text-white">¿Qué idiomas soporta el traductor?</span>
                            <ChevronRight className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 group-open:rotate-90" />
                        </summary>
                        <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out max-h-0 group-open:max-h-96 group-open:pt-2">
                            <p className="pl-8 opacity-0 group-open:opacity-100 transition-opacity duration-200 delay-150">
                                El reconocimiento de texto está actualmente disponible en japonés, chino simplificado, coreano e inglés. Mientras más clara sea la imagen, mejor será el resultado.
                            </p>
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
};

export default Faq;
