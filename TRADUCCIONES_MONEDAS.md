# Traducciones de Monedas - GW2 Farming Hub

## 🌍 Idiomas Soportados

- 🇪🇸 **Español** (es)
- 🇺🇸 **Inglés** (en) 
- 🇩🇪 **Alemán** (de)
- 🇫🇷 **Francés** (fr)

## 💰 Traducciones por Moneda

### 1. **Gold** (Oro)
- 🇪🇸 **Español**: `currency.gold` → "Oro"
- 🇺🇸 **Inglés**: `currency.gold` → "Gold"
- 🇩🇪 **Alemán**: `currency.gold` → "Gold"
- 🇫🇷 **Francés**: `currency.gold` → "Or"

### 2. **Spirit Shards** (Esquirlas Espirituales)
- 🇪🇸 **Español**: `currency.spiritShards` → "Esquirla espiritual"
- 🇺🇸 **Inglés**: `currency.spiritShards` → "Spirit Shards"
- 🇩🇪 **Alemán**: `currency.spiritShards` → "Geisterscherben"
- 🇫🇷 **Francés**: `currency.spiritShards` → "Éclats d'Esprit"

### 3. **Karma** (Karma)
- 🇪🇸 **Español**: `currency.karma` → "Karma"
- 🇺🇸 **Inglés**: `currency.karma` → "Karma"
- 🇩🇪 **Alemán**: `currency.karma` → "Karma"
- 🇫🇷 **Francés**: `currency.karma` → "Karma"

### 4. **Fractal Relics** (Reliquias de Fractal)
- 🇪🇸 **Español**: `currency.fractalRelics` → "Reliquias de Fractal"
- 🇺🇸 **Inglés**: `currency.fractalRelics` → "Fractal Relics"
- 🇩🇪 **Alemán**: `currency.fractalRelics` → "Fraktal-Relikte"
- 🇫🇷 **Francés**: `currency.fractalRelics` → "Reliques fractales"

### 5. **Volatile Magic** (Magia Volátil)
- 🇪🇸 **Español**: `currency.volatileMagic` → "Magia Volátil"
- 🇺🇸 **Inglés**: `currency.volatileMagic` → "Volatile Magic"
- 🇩🇪 **Alemán**: `currency.volatileMagic` → "Flüchtige Magie"
- 🇫🇷 **Francés**: `currency.volatileMagic` → "Magie volatile"

### 6. **Unbound Magic** (Magia Desatada)
- 🇪🇸 **Español**: `currency.unboundMagic` → "Magia Desatada"
- 🇺🇸 **Inglés**: `currency.unboundMagic` → "Unbound Magic"
- 🇩🇪 **Alemán**: `currency.unboundMagic` → "Ungebundene Magie"
- 🇫🇷 **Francés**: `currency.unboundMagic` → "Magie déliée"

### 7. **Rift Essences** (Esencias de Rift)
- 🇪🇸 **Español**: `currency.riftEssences` → "Esencias de Rift"
- 🇺🇸 **Inglés**: `currency.riftEssences` → "Rift Essences"
- 🇩🇪 **Alemán**: `currency.riftEssences` → "Riss-Essenzen"
- 🇫🇷 **Francés**: `currency.riftEssences` → "Essences de faille"

### 8. **Mystic Clovers** (Tréboles Místicos)
- 🇪🇸 **Español**: `currency.mysticClovers` → "Tréboles Místicos"
- 🇺🇸 **Inglés**: `currency.mysticClovers` → "Mystic Clovers"
- 🇩🇪 **Alemán**: `currency.mysticClovers` → "Mystische Kleeblätter"
- 🇫🇷 **Francés**: `currency.mysticClovers` → "Trèfles mystiques"

### 9. **Imperial Favor** (Favor Imperial)
- 🇪🇸 **Español**: `currency.imperialFavor` → "Favor Imperial"
- 🇺🇸 **Inglés**: `currency.imperialFavor` → "Imperial Favor"
- 🇩🇪 **Alemán**: `currency.imperialFavor` → "Kaiserliche Gunst"
- 🇫🇷 **Francés**: `currency.imperialFavor` → "Faveur Impériale"

## 📍 Ubicaciones de Uso

### **Panel de Administración** (`/admin`)
- Se muestran en `currencyOptions` con las etiquetas traducidas
- Cada moneda tiene su propio campo de entrada
- Las etiquetas se muestran en el idioma seleccionado

### **Panel de Moderador** (`/moderator`)
- Mismas funcionalidades que el panel de admin
- Traducciones automáticas según el idioma del usuario

### **Rutas de Farm** (`/farming-routes`)
- Se muestran en las tarjetas con iconos y nombres traducidos
- El `currencyMap` usa las claves de traducción correctas
- Sufijo "/h" (por hora) se mantiene en todos los idiomas

### **Rutina Diaria** (`/daily-routine`)
- Se muestran en `currencyConfig` con nombres traducidos
- Los totales se calculan y muestran en el idioma correcto
- Compatible con vista de lista y cuadrícula

### **Modal de Descripción**
- Se muestran todas las monedas de la farm seleccionada
- Nombres traducidos según el idioma del usuario
- Formato consistente en todas las vistas

## 🔧 Implementación Técnica

### **Claves de Traducción**
```typescript
// Ejemplo de uso en el código
const currencyMap = {
  gold: { 
    icon: 'gold' as const, 
    labelKey: 'currency.gold',  // Clave de traducción
    suffix: '/h' 
  },
  // ... otras monedas
};
```

### **Función de Traducción**
```typescript
// En los componentes
<p className="text-gray-400 text-sm">
  {t(currency.labelKey, currency.labelKey)}
</p>
```

### **Archivos de Traducción**
- `src/i18n/messages/es.json` - Español
- `src/i18n/messages/en.json` - Inglés  
- `src/i18n/messages/de.json` - Alemán
- `src/i18n/messages/fr.json` - Francés

## ✅ Estado Actual

**TODAS LAS TRADUCCIONES ESTÁN COMPLETAS** ✅

- ✅ **9 monedas** traducidas en **4 idiomas**
- ✅ **36 traducciones** implementadas
- ✅ **Consistencia** en todas las vistas
- ✅ **Compatibilidad** con el sistema de i18n existente

## 🚀 Cómo Funciona

1. **Usuario selecciona idioma** en el Language Switcher
2. **Sistema detecta idioma** y carga las traducciones correspondientes
3. **Componentes renderizan** nombres de monedas en el idioma correcto
4. **Traducciones automáticas** en todas las vistas del sistema

## 📝 Notas Importantes

- **Karma** se mantiene igual en todos los idiomas (es un término universal)
- **Gold** se traduce apropiadamente en cada idioma
- **Sufijos** como "/h" se mantienen consistentes
- **Iconos** son universales y no requieren traducción
- **Fallback** a inglés si una traducción no está disponible

## 🔍 Verificación

Para verificar que las traducciones funcionen:

1. **Cambia el idioma** usando el Language Switcher
2. **Navega** a diferentes secciones del sistema
3. **Verifica** que los nombres de monedas cambien al idioma seleccionado
4. **Comprueba** que todas las vistas muestren las traducciones correctas

¡El sistema de monedas está completamente internacionalizado y listo para usuarios de todo el mundo! 🌍✨
