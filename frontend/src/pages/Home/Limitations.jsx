import { X, HelpCircle } from 'lucide-react';

const Limitations = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Diseñado para la Comunidad</h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                        Komiix es una herramienta gratuita para scanlators, sostenida por anuncios para apoyar nuestro trabajo.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                                <X className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Proyectos Ilimitados</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Crea tantos proyectos como desees, sin restricciones.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                                <HelpCircle className="text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Gratuito con Anuncios</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Disfruta de Komiix sin costo, respaldado por anuncios no intrusivos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Limitations;