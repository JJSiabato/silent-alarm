import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PWARegister from '@/components/PWARegister';
import GlobalNotifications from '@/components/GlobalNotifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vereda Segura',
  description: 'Sistema de alertas comunitarias para zonas rurales',
  manifest: '/manifest.json',
  themeColor: '#dc2626',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vereda Segura',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className={inter.className}>
        <PWARegister />
        <GlobalNotifications />
        {children}
      </body>
    </html>
  );
}

