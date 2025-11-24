'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendAlert, getLocation } from '@/lib/services/alertService';

interface User {
  email: string;
  id: string;
}

export default function HomeClient({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleSendAlert = async () => {
    setLoading(true);
    setLocationError('');

    try {
      const location = await getLocation();
      await sendAlert(location);
      
      // Redirigir a historial después de enviar alerta
      router.push('/history');
    } catch (error: any) {
      if (error.message.includes('geolocation')) {
        setLocationError('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación en tu navegador.');
      } else {
        setLocationError('Error al enviar la alerta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSignOut = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/auth';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Vereda Segura
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Sistema de alertas comunitarias
        </p>
      </div>

      {locationError && <div className="error">{locationError}</div>}

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={handleSendAlert}
          disabled={loading}
          className="btn-primary"
          style={{
            fontSize: '1.5rem',
            padding: '2rem',
            backgroundColor: loading ? '#9ca3af' : '#dc2626',
          }}
        >
          {loading ? 'Enviando alerta...' : '🚨 Enviar Alerta Silenciosa'}
        </button>

        <button
          onClick={() => router.push('/report')}
          className="btn-secondary"
        >
          📝 Reportar Actividad Sospechosa
        </button>

        <button
          onClick={() => router.push('/history')}
          className="btn-secondary"
        >
          📋 Ver Historial
        </button>

        <button
          onClick={() => router.push('/settings')}
          className="btn-secondary"
        >
          ⚙️ Configuración
        </button>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={handleSignOut}
          style={{
            background: 'none',
            color: '#6b7280',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

