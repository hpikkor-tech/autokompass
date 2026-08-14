'use client';
import { useEffect, useState } from 'react';
import { todayStatus } from '@/lib/hours';

// Näitab lahtiolekut kliendi kellaaja järgi (ISR-cache ei muuda seda valeks).
export function OpenStatus({ hours }: { hours: string | null }) {
  const [txt, setTxt] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    setTxt(todayStatus(hours, new Date()));
  }, [hours]);
  if (!txt) return null;
  return <span className={'ohstat ' + (txt.open ? 'on' : 'off')}>{txt.text}</span>;
}
