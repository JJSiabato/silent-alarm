'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UserSettings {
  anonymous_mode: boolean;
  location_enabled: boolean;
  notifications_enabled: boolean;
  full_name: string | null;
  phone: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    anonymous_mode: false,
    location_enabled: true,
    notifications_enabled: true,
    full_name: null,
    phone: null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    try {
      // Obtener el usuario actual desde la API
      const userResponse = await fetch('/api/user', {
        credentials: 'include',
      });

      if (!userResponse.ok) {
        router.push('/auth');
        return;
      }

      const { user } = await userResponse.json();

      if (!user) {
        router.push('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          anonymous_mode: data.anonymous_mode || false,
          location_enabled: data.location_enabled ?? true,
          notifications_enabled: data.notifications_enabled ?? true,
          full_name: data.full_name || null,
          phone: data.phone || null,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Obtener el usuario actual desde la API
      const userResponse = await fetch('/api/user', {
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Usuario no autenticado');
      }

      const { user } = await userResponse.json();

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('users')
        .update({
          anonymous_mode: settings.anonymous_mode,
          location_enabled: settings.location_enabled,
          notifications_enabled: settings.notifications_enabled,
          full_name: settings.full_name || null,
          phone: settings.phone || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Configuración guardada exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="loading">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Configuración
        </h1>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="full_name"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
            }}
          >
            Nombre completo (opcional)
          </label>
          <input
            id="full_name"
            type="text"
            value={settings.full_name || ''}
            onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
            placeholder="Tu nombre"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="phone"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
            }}
          >
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            value={settings.phone || ''}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            placeholder="Tu teléfono"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.anonymous_mode}
              onChange={(e) =>
                setSettings({ ...settings, anonymous_mode: e.target.checked })
              }
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '600' }}>
              Modo anónimo (tu nombre no se mostrará en alertas)
            </span>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.location_enabled}
              onChange={(e) =>
                setSettings({ ...settings, location_enabled: e.target.checked })
              }
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '600' }}>
              Permitir acceso a ubicación
            </span>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications_enabled: e.target.checked,
                })
              }
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '600' }}>
              Recibir notificaciones
            </span>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      <button
        onClick={() => router.push('/')}
        className="btn-secondary"
        style={{ marginTop: '1rem' }}
      >
        ← Volver al inicio
      </button>
    </div>
  );
}

