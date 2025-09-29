const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function optimizeCSS() {
  console.log('🚀 Iniciando optimización de CSS...\n');
  
  try {
    console.log('📊 Ejecutando PurgeCSS con argumentos de línea de comandos...');
    
    // Crear directorio de salida
    if (!fs.existsSync('./optimized-css')) {
      fs.mkdirSync('./optimized-css', { recursive: true });
    }
    
    // Construir comando de PurgeCSS
    const contentPaths = [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}'
    ].join(' ');
    
    const safelist = [
      'animate-fade-in',
      'prose',
      'prose-invert',
      'line-clamp-1',
      'line-clamp-2',
      'line-clamp-3',
      'bg-gradient-to-r',
      'bg-gradient-to-l',
      'bg-gradient-to-t',
      'bg-gradient-to-b',
      'bg-gradient-to-tr',
      'bg-gradient-to-tl',
      'bg-gradient-to-br',
      'bg-gradient-to-bl'
    ].join(',');
    
    const command = `npx purgecss --css ./src/app/globals.css --content ${contentPaths} --output ./optimized-css/globals.css --safelist "${safelist}" --variables --keyframes --font-face`;
    
    console.log('🔧 Comando:', command);
    console.log('⏳ Ejecutando...\n');
    
    // Ejecutar PurgeCSS
    execSync(command, { stdio: 'inherit' });
    
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
        command: command
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
    console.error('❌ Error durante la optimización:', error.message);
    return null;
  }
}

// Ejecutar optimización
if (require.main === module) {
  optimizeCSS();
}

module.exports = { optimizeCSS };
