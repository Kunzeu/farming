# True Farming 🎮

Una aplicación web moderna para información de Guild Wars 2 **calculadoras de salvaging**.

## ✨ Características

### 🏠 Dashboard Principal
- **Items Populares**: Muestra items populares para farming con precios en tiempo real
- **Estadísticas**: Precios promedio, márgenes de ganancia y métricas del mercado
- **Búsqueda**: Filtrado rápido de items por nombre
- **Acciones Rápidas**: Enlaces directos a todas las secciones

### 💰 Trading Post
- **Precios en Tiempo Real**: Información actualizada del mercado desde la API oficial de GW2
- **Búsqueda Avanzada**: Filtros por nombre, precio y margen de ganancia
- **Ordenamiento**: Múltiples criterios de ordenamiento
- **Estadísticas del Mercado**: Análisis de precios y tendencias

### 🗺️ Rutas de Farming
- **Guías Detalladas**: Rutas optimizadas para diferentes materiales
- **Información de Waypoints**: Coordenadas y descripciones precisas
- **Estimaciones de Oro**: Ganancias esperadas por hora
- **Filtros por Dificultad**: Fácil, medio y difícil

### 🔧 Calculadoras de Salvaging
- **Unidentified Gear**: Calculadoras específicas para Common, Masterwork y Rare
- **Precios en Tiempo Real**: Actualización automática cada 2 minutos desde GW2 API
- **Kits Optimizados**: 
  - **Copper-Fed Salvage-o-Matic** para Common Unidentified Gear
  - **Runecrafter's Salvage-o-Matic** para Masterwork Unidentified Gear
  - **Silver-Fed Salvage-o-Matic** para Rare Unidentified Gear
- **Drop Rates**: Tasas de drop estimadas basadas en datos de la comunidad
- **Análisis de Rentabilidad**: Cálculo automático de ganancias/pérdidas

### 📚 Glosario de Conceptos
- **Conceptos Centralizados**: Recopilación de todas las explicaciones y términos importantes
- **Búsqueda y Filtros**: Encuentra rápidamente cualquier concepto por categoría o palabra clave
- **Categorías Organizadas**: Salvaging, Farming, Trading Post, Crafting, Eventos, Festivales y más
- **Consejos y Enlaces**: Información adicional con tips prácticos y enlaces a recursos externos
- **Navegación Intuitiva**: Enlaces directos desde todas las páginas hacia el glosario

### 📅 Eventos Mundiales
- **Horarios en Tiempo Real**: Información actualizada de eventos
- **Filtros por Mapa**: Búsqueda por ubicación específica
- **Estados de Eventos**: Activo, preparación, completado, etc.
- **Recompensas**: Lista detallada de recompensas por evento

### ⚔️ Builds Meta
- **Builds Optimizadas**: Las mejores builds para cada profesión
- **Filtros Avanzados**: Por profesión, rol y dificultad
- **Información Detallada**: Equipo, runas, sigilos y rotaciones
- **Sistema de Rating**: Evaluaciones de la comunidad

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14 con TypeScript
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **APIs**: Guild Wars 2 API oficial
- **Estado**: React Hooks
- **Responsive**: Diseño mobile-first
- **Deployment**: Vercel

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/gw2-farming-hub.git
   cd gw2-farming-hub
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
gw2-farming-hub/
├── src/
│   ├── app/                    # Páginas de Next.js App Router
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── trading-post/      # Página del Trading Post
│   │   ├── farming-routes/    # Rutas de farming
│   │   ├── salvage/           # Calculadoras de salvaging
│   │   │   └── unidentified-gear/
│   │   │       ├── common/    # Common Unidentified Gear
│   │   │       ├── masterwork/ # Masterwork Unidentified Gear
│   │   │       └── rare/      # Rare Unidentified Gear
│   │   ├── glossary/          # Glosario de conceptos
│   │   ├── events/            # Eventos mundiales
│   │   └── builds/            # Builds meta
│   ├── components/            # Componentes reutilizables
│   │   ├── layout/           # Componentes de layout
│   │   ├── auth/             # Componentes de autenticación
│   │   └── ui/               # Componentes de UI
│   │       ├── GlossaryLink.tsx # Enlace reutilizable al glosario
│   ├── contexts/             # Contextos de React
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilidades y APIs
│   └── types/                # Tipos TypeScript
├── public/                   # Archivos estáticos
└── package.json
```

## 🔧 APIs Utilizadas

### Guild Wars 2 API
- **Items**: Información detallada de items
- **Precios**: Datos del Trading Post en tiempo real
- **Eventos**: Estados de eventos mundiales
- **Builds**: Información de builds del juego

### Endpoints Principales
- `https://api.guildwars2.com/v2/items` - Información de items
- `https://api.guildwars2.com/v2/commerce/prices` - Precios del Trading Post
- `https://api.guildwars2.com/v2/events` - Eventos mundiales

## 🎨 Características de Diseño

- **Tema Oscuro**: Interfaz moderna con tema oscuro
- **Responsive**: Optimizado para móviles y desktop
- **Animaciones**: Transiciones suaves con Framer Motion
- **Accesibilidad**: Diseño accesible y fácil de usar
- **Performance**: Carga rápida y optimizada
- **UX Moderna**: Navegación intuitiva y feedback visual

## 🔮 Próximas Características

- [ ] **Sistema de Usuarios**: Cuentas y preferencias personalizadas
- [ ] **Notificaciones**: Alertas de precios y eventos
- [ ] **Widgets Personalizables**: Dashboard personalizable
- [ ] **Modo Offline**: Funcionalidad básica sin conexión
- [ ] **PWA**: Aplicación web progresiva
- [ ] **API Backend**: Servidor propio para datos adicionales
- [ ] **Integración con Discord**: Bot para notificaciones
- [ ] **Análisis Avanzado**: Gráficos de precios y tendencias
- [ ] **Más Calculadoras**: Salvaging para otros tipos de items
- [ ] **Historial de Precios**: Gráficos de evolución temporal

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **ArenaNet**: Por proporcionar la API oficial de Guild Wars 2
- **Comunidad GW2**: Por el feedback y sugerencias
- **Next.js Team**: Por el framework increíble
- **Tailwind CSS**: Por el sistema de diseño
- **GW2 Wiki**: Por los datos de drop rates y información del juego

## 📞 Contacto

- **GitHub**: [@Kunzeu](https://github.com/kunzeu)

---

**¡Disfruta farming en Guild Wars 2!** 🎮✨
