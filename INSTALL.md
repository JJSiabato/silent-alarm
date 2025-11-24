# 🚀 Guía Rápida de Instalación - Vereda Segura

## Pasos Rápidos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase

#### a) Crear proyecto en Supabase
- Ve a https://supabase.com
- Crea un nuevo proyecto
- Espera 2-3 minutos a que se configure

#### b) Ejecutar SQL
- En Supabase: **SQL Editor** → **New Query**
- Abre el archivo `supabase/schema.sql`
- Copia TODO el contenido
- Pégalo en el SQL Editor
- Presiona **Run** (o Ctrl+Enter)
- ✅ Debe mostrar "Success"

#### c) Obtener credenciales
- En Supabase: **Settings** → **API**
- Copia **Project URL**
- Copia **anon public key**
- Copia **service role key** (solo se usa en el servidor)

### 3. Crear archivo .env.local

En la raíz del proyecto, crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Generar iconos (IMPORTANTE para PWA)

**Opción rápida**: Usa el SVG placeholder y conviértelo a PNG:

1. Abre `public/icon-placeholder.svg` en un navegador
2. Toma captura de pantalla o usa un convertidor online
3. Genera los tamaños: 72, 96, 128, 144, 152, 192, 384, 512
4. Guarda como `icon-{tamaño}x{tamaño}.png` en `public/`

**O usa un generador online**:
- https://realfavicongenerator.net/
- Sube cualquier imagen cuadrada
- Descarga y coloca en `public/`

### 5. Ejecutar

```bash
npm run dev
```

Abre http://localhost:3000

### 6. Probar

1. Ingresa tu correo (debe existir en Supabase Auth)
2. El sistema valida automáticamente y te redirige
3. Si ves un error, confirma que el correo está registrado

## ⚠️ Problemas Comunes

### "Invalid API key"
- Verifica que `.env.local` tenga las variables correctas
- Reinicia el servidor después de crear `.env.local`

### "relation does not exist"
- El SQL no se ejecutó correctamente
- Vuelve a ejecutar `supabase/schema.sql` completo

### No aparecen iconos
- Los iconos son opcionales para desarrollo
- Para producción/PWA, sí son necesarios
- Usa el placeholder SVG como base

### Geolocalización no funciona
- En desarrollo local funciona
- En producción requiere HTTPS (Vercel lo da automáticamente)

## 📦 Desplegar en Vercel

1. Sube código a GitHub
2. Ve a vercel.com
3. Importa proyecto
4. Agrega variables de entorno (las mismas de `.env.local`)
5. Deploy

¡Listo! 🎉

