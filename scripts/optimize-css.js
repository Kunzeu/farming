const PurgeCSS = require('@fullhuman/postcss-purgecss');
const fs = require('fs');
const path = require('path');

async function optimizeCSS() {
  console.log('🚀 Iniciando optimización de CSS...\n');
  
  const purgeCSS = new PurgeCSS.default();
  
  const config = {
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    css: ['./src/app/globals.css'],
    safelist: [
      // Mantener clases dinámicas y de animación
      /^animate-/,
      /^fade-/,
      /^slide-/,
      /^scale-/,
      /^rotate-/,
      /^translate-/,
      /^opacity-/,
      /^duration-/,
      /^delay-/,
      /^ease-/,
      // Mantener clases de estado
      /^hover:/,
      /^focus:/,
      /^active:/,
      /^group-hover:/,
      /^group-focus:/,
      // Mantener clases responsive
      /^sm:/,
      /^md:/,
      /^lg:/,
      /^xl:/,
      /^2xl:/,
      // Mantener clases de dark mode
      /^dark:/,
      // Mantener variables CSS
      /^--/,
      // Clases específicas de tu proyecto
      'animate-fade-in',
      'bg-gradient-to-r',
      'bg-gradient-to-l',
      'bg-gradient-to-t',
      'bg-gradient-to-b',
      'bg-gradient-to-tr',
      'bg-gradient-to-tl',
      'bg-gradient-to-br',
      'bg-gradient-to-bl',
      // Mantener clases de Tailwind que podrían ser generadas dinámicamente
      'prose',
      'prose-invert',
      'line-clamp-1',
      'line-clamp-2',
      'line-clamp-3',
    ],
    variables: true,
    keyframes: true,
    fontFace: true,
  };
  
  try {
    console.log('📊 Analizando archivos CSS...');
    const result = await purgeCSS.purge(config);
    
    if (result && result.length > 0) {
      const originalSize = fs.statSync('./src/app/globals.css').size;
      const optimizedCSS = result[0];
      const optimizedSize = Buffer.byteLength(optimizedCSS, 'utf8');
      const savings = originalSize - optimizedSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
      
      console.log('✅ Optimización completada!\n');
      console.log(`📏 Tamaño original: ${(originalSize / 1024).toFixed(2)} KiB`);
      console.log(`📏 Tamaño optimizado: ${(optimizedSize / 1024).toFixed(2)} KiB`);
      console.log(`💾 Ahorro: ${(savings / 1024).toFixed(2)} KiB (${savingsPercent}%)\n`);
      
      // Crear directorio para CSS optimizado
      const outputDir = './optimized-css';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Guardar CSS optimizado
      fs.writeFileSync('./optimized-css/globals-optimized.css', optimizedCSS);
      console.log('💾 CSS optimizado guardado en: ./optimized-css/globals-optimized.css');
      
      // Crear reporte detallado
      const report = {
        timestamp: new Date().toISOString(),
        originalSize: originalSize,
        optimizedSize: optimizedSize,
        savings: savings,
        savingsPercent: parseFloat(savingsPercent),
        config: config
      };
      
      fs.writeFileSync('./css-optimization-report.json', JSON.stringify(report, null, 2));
      console.log('📋 Reporte guardado en: css-optimization-report.json');
      
      return report;
    } else {
      console.log('⚠️ No se pudo optimizar el CSS');
      return null;
    }
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    return null;
  }
}

// Ejecutar optimización
if (require.main === module) {
  optimizeCSS();
}

module.exports = { optimizeCSS };
