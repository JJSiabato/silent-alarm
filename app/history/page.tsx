'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface Alert {
  id: string;
  user_display_name: string;
  latitude: number;
  longitude: number;
  location_text: string | null;
  is_active: boolean;
  created_at: string;
}

interface Report {
  id: string;
  user_display_name: string;
  category: string;
  description: string | null;
  latitude: number;
  longitude: number;
  location_text: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  persona_desconocida: '👤 Persona desconocida',
  vehiculo_sospechoso: '🚗 Vehículo sospechoso',
  ruido_extraño: '🔊 Ruido extraño',
  otro: '❓ Otro',
};

export default function HistoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'reports'>('alerts');

  useEffect(() => {
    loadData();
    
    // Suscribirse a cambios en tiempo real
    const alertsChannel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => {
          loadData();
        }
      )
      .subscribe();

    const reportsChannel = supabase
      .channel('reports_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'suspicious_reports' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(reportsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      // Cargar alertas
      const { data: alertsData, error: alertsError } = await supabase
        .from('recent_alerts_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsError) throw alertsError;

      // Cargar reportes
      const { data: reportsData, error: reportsError } = await supabase
        .from('recent_reports_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (reportsError) throw reportsError;

      setAlerts(alertsData || []);
      setReports(reportsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy 'a las' HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Historial
        </h1>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            flex: 1,
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: activeTab === 'alerts' ? '#dc2626' : '#e5e7eb',
            color: activeTab === 'alerts' ? 'white' : '#374151',
            cursor: 'pointer',
          }}
        >
          Alertas ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            flex: 1,
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: activeTab === 'reports' ? '#dc2626' : '#e5e7eb',
            color: activeTab === 'reports' ? 'white' : '#374151',
            cursor: 'pointer',
          }}
        >
          Reportes ({reports.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Cargando...</p>
        </div>
      ) : activeTab === 'alerts' ? (
        <div>
          {alerts.length === 0 ? (
            <div className="card text-center">
              <p style={{ color: '#6b7280' }}>No hay alertas recientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>🚨 Alerta</strong>
                  {alert.is_active && (
                    <span
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      Activa
                    </span>
                  )}
                </div>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Por: {alert.user_display_name}
                </p>
                {alert.location_text && (
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    📍 {alert.location_text}
                  </p>
                )}
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {formatDate(alert.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {reports.length === 0 ? (
            <div className="card text-center">
              <p style={{ color: '#6b7280' }}>No hay reportes recientes</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="card">
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {CATEGORY_LABELS[report.category] || report.category}
                  </strong>
                </div>
                {report.description && (
                  <p style={{ marginBottom: '0.5rem', color: '#374151' }}>
                    {report.description}
                  </p>
                )}
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Por: {report.user_display_name}
                </p>
                {report.location_text && (
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    📍 {report.location_text}
                  </p>
                )}
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {formatDate(report.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      )}

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

