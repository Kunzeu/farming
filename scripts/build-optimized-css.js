const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildOptimizedCSS() {
  console.log('🚀 Construyendo CSS optimizado con Tailwind...\n');
  
  try {
    // Crear directorio de salida
    if (!fs.existsSync('./optimized-css')) {
      fs.mkdirSync('./optimized-css', { recursive: true });
    }
    
    // Crear archivo CSS temporal que incluya solo las clases necesarias
    const tempCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables CSS personalizadas */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

/* Animaciones personalizadas */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
`;
    
    // Guardar archivo temporal
    fs.writeFileSync('./temp-globals.css', tempCSS);
    
    // Crear configuración temporal de Tailwind optimizada
    const optimizedTailwindConfig = {
      content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          colors: {
            background: 'var(--background)',
            foreground: 'var(--foreground)',
          },
        },
      },
      plugins: [],
      // Configuración para optimizar el purging
      future: {
        hoverOnlyWhenSupported: true,
      },
      // Configuración experimental para reducir el tamaño
      experimental: {
        optimizeUniversalDefaults: true,
      },
    };
    
    fs.writeFileSync('./temp-tailwind.config.js', `module.exports = ${JSON.stringify(optimizedTailwindConfig, null, 2)};`);
    
    console.log('📊 Compilando CSS con Tailwind optimizado...');
    
    // Compilar CSS con Tailwind
    const command = `npx tailwindcss -i ./temp-globals.css -o ./optimized-css/globals.css --config ./temp-tailwind.config.js --minify`;
    
    console.log('🔧 Comando:', command);
    console.log('⏳ Ejecutando...\n');
    
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
      
      // Mostrar estadísticas del archivo optimizado
      const optimizedContent = fs.readFileSync(optimizedFile, 'utf8');
      const lineCount = optimizedContent.split('\n').length;
      const charCount = optimizedContent.length;
      
      console.log('📊 Estadísticas del CSS optimizado:');
      console.log(`   Líneas: ${lineCount}`);
      console.log(`   Caracteres: ${charCount.toLocaleString()}`);
      console.log(`   Tamaño: ${(optimizedSize / 1024).toFixed(2)} KiB\n`);
      
      // Crear reporte
      const report = {
        timestamp: new Date().toISOString(),
        originalSize: originalSize,
        optimizedSize: optimizedSize,
        savings: savings,
        savingsPercent: parseFloat(savingsPercent),
        lineCount: lineCount,
        charCount: charCount,
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
  } finally {
    // Limpiar archivos temporales
    if (fs.existsSync('./temp-globals.css')) {
      fs.unlinkSync('./temp-globals.css');
    }
    if (fs.existsSync('./temp-tailwind.config.js')) {
      fs.unlinkSync('./temp-tailwind.config.js');
    }
  }
}

// Ejecutar optimización
if (require.main === module) {
  buildOptimizedCSS();
}

module.exports = { buildOptimizedCSS };
