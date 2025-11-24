'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface AlertNotification {
  id: string;
  message: string;
  location?: string;
  timestamp: Date;
  type: 'alert' | 'report'; // 'alert' para alertas silenciosas, 'report' para reportes sospechosos
}

export default function GlobalNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Obtener el user_id real desde la base de datos y conectar Socket.IO
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const { user: userData } = await response.json();
          setUserId(userData.id);
        }
      } catch (error) {
        console.error('Error obteniendo user_id:', error);
      }
    };

    fetchUserId();

    // Conectar a Socket.IO solo si estamos en desarrollo o si hay un servidor disponible
    // En producción (Vercel), intentar conectar pero si falla, usar polling
    const socketInstance = io(window.location.origin, {
      transports: ['polling', 'websocket'], // Priorizar polling para Vercel
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket.IO conectado');
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('Socket.IO no disponible, usando polling HTTP:', error.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const playNotificationSound = () => {
    try {
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Crear un oscilador para generar el sonido
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Conectar el oscilador al nodo de ganancia y al destino
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar el tipo de onda (sine para un sonido suave)
      oscillator.type = 'sine';
      
      // Frecuencia del sonido (Hz) - un tono de notificación
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      // Configurar el volumen (ganancia)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      // Reproducir el sonido
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error reproduciendo sonido de notificación:', error);
    }
  };

  // Escuchar eventos de nuevas alertas y reportes (Socket.IO)
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewAlert = (alertData: any) => {
      // No mostrar notificación si es la alerta del usuario actual
      if (alertData.user_id === userId) {
        return;
      }

      // Crear notificación de alerta silenciosa (roja)
      const notification: AlertNotification = {
        id: alertData.id,
        message: '🚨 Nueva alerta silenciosa',
        location: alertData.location_text || 'Ubicación cercana',
        timestamp: new Date(),
        type: 'alert',
      };

      setNotifications((prev) => [...prev, notification]);

      // Reproducir sonido de notificación
      playNotificationSound();

      // Eliminar la notificación después de 3 minutos (180000ms)
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 180000); // 3 minutos
    };

    const handleNewReport = (reportData: any) => {
      // No mostrar notificación si es el reporte del usuario actual
      if (reportData.user_id === userId) {
        return;
      }

      // Crear notificación de reporte sospechoso (amarilla)
      const categoryLabels: Record<string, string> = {
        persona_desconocida: '👤 Persona desconocida',
        vehiculo_sospechoso: '🚗 Vehículo sospechoso',
        ruido_extraño: '🔊 Ruido extraño',
        otro: '❓ Otro',
      };

      const categoryLabel = categoryLabels[reportData.category] || 'Actividad sospechosa';

      const notification: AlertNotification = {
        id: reportData.id,
        message: `⚠️ ${categoryLabel}`,
        location: reportData.location_text || 'Ubicación cercana',
        timestamp: new Date(),
        type: 'report',
      };

      setNotifications((prev) => [...prev, notification]);

      // Reproducir sonido de notificación
      playNotificationSound();

      // Eliminar la notificación después de 3 minutos (180000ms)
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 180000); // 3 minutos
    };

    socket.on('new_alert', handleNewAlert);
    socket.on('new_report', handleNewReport);

    return () => {
      socket.off('new_alert', handleNewAlert);
      socket.off('new_report', handleNewReport);
    };
  }, [socket, userId]);

  // Polling HTTP como fallback cuando Socket.IO no está disponible (Vercel)
  useEffect(() => {
    if (!userId) return;

    let pollingInterval: NodeJS.Timeout | null = null;
    let lastAlertCheck = new Date();
    let lastReportCheck = new Date();

    // Si no hay socket conectado después de 3 segundos, activar polling
    const checkSocket = setTimeout(() => {
      if (!socket || !socket.connected) {
        console.log('Socket.IO no disponible, usando polling HTTP');
        
        const categoryLabels: Record<string, string> = {
          persona_desconocida: '👤 Persona desconocida',
          vehiculo_sospechoso: '🚗 Vehículo sospechoso',
          ruido_extraño: '🔊 Ruido extraño',
          otro: '❓ Otro',
        };
        
        pollingInterval = setInterval(async () => {
          try {
            // Verificar nuevas alertas
            const alertsResponse = await fetch(`/api/alerts/check?since=${lastAlertCheck.toISOString()}`, {
              credentials: 'include',
            });
            if (alertsResponse.ok) {
              const { alerts } = await alertsResponse.json();
              alerts.forEach((alert: any) => {
                if (alert.user_id !== userId) {
                  const notification: AlertNotification = {
                    id: alert.id,
                    message: '🚨 Nueva alerta silenciosa',
                    location: alert.location_text || 'Ubicación cercana',
                    timestamp: new Date(),
                    type: 'alert',
                  };
                  setNotifications((prev) => {
                    if (!prev.find(n => n.id === notification.id)) {
                      playNotificationSound();
                      return [...prev, notification];
                    }
                    return prev;
                  });
                  setTimeout(() => {
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    );
                  }, 180000);
                }
              });
              if (alerts.length > 0) {
                lastAlertCheck = new Date();
              }
            }

            // Verificar nuevos reportes
            const reportsResponse = await fetch(`/api/reports/check?since=${lastReportCheck.toISOString()}`, {
              credentials: 'include',
            });
            if (reportsResponse.ok) {
              const { reports } = await reportsResponse.json();
              reports.forEach((report: any) => {
                if (report.user_id !== userId) {
                  const categoryLabel = categoryLabels[report.category] || 'Actividad sospechosa';
                  const notification: AlertNotification = {
                    id: report.id,
                    message: `⚠️ ${categoryLabel}`,
                    location: report.location_text || 'Ubicación cercana',
                    timestamp: new Date(),
                    type: 'report',
                  };
                  setNotifications((prev) => {
                    if (!prev.find(n => n.id === notification.id)) {
                      playNotificationSound();
                      return [...prev, notification];
                    }
                    return prev;
                  });
                  setTimeout(() => {
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    );
                  }, 180000);
                }
              });
              if (reports.length > 0) {
                lastReportCheck = new Date();
              }
            }
          } catch (error) {
            console.error('Error en polling:', error);
          }
        }, 5000); // Verificar cada 5 segundos
      }
    }, 3000);

    return () => {
      clearTimeout(checkSocket);
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [userId, socket]);

  const handleCloseNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '400px',
        width: 'calc(100% - 2rem)',
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            backgroundColor: notification.type === 'alert' ? '#dc2626' : '#f59e0b', // Rojo para alertas, amarillo para reportes
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'slideIn 0.3s ease-out',
            cursor: 'pointer',
            position: 'relative',
            minWidth: '300px',
          }}
          onClick={() => router.push('/history')}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseNotification(notification.id);
            }}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: 0,
              lineHeight: '1',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', paddingRight: '2rem' }}>
            {notification.message}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            {notification.location}
          </div>
        </div>
      ))}
    </div>
  );
}

