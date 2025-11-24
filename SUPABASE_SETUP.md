# 🗄️ Configuración Detallada de Supabase

## Paso a Paso Completo

### 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Inicia sesión o crea una cuenta
3. Haz clic en **"New Project"**
4. Completa:
   - **Name**: `vereda-segura` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la más cercana (ej: `South America (São Paulo)`)
5. Haz clic en **"Create new project"**
6. ⏳ Espera 2-3 minutos mientras se configura

### 2. Ejecutar el Esquema SQL

1. En el panel de Supabase, ve a **SQL Editor** (ícono de base de datos en el menú lateral)
2. Haz clic en **"New query"**
3. Abre el archivo `supabase/schema.sql` de este proyecto
4. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
5. Pégalo en el editor SQL de Supabase (Ctrl+V)
6. Haz clic en **"Run"** o presiona `Ctrl+Enter` (o `Cmd+Enter` en Mac)
7. ✅ Deberías ver "Success. No rows returned" o mensajes similares
8. ⚠️ Si hay errores, léelos cuidadosamente:
   - Si dice "already exists", es normal (ignóralo)
   - Si hay otros errores, revisa la sintaxis

### 3. Verificar que las Tablas se Crearon

1. En Supabase, ve a **Table Editor** (ícono de tabla en el menú lateral)
2. Deberías ver estas tablas:
   - ✅ `users`
   - ✅ `alerts`
   - ✅ `suspicious_reports`
   - ✅ `push_tokens`
3. Si no aparecen, vuelve a ejecutar el SQL

### 4. Verificar RLS (Row Level Security)

1. En **Table Editor**, haz clic en cualquier tabla
2. Ve a la pestaña **"Policies"**
3. Deberías ver políticas como:
   - "Users can view own profile"
   - "Authenticated users can view all alerts"
   - etc.
4. Si no hay políticas, el SQL no se ejecutó completamente

### 5. Obtener Credenciales de API

1. En Supabase, ve a **Settings** (ícono de engranaje)
2. Haz clic en **API**
3. Encontrarás:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public key**: Una cadena larga que empieza con `eyJ...`
   - **service role key**: Clave administrativa (guárdala sólo en el servidor)
4. **Copia las tres** (las necesitarás para `.env.local`)

### 6. Registrar usuarios autorizados

El inicio de sesión ya no requiere correo electrónico. En su lugar, la app verifica si el correo existe en Supabase Auth.

1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user**
3. Ingresa el correo electrónico
4. Marca **"Auto confirm user"** para que quede activo de inmediato
5. Guarda

Repite el proceso por cada persona que deba tener acceso.

### 7. Probar la Conexión

Puedes probar que todo funciona:

1. En Supabase, ve a **Authentication** → **Users**
2. Deberías ver una lista vacía (o usuarios de prueba)
3. Cuando uses la app, los usuarios aparecerán aquí automáticamente

## 🔍 Verificación Final

Antes de usar la app, verifica:

- [ ] Proyecto creado en Supabase
- [ ] SQL ejecutado sin errores críticos
- [ ] Tablas visibles en Table Editor
- [ ] Políticas RLS creadas
- [ ] Credenciales copiadas (URL y anon key)
- [ ] Variables de entorno configuradas en `.env.local`

## 🐛 Solución de Problemas

### Error: "relation does not exist"
**Causa**: Las tablas no se crearon  
**Solución**: Vuelve a ejecutar `supabase/schema.sql` completo

### Error: "permission denied"
**Causa**: RLS no está configurado correctamente  
**Solución**: Verifica que las políticas se crearon en la pestaña "Policies"

### Error: "invalid API key"
**Causa**: La clave en `.env.local` es incorrecta  
**Solución**: 
1. Ve a Supabase → Settings → API
2. Copia la **anon public key** nuevamente
3. Actualiza `.env.local`
4. Reinicia el servidor (`npm run dev`)

### No puedo iniciar sesión
**Causa**: El correo no existe en Supabase Auth o no está confirmado  
**Solución**: 
1. Ve a Authentication → Users
2. Verifica que el correo esté registrado y con estado **Confirmed**

## 📊 Estructura de Datos

### Tabla: users
- `id`: UUID (referencia a auth.users)
- `email`: Texto
- `full_name`: Texto (opcional)
- `anonymous_mode`: Boolean
- `location_enabled`: Boolean
- `notifications_enabled`: Boolean

### Tabla: alerts
- `id`: UUID
- `user_id`: UUID (FK a users)
- `latitude`: Decimal
- `longitude`: Decimal
- `location_text`: Texto (opcional)
- `is_active`: Boolean
- `created_at`: Timestamp

### Tabla: suspicious_reports
- `id`: UUID
- `user_id`: UUID (FK a users)
- `category`: Texto (persona_desconocida, vehiculo_sospechoso, etc.)
- `description`: Texto (opcional)
- `latitude`: Decimal
- `longitude`: Decimal
- `location_text`: Texto (opcional)
- `created_at`: Timestamp

## 🔐 Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ Usuarios solo ven/editan sus propios datos
- ✅ Alertas y reportes visibles para todos los autenticados
- ✅ Modo anónimo disponible para privacidad

## 📈 Próximos Pasos

Una vez configurado:
1. Prueba crear un usuario desde la app
2. Verifica que aparece en Supabase → Authentication → Users
3. Prueba enviar una alerta
4. Verifica que aparece en Table Editor → alerts
5. Prueba el historial en tiempo real

---

**¿Problemas?** Revisa los logs en:
- Consola del navegador (F12)
- Supabase → Logs → API Logs

