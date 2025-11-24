# 🛡️ Vereda Segura

Sistema de alertas comunitarias para zonas rurales. Aplicación web PWA desarrollada con Next.js, Supabase y geolocalización.

## 📋 Características

- ✅ **Alerta Silenciosa**: Botón grande para enviar alertas de emergencia con ubicación
- ✅ **Reportes Sospechosos**: Sistema de categorización de actividades sospechosas
- ✅ **Historial en Tiempo Real**: Visualización de alertas y reportes con actualización automática
- ✅ **Geolocalización**: Captura automática de ubicación GPS
- ✅ **PWA**: Funciona como aplicación instalable en dispositivos móviles
- ✅ **Modo Offline**: Funcionalidad parcial sin conexión a internet
- ✅ **Autenticación Simple**: Ingreso directo validando el correo autorizado
- ✅ **Modo Anónimo**: Opción para mantener privacidad en reportes

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)
- Git (opcional)

### Paso 1: Clonar o descargar el proyecto

```bash
# Si tienes Git
git clone <url-del-repositorio>
cd vereda-segura-v3

# O simplemente descomprime el archivo ZIP si lo descargaste
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Supabase

1. **Crear proyecto en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. **Ejecutar el esquema SQL**:
   - En el panel de Supabase, ve a **SQL Editor**
   - Abre el archivo `supabase/schema.sql` de este proyecto
   - Copia TODO el contenido del archivo
   - Pégalo en el SQL Editor de Supabase
   - Haz clic en **Run** o presiona `Ctrl+Enter`
   - Verifica que no haya errores

3. **Obtener credenciales**:
   - En Supabase, ve a **Settings** → **API**
   - Copia la **URL del proyecto** (Project URL)
   - Copia la **anon/public key**
   - Copia la **service role key** (se usa únicamente en el servidor)

### Paso 4: Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Windows (PowerShell)
New-Item .env.local

# Linux/Mac
touch .env.local
```

2. Agrega las siguientes variables (reemplaza con tus valores reales):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key (solo en el servidor)
```

### Paso 5: Generar iconos PWA (Opcional pero recomendado)

Los iconos PWA son necesarios para la instalación. Puedes:

1. **Usar un generador online**:
   - Ve a [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) o [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Sube una imagen cuadrada (mínimo 512x512px)
   - Descarga los iconos generados
   - Colócalos en la carpeta `public/` con estos nombres:
     - `icon-72x72.png`
     - `icon-96x96.png`
     - `icon-128x128.png`
     - `icon-144x144.png`
     - `icon-152x152.png`
     - `icon-192x192.png`
     - `icon-384x384.png`
     - `icon-512x512.png`

2. **Crear iconos manualmente**:
   - Crea una imagen cuadrada con el logo de "Vereda Segura"
   - Redimensiona a los tamaños mencionados
   - Guarda en la carpeta `public/`

### Paso 6: Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📱 Uso de la Aplicación

### Primera vez

1. Abre la aplicación en tu navegador
2. Ingresa tu correo electrónico
3. Si el correo está registrado (agregado manualmente en Supabase Auth), el sistema valida automáticamente sin necesidad de revisar el correo
4. Serás redirigido a la pantalla principal en segundos

### Enviar una alerta

1. En la pantalla principal, presiona el botón grande **"🚨 Enviar Alerta Silenciosa"**
2. Permite el acceso a tu ubicación cuando el navegador lo solicite
3. La alerta se enviará automáticamente a todos los usuarios

### Reportar actividad sospechosa

1. Presiona **"📝 Reportar Actividad Sospechosa"**
2. Selecciona una categoría
3. (Opcional) Agrega una descripción
4. Presiona **"Enviar Reporte"**

### Ver historial

1. Presiona **"📋 Ver Historial"**
2. Navega entre las pestañas de **Alertas** y **Reportes**
3. Los datos se actualizan automáticamente en tiempo real

### Instalar como PWA (Android)

1. Abre la aplicación en Chrome o Edge
2. Aparecerá un banner de instalación o ve al menú (⋮) → **"Instalar app"**
3. Confirma la instalación
4. La app aparecerá en tu pantalla de inicio

## 🚀 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Haz clic en **"New Project"**
   - Selecciona tu repositorio
   - En **Environment Variables**, agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Haz clic en **Deploy**

### Opción 2: Desde Vercel CLI

1. **Instala Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Despliega**:
   ```bash
   vercel
   ```
   - Sigue las instrucciones
   - Agrega las variables de entorno cuando se solicite

3. **Configurar variables de entorno en Vercel**:
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega las mismas variables que en `.env.local`

## 🗄️ Estructura de la Base de Datos

### Tablas principales

- **users**: Perfiles de usuario con preferencias
- **alerts**: Alertas silenciosas con ubicación
- **suspicious_reports**: Reportes de actividades sospechosas
- **push_tokens**: Tokens para notificaciones push (futuro)

### Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado:
- Los usuarios solo pueden ver/editar sus propios datos
- Las alertas y reportes son visibles para todos los usuarios autenticados
- El modo anónimo oculta el nombre del usuario en los reportes

## 🔧 Configuración Avanzada

### Habilitar notificaciones push (Futuro)

Para implementar notificaciones push completas:

1. Configura un servicio de notificaciones (Firebase Cloud Messaging, OneSignal, etc.)
2. Actualiza la tabla `push_tokens` con los tokens de dispositivo
3. Crea una Edge Function en Supabase para enviar notificaciones
4. Actualiza el service worker para manejar notificaciones push

### Personalizar estilos

Los estilos principales están en `app/globals.css`. Puedes modificar:
- Colores principales (busca `#dc2626` para el rojo principal)
- Tamaños de fuente
- Espaciado y márgenes

## 🐛 Solución de Problemas

### Error: "Usuario no autenticado"
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el esquema SQL se haya ejecutado completamente
- Revisa la consola del navegador para más detalles

### La geolocalización no funciona
- Verifica que el navegador tenga permisos de ubicación
- Asegúrate de usar HTTPS (requerido para geolocalización en producción)
- En desarrollo local, `localhost` funciona sin HTTPS

### El Service Worker no se registra
- Verifica que estés usando HTTPS o localhost
- Revisa la consola del navegador
- Asegúrate de que el archivo `public/sw.js` exista

### No puedo instalar la PWA
- Verifica que `manifest.json` esté accesible
- Asegúrate de tener iconos en la carpeta `public/`
- La PWA requiere HTTPS en producción (Vercel lo proporciona automáticamente)

## 📝 Notas Importantes

- **Privacidad**: Las ubicaciones se almacenan en la base de datos. Considera políticas de retención de datos.
- **Escalabilidad**: Para comunidades grandes, considera implementar paginación en el historial.
- **Notificaciones**: Las notificaciones push requieren configuración adicional (no incluida en esta versión inicial).

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso comunitario.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para problemas o preguntas:
- Revisa la documentación de [Next.js](https://nextjs.org/docs)
- Revisa la documentación de [Supabase](https://supabase.com/docs)
- Consulta los logs en la consola del navegador y en Supabase

---

**Desarrollado con ❤️ para comunidades rurales de Boyacá**

#   s i l e n t - a l a r m  
 