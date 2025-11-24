# ✅ Checklist de Verificación - Vereda Segura

Usa este checklist para verificar que todo esté configurado correctamente.

## 📦 Instalación Inicial

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto clonado/descomprimido correctamente

## 🗄️ Supabase

- [ ] Proyecto creado en Supabase
- [ ] SQL ejecutado (`supabase/schema.sql`)
- [ ] Tablas visibles en Table Editor:
  - [ ] `users`
  - [ ] `alerts`
  - [ ] `suspicious_reports`
  - [ ] `push_tokens`
- [ ] Políticas RLS creadas (verificar en pestaña "Policies")
- [ ] Credenciales copiadas:
  - [ ] Project URL
  - [ ] anon public key
  - [ ] service role key

## 🔐 Variables de Entorno

- [ ] Archivo `.env.local` creado
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado (solo servidor)
- [ ] Variables sin espacios extra o comillas incorrectas

## 🎨 Iconos PWA

- [ ] Iconos generados (o usando placeholder temporal)
- [ ] Archivos en carpeta `public/`:
  - [ ] `icon-72x72.png`
  - [ ] `icon-96x96.png`
  - [ ] `icon-128x128.png`
  - [ ] `icon-144x144.png`
  - [ ] `icon-152x152.png`
  - [ ] `icon-192x192.png`
  - [ ] `icon-384x384.png`
  - [ ] `icon-512x512.png`

## 🚀 Ejecución Local

- [ ] Servidor inicia sin errores (`npm run dev`)
- [ ] Aplicación accesible en `http://localhost:3000`
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal

## 🔑 Autenticación

- [ ] Página de login visible
- [ ] Puedo ingresar mi correo autorizado
- [ ] El sistema valida y entra sin pedir correo
- [ ] Aparezco en la pantalla principal

## 📍 Geolocalización

- [ ] Navegador solicita permisos de ubicación
- [ ] Puedo permitir acceso
- [ ] La ubicación se captura correctamente

## 🚨 Funcionalidades Principales

### Alerta Silenciosa
- [ ] Botón "Enviar Alerta Silenciosa" visible
- [ ] Al presionar, se captura ubicación
- [ ] Alerta se guarda en Supabase
- [ ] Aparece en historial

### Reporte Sospechoso
- [ ] Puedo acceder a la pantalla de reporte
- [ ] Puedo seleccionar una categoría
- [ ] Puedo agregar descripción
- [ ] Reporte se guarda correctamente

### Historial
- [ ] Puedo ver lista de alertas
- [ ] Puedo ver lista de reportes
- [ ] Los datos se actualizan en tiempo real
- [ ] Las fechas se muestran correctamente

### Configuración
- [ ] Puedo acceder a configuración
- [ ] Puedo cambiar modo anónimo
- [ ] Puedo actualizar mi nombre
- [ ] Los cambios se guardan

## 📱 PWA

- [ ] Service Worker se registra (ver consola)
- [ ] `manifest.json` accesible
- [ ] Puedo instalar la app (Android)
- [ ] La app funciona offline parcialmente

## 🐛 Verificación de Errores

- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal
- [ ] No hay errores en Supabase Dashboard → Logs

## 🚀 Despliegue (Opcional)

- [ ] Código subido a GitHub (si aplica)
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy exitoso
- [ ] App funciona en producción
- [ ] Usuarios cargados en Supabase Auth

## 📝 Documentación

- [ ] README.md leído
- [ ] INSTALL.md revisado
- [ ] SUPABASE_SETUP.md consultado
- [ ] Dudas resueltas

---

## 🎯 Si Todo Está Marcado

¡Felicitaciones! Tu aplicación **Vereda Segura** está completamente configurada y lista para usar.

## ⚠️ Si Hay Problemas

1. Revisa la sección "Solución de Problemas" en README.md
2. Consulta SUPABASE_SETUP.md para problemas de base de datos
3. Revisa los logs:
   - Consola del navegador (F12)
   - Terminal donde corre `npm run dev`
   - Supabase Dashboard → Logs

---

**Última actualización**: Proyecto completo y funcional ✅

