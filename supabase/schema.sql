    -- ============================================
    -- ESQUEMA COMPLETO PARA VEREDA SEGURA
    -- ============================================
    -- Este archivo contiene todas las tablas, políticas RLS,
    -- índices y configuraciones necesarias para la aplicación.
    -- Ejecutar en el SQL Editor de Supabase.
    -- ============================================

    -- ============================================
    -- 1. TABLA: users (perfiles de usuario)
    -- ============================================
    CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT,
        full_name TEXT,
        phone TEXT,
        anonymous_mode BOOLEAN DEFAULT false,
        location_enabled BOOLEAN DEFAULT true,
        notifications_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Índices para users
    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

    -- ============================================
    -- 2. TABLA: alerts (alertas silenciosas)
    -- ============================================
    CREATE TABLE IF NOT EXISTS public.alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        location_text TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
    );

    -- Índices para alerts
    CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON public.alerts(is_active);
    CREATE INDEX IF NOT EXISTS idx_alerts_location ON public.alerts(latitude, longitude);

    -- ============================================
    -- 3. TABLA: suspicious_reports (reportes sospechosos)
    -- ============================================
    CREATE TABLE IF NOT EXISTS public.suspicious_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        category TEXT NOT NULL CHECK (category IN ('persona_desconocida', 'vehiculo_sospechoso', 'ruido_extraño', 'otro')),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        location_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Índices para suspicious_reports
    CREATE INDEX IF NOT EXISTS idx_suspicious_reports_user_id ON public.suspicious_reports(user_id);
    CREATE INDEX IF NOT EXISTS idx_suspicious_reports_created_at ON public.suspicious_reports(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_suspicious_reports_category ON public.suspicious_reports(category);
    CREATE INDEX IF NOT EXISTS idx_suspicious_reports_location ON public.suspicious_reports(latitude, longitude);

    -- ============================================
    -- 4. TABLA: push_tokens (tokens para notificaciones push)
    -- ============================================
    CREATE TABLE IF NOT EXISTS public.push_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        device_info JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Índices para push_tokens
    CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_push_tokens_token ON public.push_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_push_tokens_is_active ON public.push_tokens(is_active);

    -- ============================================
    -- 5. FUNCIÓN: Actualizar updated_at automáticamente
    -- ============================================
    CREATE OR REPLACE FUNCTION public.handle_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger para users
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();

    -- Trigger para push_tokens
    CREATE TRIGGER update_push_tokens_updated_at
        BEFORE UPDATE ON public.push_tokens
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();

    -- ============================================
    -- 6. FUNCIÓN: Crear perfil de usuario automáticamente
    -- ============================================
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO public.users (id, email, full_name)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario')
        );
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger para crear perfil cuando se registra un usuario
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();

    -- ============================================
    -- 7. HABILITAR ROW LEVEL SECURITY (RLS)
    -- ============================================
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.suspicious_reports ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

    -- ============================================
    -- 8. POLÍTICAS RLS PARA users
    -- ============================================

    -- Lectura: Los usuarios pueden ver su propio perfil
    CREATE POLICY "Users can view own profile"
        ON public.users
        FOR SELECT
        USING (auth.uid() = id);

    -- Actualización: Los usuarios pueden actualizar su propio perfil
    CREATE POLICY "Users can update own profile"
        ON public.users
        FOR UPDATE
        USING (auth.uid() = id);

    -- Inserción: Solo el trigger puede insertar (ya manejado por handle_new_user)
    CREATE POLICY "Users can insert own profile"
        ON public.users
        FOR INSERT
        WITH CHECK (auth.uid() = id);

    -- ============================================
    -- 9. POLÍTICAS RLS PARA alerts
    -- ============================================

    -- Lectura: Todos los usuarios autenticados pueden ver todas las alertas activas
    CREATE POLICY "Authenticated users can view all alerts"
        ON public.alerts
        FOR SELECT
        USING (auth.role() = 'authenticated' AND is_active = true);

    -- Inserción: Los usuarios pueden crear sus propias alertas
    CREATE POLICY "Users can create own alerts"
        ON public.alerts
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);

    -- Actualización: Los usuarios pueden actualizar sus propias alertas
    CREATE POLICY "Users can update own alerts"
        ON public.alerts
        FOR UPDATE
        USING (auth.uid() = user_id);

    -- ============================================
    -- 10. POLÍTICAS RLS PARA suspicious_reports
    -- ============================================

    -- Lectura: Todos los usuarios autenticados pueden ver todos los reportes
    CREATE POLICY "Authenticated users can view all reports"
        ON public.suspicious_reports
        FOR SELECT
        USING (auth.role() = 'authenticated');

    -- Inserción: Los usuarios pueden crear sus propios reportes
    CREATE POLICY "Users can create own reports"
        ON public.suspicious_reports
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);

    -- Actualización: Los usuarios pueden actualizar sus propios reportes
    CREATE POLICY "Users can update own reports"
        ON public.suspicious_reports
        FOR UPDATE
        USING (auth.uid() = user_id);

    -- ============================================
    -- 11. POLÍTICAS RLS PARA push_tokens
    -- ============================================

    -- Lectura: Los usuarios pueden ver sus propios tokens
    CREATE POLICY "Users can view own push tokens"
        ON public.push_tokens
        FOR SELECT
        USING (auth.uid() = user_id);

    -- Inserción: Los usuarios pueden crear sus propios tokens
    CREATE POLICY "Users can create own push tokens"
        ON public.push_tokens
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);

    -- Actualización: Los usuarios pueden actualizar sus propios tokens
    CREATE POLICY "Users can update own push tokens"
        ON public.push_tokens
        FOR UPDATE
        USING (auth.uid() = user_id);

    -- Eliminación: Los usuarios pueden eliminar sus propios tokens
    CREATE POLICY "Users can delete own push tokens"
        ON public.push_tokens
        FOR DELETE
        USING (auth.uid() = user_id);

    -- ============================================
    -- 12. VISTA: Alertas recientes con información del usuario
    -- ============================================
    CREATE OR REPLACE VIEW public.recent_alerts_view AS
    SELECT 
        a.id,
        a.user_id,
        CASE 
            WHEN u.anonymous_mode = true THEN 'Usuario anónimo'
            ELSE COALESCE(u.full_name, u.email, 'Usuario')
        END as user_display_name,
        a.latitude,
        a.longitude,
        a.location_text,
        a.is_active,
        a.created_at,
        a.resolved_at
    FROM public.alerts a
    LEFT JOIN public.users u ON a.user_id = u.id
    WHERE a.is_active = true
    ORDER BY a.created_at DESC;

-- Nota: Las vistas heredan automáticamente las políticas RLS de las tablas subyacentes
-- No es necesario crear políticas RLS directamente en las vistas

-- ============================================
-- 13. VISTA: Reportes recientes con información del usuario
-- ============================================
    CREATE OR REPLACE VIEW public.recent_reports_view AS
    SELECT 
        sr.id,
        sr.user_id,
        CASE 
            WHEN u.anonymous_mode = true THEN 'Usuario anónimo'
            ELSE COALESCE(u.full_name, u.email, 'Usuario')
        END as user_display_name,
        sr.category,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.location_text,
        sr.created_at
    FROM public.suspicious_reports sr
    LEFT JOIN public.users u ON sr.user_id = u.id
    ORDER BY sr.created_at DESC;

-- Nota: Las vistas heredan automáticamente las políticas RLS de las tablas subyacentes
-- Las políticas de las tablas 'alerts' y 'suspicious_reports' ya permiten
-- que usuarios autenticados vean los datos, por lo que las vistas funcionarán correctamente

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================
    -- Instrucciones:
    -- 1. Copiar y pegar este SQL completo en el SQL Editor de Supabase
    -- 2. Ejecutar todo el script
    -- 3. Verificar que todas las tablas, políticas y funciones se crearon correctamente
    -- 4. Configurar las variables de entorno en .env.local
    -- ============================================

