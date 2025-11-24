'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocation } from '@/lib/services/alertService';

const CATEGORIES = [
  { value: 'persona_desconocida', label: '👤 Persona desconocida' },
  { value: 'vehiculo_sospechoso', label: '🚗 Vehículo sospechoso' },
  { value: 'ruido_extraño', label: '🔊 Ruido extraño' },
  { value: 'otro', label: '❓ Otro' },
];

export default function ReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Obtener ubicación
      const location = await getLocation();

      // Enviar el reporte a través del endpoint API del servidor
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category,
          description: description || null,
          latitude: location.latitude,
          longitude: location.longitude,
          location_text: location.locationText || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      if (err.message.includes('geolocation')) {
        setError('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación.');
      } else {
        setError(err.message || 'Error al guardar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Reportar Actividad Sospechosa
        </h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && (
        <div className="success">
          ¡Reporte enviado exitosamente! Redirigiendo...
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '1.1rem',
              }}
            >
              Tipo de actividad
            </label>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  textAlign: 'left',
                  border: category === cat.value ? '3px solid #dc2626' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: category === cat.value ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '1.1rem',
              }}
            >
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo que observaste..."
              rows={4}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !category || success}
          >
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>

      <button
        onClick={() => router.back()}
        className="btn-secondary"
        style={{ marginTop: '1rem' }}
      >
        ← Volver
      </button>
    </div>
  );
}

