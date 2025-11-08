'use client';

import GoogleAd from './GoogleAd';

// Ejemplo de uso del componente GoogleAd optimizado
export default function AdExample() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Anuncios Optimizados</h2>
      
      {/* Anuncio de banner */}
      <div className="mb-8">
        <h3 className="text-lg text-gray-300 mb-2">Banner Ad</h3>
        <GoogleAd
          adSlot="1234567890"
          adFormat="auto"
          className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center"
        />
      </div>

      {/* Anuncio de sidebar */}
      <div className="mb-8">
        <h3 className="text-lg text-gray-300 mb-2">Sidebar Ad</h3>
        <GoogleAd
          adSlot="0987654321"
          adFormat="rectangle"
          adStyle={{ width: '300px', height: '250px' }}
          className="bg-gray-800 rounded-lg flex items-center justify-center"
        />
      </div>
    </div>
  );
}
