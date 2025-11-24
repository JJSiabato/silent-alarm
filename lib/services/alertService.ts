export interface Location {
  latitude: number;
  longitude: number;
  locationText?: string;
}

export async function getLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no está disponible en este navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Intentar obtener texto de ubicación (opcional)
        let locationText = '';
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) {
            locationText = data.display_name;
          }
        } catch (error) {
          // Si falla, simplemente no incluimos el texto
        }

        resolve({
          latitude,
          longitude,
          locationText: locationText || undefined,
        });
      },
      (error) => {
        reject(new Error('Error al obtener la ubicación: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export async function sendAlert(location: Location) {
  // Enviar la alerta a través del endpoint API del servidor
  const response = await fetch('/api/alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      location_text: location.locationText,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Error al enviar la alerta');
  }

  const result = await response.json();
  return result;
}

