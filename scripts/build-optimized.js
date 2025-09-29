const { execSync } = require('child_process');
const fs = require('fs');

function buildOptimized() {
  console.log('🚀 Iniciando build optimizado...\n');
  
  try {
    // Paso 1: Optimizar CSS
    console.log('📊 Paso 1: Optimizando CSS...');
    execSync('npm run optimize:css', { stdio: 'inherit' });
    
    // Paso 2: Aplicar CSS optimizado
    console.log('\n📊 Paso 2: Aplicando CSS optimizado...');
    execSync('npm run apply:css', { stdio: 'inherit' });
    
    // Paso 3: Build de producción
    console.log('\n📊 Paso 3: Ejecutando build de producción...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Paso 4: Restaurar CSS original
    console.log('\n📊 Paso 4: Restaurando CSS original...');
    execSync('npm run restore:css', { stdio: 'inherit' });
    
    console.log('\n✅ Build optimizado completado exitosamente!');
    console.log('📦 El build de producción está listo en la carpeta .next/');
    
    return true;
  } catch (error) {
    console.error('❌ Error durante el build optimizado:', error.message);
    
    // Intentar restaurar CSS original en caso de error
    try {
      console.log('\n🔄 Intentando restaurar CSS original...');
      execSync('npm run restore:css', { stdio: 'inherit' });
    } catch (restoreError) {
      console.error('❌ Error restaurando CSS original:', restoreError.message);
    }
    
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  buildOptimized();
}

module.exports = { buildOptimized };
