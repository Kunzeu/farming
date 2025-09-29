const fs = require('fs');
const path = require('path');

function restoreOriginalCSS() {
  console.log('🔄 Restaurando CSS original...\n');
  
  try {
    const backupPath = './src/app/globals.css.backup';
    const originalCSSPath = './src/app/globals.css';
    
    // Verificar que el backup existe
    if (!fs.existsSync(backupPath)) {
      console.log('❌ No se encontró el backup del CSS original');
      return false;
    }
    
    // Restaurar el CSS original
    fs.copyFileSync(backupPath, originalCSSPath);
    
    console.log('✅ CSS original restaurado exitosamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error restaurando CSS original:', error.message);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  restoreOriginalCSS();
}

module.exports = { restoreOriginalCSS };
