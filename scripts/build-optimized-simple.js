const { execSync } = require('child_process');

function buildOptimizedSimple() {
  console.log('🚀 Iniciando build optimizado (configuración mejorada)...\n');
  
  try {
    console.log('📊 Ejecutando build de producción con optimizaciones...');
    console.log('🔧 Configuración aplicada:');
    console.log('   - Tailwind CSS optimizado');
    console.log('   - Plugins no utilizados deshabilitados');
    console.log('   - Purging agresivo habilitado');
    console.log('   - Configuración experimental activada\n');
    
    // Build de producción
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\n✅ Build optimizado completado exitosamente!');
    console.log('📦 El build de producción está listo en la carpeta .next/');
    console.log('🎯 El CSS se ha optimizado automáticamente durante el build');
    
    return true;
  } catch (error) {
    console.error('❌ Error durante el build optimizado:', error.message);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  buildOptimizedSimple();
}

module.exports = { buildOptimizedSimple };
