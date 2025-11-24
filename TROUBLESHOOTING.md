# 🔧 Solución de Problemas - Vereda Segura

## Problemas Comunes y Soluciones

### ❌ No puedo iniciar sesión con mi correo

**Síntomas:**
- Ingresas el correo y aparece un error de "Correo no autorizado" o similar
- La pantalla queda en "Verificando..." y luego muestra error

**Soluciones:**

#### 1. Verifica que el correo exista en Supabase

1. Ve a **Authentication** → **Users**
2. Busca el correo del usuario
3. Comprueba que el estado sea **Confirmed**
4. Si no existe, haz clic en **Add user**, pon el correo y marca **Auto confirm user**

#### 2. Verifica las variables de entorno

El login depende de tres variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Si falta la service role key o es incorrecta, `/api/login` devolverá error.

#### 3. Revisa la consola del navegador

1. Abre DevTools (F12) → pestaña **Console**
2. Intenta ingresar con el correo
3. Si ves errores en rojo, copia el mensaje

#### 4. Revisa los logs de Supabase

1. Dashboard → **Logs** → **API Logs**
2. Filtra por errores
3. Busca mensajes relacionados con `generate_link` o `verifyOtp`

### ❌ Error: "Invalid API key"

**Solución:**
1. Ve a Supabase → Settings → API
2. Copia la **anon public key** nuevamente
3. Actualiza `.env.local`
4. Reinicia el servidor

### ❌ Error: "relation does not exist"

**Solución:**
1. El esquema SQL no se ejecutó correctamente
2. Ve a Supabase → SQL Editor
3. Ejecuta `supabase/schema.sql` completo nuevamente
4. Verifica que las tablas existan en Table Editor

### ❌ La geolocalización no funciona

**Síntomas:**
- El navegador no solicita permisos
- Aparece un error al intentar obtener ubicación

**Soluciones:**

1. **Verificar permisos del navegador:**
   - Chrome: Configuración → Privacidad → Ubicación
   - Firefox: Configuración → Privacidad → Permisos
   - Asegúrate de permitir ubicación para localhost o tu dominio

2. **HTTPS requerido en producción:**
   - La geolocalización requiere HTTPS en producción
   - Vercel proporciona HTTPS automáticamente
   - En desarrollo, localhost funciona sin HTTPS

3. **Verificar que el navegador soporte geolocalización:**
   - Abre la consola (F12)
   - Escribe: `navigator.geolocation`
   - Debe mostrar un objeto, no `undefined`

### ❌ Service Worker no se registra

**Solución:**
1. Verifica que estés usando HTTPS o localhost
2. Abre la consola (F12) y busca errores
3. Verifica que `public/sw.js` exista
4. Intenta limpiar el cache:
   - Chrome: DevTools → Application → Clear storage → Clear site data

### ❌ No puedo instalar la PWA

**Solución:**
1. Verifica que `manifest.json` esté accesible:
   - Abre `http://localhost:3000/manifest.json` en el navegador
   - Debe mostrar el JSON, no un error 404

2. Verifica que los iconos existan:
   - Al menos `icon-192x192.png` debe existir en `public/`
   - Puedes usar el placeholder temporalmente

3. Verifica que estés usando HTTPS en producción:
   - Las PWAs requieren HTTPS (excepto localhost)
   - Vercel proporciona HTTPS automáticamente

### ❌ Los datos no se actualizan en tiempo real

**Solución:**
1. Verifica que Realtime esté habilitado en Supabase:
   - Ve a Database → Replication
   - Asegúrate de que las tablas `alerts` y `suspicious_reports` tengan Realtime habilitado

2. Verifica la conexión:
   - Abre la consola (F12)
   - Busca mensajes de Supabase Realtime
   - Debe mostrar "Connected" o similar

### ❌ Error al guardar alertas o reportes

**Solución:**
1. Verifica que el usuario esté autenticado:
   - Abre la consola (F12)
   - Verifica que no haya errores de autenticación

2. Verifica las políticas RLS:
   - Ve a Supabase → Table Editor → Policies
   - Asegúrate de que existan políticas de inserción

3. Verifica los logs de Supabase:
   - Ve a Logs → API Logs
   - Busca errores relacionados con INSERT

## 🔍 Cómo Obtener Ayuda

### Información útil para debugging:

1. **Consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Copia cualquier error en rojo

2. **Logs de Supabase:**
   - Dashboard → Logs → API Logs
   - Filtra por errores

3. **Logs del servidor:**
   - Terminal donde corre `npm run dev`
   - Copia cualquier error

4. **Estado de la aplicación:**
   - ¿En qué pantalla ocurre el error?
   - ¿Qué acción estabas realizando?
   - ¿Es la primera vez o siempre ocurre?

## 📞 Checklist de Verificación Rápida

Antes de reportar un problema, verifica:

- [ ] Variables de entorno configuradas correctamente
- [ ] Servidor reiniciado después de cambios en `.env.local`
- [ ] Esquema SQL ejecutado completamente
- [ ] Correos autorizados creados en Supabase Auth
- [ ] Navegador actualizado
- [ ] Sin errores en consola del navegador
- [ ] Sin errores en terminal del servidor

---

**¿Sigue sin funcionar?** Revisa los logs detallados y comparte:
1. El error exacto (copiar y pegar)
2. En qué paso ocurre
3. Qué navegador y versión usas
4. Si es desarrollo o producción

