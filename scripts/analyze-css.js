const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Función para extraer clases CSS de un archivo
function extractClassesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const classRegex = /className=["']([^"']+)["']/g;
    const classes = new Set();
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      const classString = match[1];
      // Dividir por espacios y agregar cada clase
      classString.split(/\s+/).forEach(cls => {
        if (cls.trim()) {
          classes.add(cls.trim());
        }
      });
    }
    
    return Array.from(classes);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Función para escanear todos los archivos
function scanAllFiles() {
  const patterns = [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ];
  
  const allClasses = new Set();
  const fileStats = {};
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
      const classes = extractClassesFromFile(file);
      classes.forEach(cls => allClasses.add(cls));
      
      if (classes.length > 0) {
        fileStats[file] = classes.length;
      }
    });
  });
  
  return {
    allClasses: Array.from(allClasses).sort(),
    fileStats,
    totalClasses: allClasses.size
  };
}

// Función para analizar el uso de clases
function analyzeClassUsage() {
  console.log('🔍 Analizando uso de clases CSS...\n');
  
  const { allClasses, fileStats, totalClasses } = scanAllFiles();
  
  console.log(`📊 Estadísticas:`);
  console.log(`   Total de clases únicas encontradas: ${totalClasses}`);
  console.log(`   Archivos con clases: ${Object.keys(fileStats).length}\n`);
  
  // Mostrar las clases más comunes
  const classCount = {};
  Object.values(fileStats).forEach(count => {
    // Este es un conteo simplificado, en realidad necesitaríamos contar cada clase individual
  });
  
  console.log('📝 Clases encontradas:');
  allClasses.forEach((cls, index) => {
    console.log(`   ${index + 1}. ${cls}`);
  });
  
  console.log('\n📁 Archivos con más clases:');
  Object.entries(fileStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([file, count]) => {
      console.log(`   ${file}: ${count} clases`);
    });
  
  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    totalClasses,
    totalFiles: Object.keys(fileStats).length,
    classes: allClasses,
    fileStats
  };
  
  fs.writeFileSync('./css-analysis-report.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Reporte guardado en: css-analysis-report.json');
  
  return report;
}

// Ejecutar análisis
if (require.main === module) {
  analyzeClassUsage();
}

module.exports = { analyzeClassUsage, extractClassesFromFile, scanAllFiles };
