const Process = () => {
  return (
    <section id="how-it-works" className="py-20 bg-blue-50/30 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Cómo Comenzar</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-500/10">
                <span className="text-blue-600 font-bold dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold mb-2">Crea tu Proyecto</h3>
              <p className="text-gray-600 text-sm dark:text-gray-300">
                Asigna un nombre descriptivo como "One Piece 1045"
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Sube las Imágenes</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Arrastra y suelta las páginas del capítulo
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Detección Automática</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                La IA identificará globos y texto
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Edición y Traducción</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Usa las capas especializadas para cada tarea
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Exporta tu Trabajo</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Guarda en múltiples formatos o comparte
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;