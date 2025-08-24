const Process = () => {
  return (
    <section id="how-it-works" className="py-20 bg-blue-50/30 dark:bg-gray-900/30" itemScope itemType="https://schema.org/HowTo">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white" itemProp="name">
            Cómo Comenzar tu Scanlation en 5 Pasos
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto" itemProp="description">
            Proceso optimizado para scanlators: desde la imagen RAW hasta la traducción final en menos de 30 minutos
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-green-700 dark:text-green-300 font-semibold">⏱️ Tiempo promedio: 25 minutos por capítulo</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50 text-center" itemScope itemProp="step" itemType="https://schema.org/HowToStep">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-500/10">
                <span className="text-blue-600 font-bold dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold mb-2" itemProp="name">Crea tu Proyecto de Scanlation</h3>
              <p className="text-gray-600 text-sm dark:text-gray-300 mb-2" itemProp="text">
                Inicia un nuevo proyecto con nombre descriptivo como "One Piece Cap 1045" o "Attack on Titan 139"
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">⏱️ 30 segundos</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center" itemScope itemProp="step" itemType="https://schema.org/HowToStep">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white" itemProp="name">Sube las Páginas RAW</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2" itemProp="text">
                Arrastra y suelta las imágenes originales. Soporta JPG, PNG y WEBP hasta 50MB por imagen
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">⏱️ 2 minutos</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center" itemScope itemProp="step" itemType="https://schema.org/HowToStep">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white" itemProp="name">Detección Automática con IA</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2" itemProp="text">
                Nuestra IA identifica globos, texto japonés/chino/coreano y efectos sonoros automáticamente
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">⏱️ 5 minutos</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center" itemScope itemProp="step" itemType="https://schema.org/HowToStep">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white" itemProp="name">Cleanup y Traducción</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2" itemProp="text">
                Limpia el texto original, redibuja áreas y añade tu traducción con fuentes personalizables
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">⏱️ 15 minutos</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 text-center" itemScope itemProp="step" itemType="https://schema.org/HowToStep">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white" itemProp="name">Exporta en Calidad HD</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2" itemProp="text">
                Descarga en PNG sin pérdida, JPEG optimizado o WEBP. Compatible con lectores de manga
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">⏱️ 2 minutos</span>
            </div>
          </div>
          
          {/* Additional SEO content */}
          <div className="mt-16 bg-white dark:bg-gray-800/30 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Casos de Uso Populares para Komiix
              </h3>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Descubre cómo diferentes tipos de scanlators utilizan Komiix para optimizar su trabajo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📚 Manga Shonen</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Perfecto para series como One Piece, Naruto, Dragon Ball. Detección optimizada para efectos de acción y onomatopeyas.
                </p>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  Precisión: 96%
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">💕 Manga Shoujo/Romance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Ideal para series románticas con globos decorativos y tipografías elegantes. Reconoce burbujas de pensamiento complejas.
                </p>
                <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                  Especializado
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🇰🇷 Manhwa Coreano</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Optimizado para webtoons verticales y manhwa tradicional. Reconoce hangul y layout vertical perfectamente.
                </p>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  Webtoon Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;