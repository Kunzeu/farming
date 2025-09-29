#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Características ES2022+ que NO deberían tener polyfills
const modernFeatures = [
  'Array.prototype.at',
  'Array.prototype.flat',
  'Array.prototype.flatMap',
  'Object.fromEntries',
  'Object.hasOwn',
  'String.prototype.trimStart',
  'String.prototype.trimEnd',
  'Optional chaining',
  'Nullish coalescing',
  'Top-level await'
];

// Buscar en el directorio .next/static/chunks
const chunksDir = path.join(__dirname, '..', '.next', 'static', 'chunks');

function checkPolyfills() {
  console.log('🔍 Verificando eliminación de polyfills...\n');
  
  if (!fs.existsSync(chunksDir)) {
    console.log('❌ Directorio de chunks no encontrado. Ejecuta "npm run build" primero.');
    return;
  }

  const files = fs.readdirSync(chunksDir);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  let totalSize = 0;
  let polyfillCount = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(chunksDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const size = fs.statSync(filePath).size;
    totalSize += size;
    
    console.log(`📄 ${file} (${(size / 1024).toFixed(2)} KB)`);
    
    // Buscar polyfills específicos
    modernFeatures.forEach(feature => {
      if (content.includes(feature)) {
        console.log(`  ⚠️  Encontrado polyfill para: ${feature}`);
        polyfillCount++;
      }
    });
    
    // Buscar patrones de polyfills comunes
    const polyfillPatterns = [
      /Array\.prototype\.at\s*=/,
      /Array\.prototype\.flat\s*=/,
      /Array\.prototype\.flatMap\s*=/,
      /Object\.fromEntries\s*=/,
      /Object\.hasOwn\s*=/,
      /String\.prototype\.trimStart\s*=/,
      /String\.prototype\.trimEnd\s*=/
    ];
    
    polyfillPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.log(`  ⚠️  Posible polyfill encontrado: ${pattern}`);
        polyfillCount++;
      }
    });
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`   Total de archivos JS: ${jsFiles.length}`);
  console.log(`   Tamaño total: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Polyfills encontrados: ${polyfillCount}`);
  
  if (polyfillCount === 0) {
    console.log('✅ ¡Excelente! No se encontraron polyfills innecesarios.');
  } else {
    console.log('⚠️  Se encontraron polyfills que podrían eliminarse.');
  }
}

checkPolyfills();
