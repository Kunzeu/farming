const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function optimizeCSS() {
  console.log('🚀 Iniciando optimización de CSS...\n');
  
  try {
    // Verificar que PurgeCSS esté instalado
    console.log('📦 Verificando dependencias...');
    
    // Crear configuración temporal para PurgeCSS
    const purgeConfig = {
      content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      css: ['./src/app/globals.css'],
      output: './optimized-css/',
      safelist: [
        // Mantener clases dinámicas
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
        // Clases específicas
        'animate-fade-in',
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
    
    // Guardar configuración temporal
    fs.writeFileSync('./purgecss-temp.config.js', `module.exports = ${JSON.stringify(purgeConfig, null, 2)};`);
    
    console.log('📊 Ejecutando PurgeCSS...');
    
    // Crear directorio de salida
    if (!fs.existsSync('./optimized-css')) {
      fs.mkdirSync('./optimized-css', { recursive: true });
    }
    
    // Ejecutar PurgeCSS usando npx
    try {
      execSync('npx purgecss --config ./purgecss-temp.config.js', { stdio: 'inherit' });
      
      // Verificar si se generó el archivo optimizado
      const optimizedFile = './optimized-css/globals.css';
      if (fs.existsSync(optimizedFile)) {
        const originalSize = fs.statSync('./src/app/globals.css').size;
        const optimizedSize = fs.statSync(optimizedFile).size;
        const savings = originalSize - optimizedSize;
        const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
        
        console.log('\n✅ Optimización completada!\n');
        console.log(`📏 Tamaño original: ${(originalSize / 1024).toFixed(2)} KiB`);
        console.log(`📏 Tamaño optimizado: ${(optimizedSize / 1024).toFixed(2)} KiB`);
        console.log(`💾 Ahorro: ${(savings / 1024).toFixed(2)} KiB (${savingsPercent}%)\n`);
        
        // Crear reporte
        const report = {
          timestamp: new Date().toISOString(),
          originalSize: originalSize,
          optimizedSize: optimizedSize,
          savings: savings,
          savingsPercent: parseFloat(savingsPercent),
          config: purgeConfig
        };
        
        fs.writeFileSync('./css-optimization-report.json', JSON.stringify(report, null, 2));
        console.log('📋 Reporte guardado en: css-optimization-report.json');
        console.log('💾 CSS optimizado guardado en: ./optimized-css/globals.css');
        
        return report;
      } else {
        console.log('⚠️ No se generó el archivo optimizado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error ejecutando PurgeCSS:', error.message);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    return null;
  } finally {
    // Limpiar archivo temporal
    if (fs.existsSync('./purgecss-temp.config.js')) {
      fs.unlinkSync('./purgecss-temp.config.js');
    }
  }
}

// Ejecutar optimización
if (require.main === module) {
  optimizeCSS();
}

module.exports = { optimizeCSS };
