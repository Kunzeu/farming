# 🚀 Guía de Deploy con Discord OAuth

## 📋 Pasos para Deployar

### **1. Configurar Discord Application**

1. **Ve a** [Discord Developer Portal](https://discord.com/developers/applications)
2. **Selecciona tu aplicación** (ID: 1399450681126944939)
3. **Ve a OAuth2 → General**
4. **En "Redirects", agrega tu URL de producción:**
   ```
   https://farming-coral.vercel.app/auth/discord/callback
   ```
5. **Guarda los cambios**

### **2. Configurar Variables de Entorno**

Crea un archivo `.env.production` en tu servidor con:

```env
# Discord OAuth Configuration (SERVIDOR - Seguro)
DISCORD_CLIENT_ID=1399450681126944939
DISCORD_CLIENT_SECRET=FnmKMdu6prSxr1MHF8U4tJCdPEaC1LSx
DISCORD_REDIRECT_URI=https://farming-coral.vercel.app/auth/discord/callback

# Variables públicas para el cliente (FRONTEND - Seguro)
NEXT_PUBLIC_DISCORD_CLIENT_ID=1399450681126944939
NEXT_PUBLIC_DISCORD_REDIRECT_URI=https://farming-coral.vercel.app/auth/discord/callback

# Supabase Database URL (SERVIDOR - Seguro)
DATABASE_URL=postgresql://postgres.haxfdeqtkbptiwlkikdk:Kunsexy35@aws-0-us-east-2.pooler.supabase.com:6543/postgres

# Next.js Configuration (SERVIDOR - Seguro)
NEXTAUTH_URL=https://farming-coral.vercel.app
NEXTAUTH_SECRET=tu-secret-key-aqui
```

### **3. Plataformas de Deploy**

#### **Vercel (Recomendado)**
1. **Conecta tu repositorio** a Vercel
2. **Configura las variables de entorno** en Settings → Environment Variables
3. **Deploy automático** en cada push

#### **Netlify**
1. **Conecta tu repositorio** a Netlify
2. **Configura las variables de entorno** en Site settings → Environment variables
3. **Build command:** `npm run build`
4. **Publish directory:** `.next`

#### **Railway/Render**
1. **Conecta tu repositorio**
2. **Configura las variables de entorno**
3. **Build command:** `npm run build`
4. **Start command:** `npm start`

### **4. Verificar Configuración**

Después del deploy, verifica:

1. **La URL de redirección** está configurada en Discord
2. **Las variables de entorno** están configuradas en tu plataforma
3. **La base de datos** está conectada correctamente
4. **El dominio** está configurado correctamente

### **5. Probar Discord OAuth**

1. **Ve a tu sitio deployado**
2. **Haz clic en "Continuar con Discord"**
3. **Autoriza la aplicación**
4. **Verifica que se guarde en Supabase**

## 🔧 Troubleshooting

### **Error: "Invalid redirect URI"**
- Verifica que la URL de redirección en Discord coincida exactamente
- Asegúrate de que no haya espacios extra

### **Error: "Client ID not found"**
- Verifica que `NEXT_PUBLIC_DISCORD_CLIENT_ID` esté configurado
- Asegúrate de que sea el mismo ID de tu aplicación Discord

### **Error de base de datos**
- Verifica que `DATABASE_URL` esté configurado correctamente
- Asegúrate de que Supabase esté funcionando

### **Error de CORS**
- Verifica que el dominio esté en la lista de orígenes permitidos
- Asegúrate de que las variables de entorno estén configuradas

## 🔒 Seguridad

### **Variables Seguras (Solo Servidor)**
- `DISCORD_CLIENT_SECRET` - **NUNCA** en el cliente
- `DATABASE_URL` - **NUNCA** en el cliente  
- `NEXTAUTH_SECRET` - **NUNCA** en el cliente

### **Variables Públicas (Cliente OK)**
- `NEXT_PUBLIC_DISCORD_CLIENT_ID` - **SÍ** puede estar en el cliente
- `NEXT_PUBLIC_DISCORD_REDIRECT_URI` - **SÍ** puede estar en el cliente

### **Por qué es seguro:**
- **CLIENT_ID** solo identifica tu aplicación
- **CLIENT_SECRET** se usa solo en el servidor para intercambiar tokens
- **OAuth2** está diseñado para que el CLIENT_ID sea público

## 📝 Notas Importantes

- **Nunca expongas** `DISCORD_CLIENT_SECRET` en el cliente
- **Usa HTTPS** en producción
- **Configura un dominio personalizado** para mejor UX
- **Monitorea los logs** para detectar errores
- **Haz backups** de la base de datos regularmente

## 🎯 URLs de Prueba

- **Login:** `https://farming-coral.vercel.app/login`
- **Registro:** `https://farming-coral.vercel.app/register`
- **Callback:** `https://farming-coral.vercel.app/auth/discord/callback`
- **Admin:** `https://farming-coral.vercel.app/admin` 