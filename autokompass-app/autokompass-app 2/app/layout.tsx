import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Autokompass — võrdle autotöökodi, säästa aega ja raha',
  description: 'Eesti autotöökodade kataloog. Võrdle hindu, arvustusi ja vaba aega üle 1200 töökoja seast. Kontrollitud arvustused, kliendile tasuta.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autokompass.ee'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
