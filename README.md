# True Farming 🎮

Una aplicación web moderna y completa para optimizar tu experiencia de farming en **Guild Wars 2**, con calculadoras avanzadas, rutas de farming, y herramientas de análisis del mercado.

## ✨ Características Principales

### 🏠 **Dashboard Inteligente**
- **Items Populares**: Muestra items populares para farming con precios en tiempo real
- **Estadísticas Avanzadas**: Precios promedio, márgenes de ganancia y métricas del mercado
- **Búsqueda Inteligente**: Filtrado rápido de items por nombre con autocompletado
- **Acciones Rápidas**: Enlaces directos a todas las secciones principales

### 💰 **Trading Post Analytics**
- **Precios en Tiempo Real**: Información actualizada del mercado desde la API oficial de GW2
- **Búsqueda Avanzada**: Filtros por nombre, precio, margen de ganancia y tipo de item
- **Ordenamiento Inteligente**: Múltiples criterios de ordenamiento personalizables
- **Análisis de Mercado**: Estadísticas detalladas de precios y tendencias

### 🗺️ **Rutas de Farming**
- **Guías de Farming**: Rutas y estrategias para diferentes materiales
- **Información de Mapas**: Detalles sobre ubicaciones y materiales disponibles
- **Estimaciones de Oro**: Cálculos de ganancias esperadas por actividad
- **Filtros por Tipo**: Organización por tipo de material y dificultad

### 🔧 **Calculadoras de Salvaging Avanzadas**
- **Unidentified Gear**: Calculadoras específicas para Common, Masterwork y Rare
- **Precios en Tiempo Real**: Actualización automática cada 2 minutos desde GW2 API
- **Kits Optimizados**: 
  - **Copper-Fed Salvage-o-Matic** para Common Unidentified Gear
  - **Runecrafter's Salvage-o-Matic** para Masterwork Unidentified Gear
  - **Silver-Fed Salvage-o-Matic** para Rare Unidentified Gear
- **Drop Rates Precisos**: Tasas de drop estimadas basadas en datos de la comunidad
- **Análisis de Rentabilidad**: Cálculo automático de ganancias/pérdidas con ROI

### 📚 **Glosario de Conceptos Centralizado**
- **Conceptos Organizados**: Recopilación de todas las explicaciones y términos importantes
- **Búsqueda Inteligente**: Encuentra rápidamente cualquier concepto por categoría o palabra clave
- **Categorías Estructuradas**: Salvaging, Farming, Trading Post, Crafting, Eventos, Festivales y más
- **Consejos Prácticos**: Información adicional con tips útiles y enlaces a recursos externos
- **Navegación Intuitiva**: Enlaces directos desde todas las páginas hacia el glosario

### 📅 **Festivales y Eventos**
- **Festivales Especiales**: Dragon Bash, Halloween, Wintersday, Lunar New Year, Four Winds
- **Información de Eventos**: Detalles sobre fechas, actividades y recompensas
- **Navegación por Festival**: Acceso directo a cada festival específico
- **Contenido Estacional**: Información relevante para cada época del año

### ⚔️ **Fractales y Contenido Endgame**
- **Calculadoras de Fractales**: Análisis detallado de recompensas por tier
- **Estadísticas Avanzadas**: Valor total ganado, items obtenidos, cofres abiertos
- **Análisis por Dificultad**: Separación por niveles Initiate, Adept, Expert y Fractal
- **Optimización de Rutinas**: Recomendaciones para maximizar ganancias

### 🎯 **Calculadoras Especializadas**
- **Cajas de Joyas Orrianas**: Análisis de rentabilidad y conversión de karma
- **Rutinas Diarias**: Optimización de actividades diarias para farming
- **Research Notes**: Calculadora para notas de investigación

### 🎁 **Sistema de Giveaways**
- **Sorteos Automáticos**: Sistema completo de gestión de sorteos
- **Premios en Tiempo Real**: Información de premios con traducciones automáticas
- **Fallback Inteligente**: Traducciones locales cuando la API no está disponible

### ⚠️ **Sistema de Notificaciones**
- **Banner Automático**: Notificaciones automáticas sobre mantenimiento de API
- **Ocultación Inteligente**: Se oculta automáticamente cuando la API se reactiva

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript para type safety
- **Styling**: Tailwind CSS para diseño responsive
- **Animaciones**: Framer Motion para transiciones suaves
- **Iconos**: Lucide React para iconografía consistente

### **Backend & APIs**
- **APIs**: Guild Wars 2 API oficial
- **Estado**: React Hooks y Context API
- **Autenticación**: Sistema de autenticación con Discord
- **Base de Datos**: Sistema de base de datos integrado

### **Características Técnicas**
- **Responsive**: Diseño mobile-first optimizado
- **Performance**: Optimización de carga y rendimiento
- **Multiidioma**: Soporte para 4 idiomas (ES, EN, DE, FR)
- **Fallback Inteligente**: Traducciones locales cuando la API no está disponible

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Node.js 18+ 
- npm o yarn
- Git

### **Pasos de Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Kunzeu/gw2-farming-hub.git
   cd gw2-farming-hub
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus configuraciones
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### **Scripts Disponibles**
```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos
```

## 📁 Arquitectura del Proyecto

```
gw2-farming-hub/
├── src/
│   ├── app/                    # Páginas de Next.js App Router
│   │   ├── [locale]/          # Soporte multiidioma
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── trading-post/      # Trading Post Analytics
│   │   ├── farming-routes/    # Rutas de farming
│   │   ├── salvage/           # Calculadoras de salvaging
│   │   │   ├── common/        # Common Unidentified Gear
│   │   │   ├── masterwork/    # Masterwork Unidentified Gear
│   │   │   ├── rare/          # Rare Unidentified Gear
│   │   │   └── research-notes/ # Research Notes
│   │   ├── glossary/          # Glosario de conceptos
│   │   ├── festivals/         # Festivales y eventos
│   │   ├── fractals/          # Calculadoras de fractales
│   │   ├── orrian-jewelry-box/ # Cajas de joyas orrianas
│   │   ├── daily-routine/     # Rutinas diarias
│   │   ├── crafting/          # Calculadora de crafting
│   │   ├── buyout/            # Calculadora de buyout
│   │   └── auth/              # Sistema de autenticación
│   ├── components/            # Componentes reutilizables
│   │   ├── layout/           # Componentes de layout
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── ui/               # Componentes de UI
│   │   └── debug/            # Componentes de debugging
│   ├── contexts/             # Contextos de React
│   │   ├── AuthContext.tsx   # Contexto de autenticación
│   │   └── I18nContext.tsx   # Contexto de internacionalización
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilidades y APIs
│   ├── i18n/                 # Internacionalización
│   │   └── locales/         # Archivos de idiomas
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Utilidades generales
├── public/                   # Archivos estáticos
│   ├── images/              # Imágenes del proyecto
│   └── data/                # Datos estáticos
├── database/                 # Base de datos
└── package.json
```

## 🌐 Soporte Multiidioma

La aplicación soporta múltiples idiomas:
- 🇪🇸 **Español** (es) - Idioma principal
- 🇺🇸 **Inglés** (en) - Idioma secundario
- 🇩🇪 **Alemán** (de) - Idioma adicional
- 🇫🇷 **Francés** (fr) - Idioma adicional

## 🔧 APIs y Integraciones

### **Guild Wars 2 API**
- **Items**: Información detallada de items y sus propiedades
- **Precios**: Datos del Trading Post en tiempo real
- **Personajes**: Información de personajes y bancos
- **Billetera**: Datos de monedas y materiales

### **Endpoints Principales Utilizados**
```typescript
// Items y precios
GET /v2/items                    # Información de items
GET /v2/commerce/prices          # Precios del Trading Post
GET /v2/commerce/listings        # Listings del Trading Post

// Validación
GET /v2/tokeninfo               # Información del token
```

## 🎨 Sistema de Diseño

### **Características Visuales**
- **Tema Oscuro**: Interfaz moderna con tema oscuro elegante
- **Responsive Design**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Accesibilidad**: Diseño accesible y fácil de usar
- **Performance**: Carga rápida y optimizada

### **Componentes de UI**
- **Cards**: Tarjetas informativas con diseño consistente
- **Tables**: Tablas responsive con ordenamiento y filtros
- **Modals**: Ventanas modales para información detallada
- **Navigation**: Navegación intuitiva y responsive
- **Forms**: Formularios con validación y feedback visual


## 🔮 Roadmap y Próximas Características

### **✅ Funcionalidades Completadas**
- ✅ **Sistema de Notificaciones**: Banner automático con ocultación inteligente
- ✅ **Traducciones de Fallback**: Sistema de traducciones locales para items
- ✅ **Sistema de Giveaways**: Gestión completa de sorteos con traducciones
- ✅ **Mejoras en Slogans**: Soporte para saltos de línea dinámicos

### **Próximas Funcionalidades**
- [ ] **Sistema de Usuarios**: Perfiles básicos y preferencias personalizadas
- [ ] **Trading Post Analytics**: Análisis avanzado del mercado con gráficos
- [ ] **PWA Completa**: Aplicación web progresiva con instalación offline
- [ ] **Sistema de Cuentas**: Gestión completa de usuarios y perfiles
- [ ] **Más Calculadoras**: Salvaging para otros tipos de items
- [ ] **Historial de Precios**: Base de datos histórica de precios
- [ ] **Machine Learning**: Predicciones de precios y tendencias
- [ ] **Móvil Nativo**: Aplicaciones móviles nativas

## 🤝 Contribuir al Proyecto

### **Cómo Contribuir**
1. **Fork** el proyecto en GitHub
2. **Crea una rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre un Pull Request** con descripción detallada

### **Áreas de Contribución**
- 🐛 **Bug Fixes**: Corrección de errores
- ✨ **Nuevas Features**: Implementación de funcionalidades
- 📚 **Documentación**: Mejora de documentación
- 🎨 **UI/UX**: Mejoras en diseño
- 🌐 **Traducciones**: Nuevos idiomas
- 🔧 **Calculadoras**: Nuevas calculadoras

## 📞 Contacto

- **GitHub**: [@Kunzeu](https://github.com/kunzeu)
- **Issues**: Reporta bugs y solicita features en GitHub
- **Discord**: [True Farming](https://discord.com/invite/KQSrhA2qmx)

---

## 🎯 **¿Por qué True Farming?**

True Farming ofrece **herramientas centralizadas y profesionales** para optimizar el farming en Guild Wars 2:

- 🎯 **Todo en un lugar**: Todas las herramientas necesarias en una aplicación
- ⚡ **Tiempo Real**: Datos actualizados desde la API oficial
- 📱 **Multiplataforma**: Funciona en desktop y móvil
- 🌐 **Multiidioma**: Soporte para la comunidad internacional
- 🔧 **Mantenido**: Actualizaciones constantes y soporte activo

**¡Optimiza tu farming y maximiza tus ganancias en Guild Wars 2!** 🎮✨

---
