import { AuthPanel } from '@/components/AuthPanel';

export const metadata = { title: 'Sisene | Autokompass' };

export default function SisenePage({ searchParams }: { searchParams: { mode?: string; next?: string } }) {
  const mode = searchParams.mode === 'shop' ? 'shop' : 'client';
  return <AuthPanel initialMode={mode} next={searchParams.next ?? '/'} />;
}
