'use client';
import { useEffect, useRef } from 'react';

type Pt = { name: string; lat: number; lng: number; slug: string; city: string | null };

const CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
const JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function ensureLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = CSS;
      document.head.appendChild(link);
    }
    let s = document.getElementById('leaflet-js') as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement('script');
      s.id = 'leaflet-js'; s.src = JS; s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener('load', () => resolve((window as any).L));
    s.addEventListener('error', reject);
  });
}

export function ListingMap({ points }: { points: Pt[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await ensureLeaflet();
      if (cancelled || !ref.current) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const pts = points.filter((p) => p.lat && p.lng);
      const map = L.map(ref.current, { scrollWheelZoom: false });
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap',
      }).addTo(map);
      const icon = L.divIcon({ className: 'akpin', html: '<span></span>', iconSize: [16, 16], iconAnchor: [8, 8] });
      const ms: any[] = [];
      pts.forEach((p) => {
        const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
        m.bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.city || '')}<br><a href="/tookoda/${p.slug}">Vaata profiili →</a>`);
        ms.push(m);
      });
      if (pts.length) {
        map.fitBounds(L.featureGroup(ms).getBounds().pad(0.25));
      } else {
        map.setView([58.7, 25.5], 7);
      }
      setTimeout(() => map.invalidateSize(), 100);
    })();
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [points]);

  return <div className="listmap" ref={ref} aria-label="Töökodade kaart" />;
}
