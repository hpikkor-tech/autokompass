import './globals.css';
import './filters.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Autokompass — võrdle autotöökodi, säästa aega ja raha',
  description: 'Eesti autotöökodade kataloog. Võrdle teenuseid, arvustusi ja kontaktinfot 1500+ töökoja seast üle Eesti. Kliendile tasuta.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autokompass.ee'), openGraph: { title: 'Autokompass — võrdle autotöökodi, säästa aega ja raha', description: 'Eesti autotöökodade kataloog. 1500+ töökoda, 105 linna ja valda. Kliendile tasuta.', url: 'https://autokompass.ee', siteName: 'Autokompass', locale: 'et_EE', type: 'website', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Autokompass — Eesti autotöökodade kataloog' }] }, twitter: { card: 'summary_large_image', title: 'Autokompass — võrdle autotöökodi, säästa aega ja raha', description: 'Eesti autotöökodade kataloog. 1500+ töökoda, 105 linna ja valda. Kliendile tasuta.', images: ['/og.jpg'] },
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
