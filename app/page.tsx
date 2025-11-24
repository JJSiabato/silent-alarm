import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('user_email')?.value;

  if (!userEmail) {
    redirect('/auth');
  }

  // Crear un objeto de usuario simple para mantener compatibilidad
  const user = {
    email: userEmail,
    id: userEmail, // Usar el email como ID temporalmente
  };

  return <HomeClient user={user as any} />;
}

