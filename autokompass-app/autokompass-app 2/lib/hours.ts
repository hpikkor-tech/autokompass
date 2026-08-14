// Lihtne OSM opening_hours parser (katab levinud juhud: "Mo-Fr 09:00-18:00; Sa 10:00-15:00", "24/7").
const DAY: Record<string, number> = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };

function parseDays(spec: string): number[] {
  const out: number[] = [];
  for (const part of spec.split(',')) {
    const p = part.trim();
    const range = p.match(/^([A-Za-z]{2})-([A-Za-z]{2})$/);
    if (range) {
      const a = DAY[range[1]], b = DAY[range[2]];
      if (a == null || b == null) continue;
      for (let d = a; ; d = (d + 1) % 7) { out.push(d); if (d === b) break; }
    } else if (DAY[p] != null) {
      out.push(DAY[p]);
    }
  }
  return out;
}

export type HoursStatus = { open: boolean; text: string };

export function todayStatus(oh: string | null | undefined, now: Date): HoursStatus | null {
  if (!oh) return null;
  if (/24\s*\/\s*7/.test(oh)) return { open: true, text: 'Avatud ööpäevaringselt' };
  const dow = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  let opensLaterToday: string | null = null;
  for (const rule of oh.split(';')) {
    const m = rule.trim().match(/^([A-Za-z][A-Za-z,\- ]*?)\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!m) continue;
    const days = parseDays(m[1].replace(/\s+/g, ''));
    if (!days.includes(dow)) continue;
    const start = +m[2] * 60 + +m[3];
    const end = +m[4] * 60 + +m[5];
    const untilTxt = `${m[4].padStart(2, '0')}:${m[5]}`;
    if (mins >= start && mins < end) return { open: true, text: `Avatud kuni ${untilTxt}` };
    if (mins < start) opensLaterToday = `${m[2].padStart(2, '0')}:${m[3]}`;
  }
  if (opensLaterToday) return { open: false, text: `Avatud kl ${opensLaterToday}` };
  return { open: false, text: 'Praegu suletud' };
}

// Kompaktne inimloetav lahtiolek (nt "E–R 9–18") esimesest reeglist.
export function compactHours(oh: string | null | undefined): string | null {
  if (!oh) return null;
  if (/24\s*\/\s*7/.test(oh)) return '24/7';
  const first = oh.split(';')[0].trim();
  return first
    .replace(/Mo/g, 'E').replace(/Tu/g, 'T').replace(/We/g, 'K').replace(/Th/g, 'N')
    .replace(/Fr/g, 'R').replace(/Sa/g, 'L').replace(/Su/g, 'P')
    .replace(/:00/g, '');
}
