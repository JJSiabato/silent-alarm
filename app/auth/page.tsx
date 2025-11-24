'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', // Importante para que las cookies se establezcan
      });

      let data: { success?: boolean; error?: string } | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo iniciar sesión.');
      }

      if (!data?.success) {
        throw new Error('Respuesta inválida del servidor. Intenta de nuevo.');
      }

      setMessage('Acceso concedido. Redirigiendo...');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: any) {
      setError(error.message || 'No se pudo iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Vereda Segura
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Ingresa con tu correo electrónico
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
              }}
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>

      <div className="text-center" style={{ marginTop: '2rem', color: '#6b7280' }}>
        <p style={{ fontSize: '0.9rem' }}>
          Si el correo está autorizado en la base de datos, podrás ingresar de inmediato.
        </p>
      </div>
    </div>
  );
}

