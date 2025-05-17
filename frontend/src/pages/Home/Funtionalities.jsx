import { Image, Edit3, Wand2, FileText, Globe, Sparkles, Code, Zap } from 'lucide-react';

const Funtionalities = () => {
    return (
        <section id="features" className="py-20 bg-white dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4" itemProp="name">Flujo de Trabajo Optimizado</h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto dark:text-gray-300">
                        Diseñado específicamente para el proceso de scanlation con herramientas especializadas en cada etapa
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-500/10 mb-4">
                            <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Original</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Visualización de la imagen original con herramientas de navegación básica
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-green-100 dark:bg-green-500/10 mb-4">
                            <Edit3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Anotación</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Detección automática de globos y texto con herramientas de anotación manual
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-500/10 mb-4">
                            <Wand2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Cleanup</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Herramientas avanzadas para limpieza y redibujo de áreas
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-500/10 mb-4">
                            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Texto</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Inserción y ajuste de texto traducido con soporte multi-idioma
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-500/10 mb-4">
                            <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Salida</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Exportación en múltiples formatos y revisión final
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Detección Automática</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Modelos entrenados específicamente para manga que identifican globos y texto con alta precisión.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <Code className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tecnología Local</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Procesamiento local con Fabric.js para máxima velocidad y privacidad. Solo se usa la nube para sincronización opcional.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Flujo Intuitivo</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Interfaz diseñada por un scanlator para scanlators, eliminando pasos innecesarios.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Funtionalities;
