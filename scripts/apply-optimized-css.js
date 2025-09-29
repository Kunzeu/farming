const fs = require('fs');
const path = require('path');

function applyOptimizedCSS() {
  console.log('🚀 Aplicando CSS optimizado al build...\n');
  
  try {
    const optimizedCSSPath = './optimized-css/globals.css';
    const originalCSSPath = './src/app/globals.css';
    
    // Verificar que el CSS optimizado existe
    if (!fs.existsSync(optimizedCSSPath)) {
      console.log('❌ No se encontró el CSS optimizado. Ejecuta primero: npm run optimize:css');
      return false;
    }
    
    // Hacer backup del CSS original
    const backupPath = './src/app/globals.css.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(originalCSSPath, backupPath);
      console.log('💾 Backup del CSS original creado en: globals.css.backup');
    }
    
    // Leer el CSS optimizado
    const optimizedCSS = fs.readFileSync(optimizedCSSPath, 'utf8');
    
    // Reemplazar el CSS original con el optimizado
    fs.writeFileSync(originalCSSPath, optimizedCSS);
    
    console.log('✅ CSS optimizado aplicado exitosamente');
    console.log(`📏 Tamaño del CSS optimizado: ${(optimizedCSS.length / 1024).toFixed(2)} KiB`);
    
    return true;
  } catch (error) {
    console.error('❌ Error aplicando CSS optimizado:', error.message);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  applyOptimizedCSS();
}

module.exports = { applyOptimizedCSS };
