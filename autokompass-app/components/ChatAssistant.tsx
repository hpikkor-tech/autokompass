'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Kompu } from './Kompu';
import { Icon } from './icons';

const SVCMAP: [string[], string, string][] = [
  [['rikketuli', 'kontrolltuli', 'mootorituli', 'veakood', 'tõrge', 'diagnostika'], 'diagnostika', 'Rikkediagnostika'],
  [['rehv', 'rehvi', 'kummid', 'kumm', 'hoiust'], 'rehvivahetus', 'Rehvivahetus'],
  [['pidur', 'piduri', 'kriuks', 'klots'], 'piduriklotsid', 'Piduriklotside vahetus'],
  [['õli', 'õlivahetus', 'määre'], 'olivahetus', 'Õlivahetus'],
  [['kliima', 'jahuta', 'konditsioneer', 'külm'], 'kliima', 'Kliimaseadme hooldus'],
  [['rool', 'väristab', 'vedrustus', 'amort', 'logiseb', 'koliseb', 'raputab'], 'vedrustus', 'Rooliotsad ja vedrustus'],
  [['ülevaatus'], 'ulevaatus', 'Ülevaatuse eelkontroll'],
  [['mootor', 'hammasrihm'], 'mootoriremont', 'Mootoriremont'],
];
const CITIES = ['Tallinn', 'Tartu', 'Pärnu', 'Narva', 'Rakvere', 'Viljandi', 'Kohtla-Järve', 'Kuressaare', 'Haapsalu', 'Võru'];
const PROBLEMS = ['Mootori rikketuli põleb', 'Rehvivahetus + hoiustamine', 'Piduriklotsid kriuksuvad', 'Kliima ei jahuta', 'Väristab roolis', 'Õli on vaja vahetada', 'Ülevaatus tuleb peale'];

function detectSvc(t: string) { const s = t.toLowerCase(); for (const [kw, slug, name] of SVCMAP) for (const k of kw) if (s.includes(k)) return { slug, name }; return null; }
function detectCity(t: string) { const s = t.toLowerCase(); return CITIES.find((c) => s.includes(c.toLowerCase())) || ''; }

type Msg = { who: 'bot' | 'me'; text: string; svc?: string; city?: string; count?: string };

export function ChatAssistant() {
  const router = useRouter();
  const [loc, setLoc] = useState('');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([{ who: 'bot', text: 'Tere! Olen Kompu, Autokompassi abiline. Sisesta üleval oma asukoht ja kirjelda muret oma sõnadega — leian sulle lähimad sobivad töökojad ning ütlen, miks just need.' }]);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [msgs]);

  function send(text?: string) {
    const t = (text ?? input).trim(); if (!t) return;
    setInput('');
    const svc = detectSvc(t); const city = detectCity(t) || detectCity(loc);
    const reply: Msg = svc
      ? { who: 'bot', text: `Kõlab nagu vajad teenust: **${svc.name}**.${city ? ` Linnas **${city}**.` : ''}${loc ? ` Otsin sinu lähedalt (${loc}).` : ''}`, svc: svc.slug, city, count: 'Vaata sobivad töökojad' }
      : { who: 'bot', text: 'Räägi natuke täpsemalt — nt „pidurid kriuksuvad" või „mootori rikketuli põleb". Või vali kiirvalik allpool.' };
    setMsgs((m) => [...m, { who: 'me', text: t }]);
    setTimeout(() => setMsgs((m) => [...m, reply]), 350);
  }
  function goList(svc?: string, city?: string) {
    const p = new URLSearchParams(); if (svc) p.set('svc', svc); if (city) p.set('city', city);
    router.push('/tookojad?' + p.toString());
  }
  function fmt(t: string) { return t.split('**').map((part, i) => i % 2 ? <b key={i} style={{ color: 'var(--blue)' }}>{part}</b> : part); }

  return (
    <div className="chatbox">
      <div className="chathead">
        <div className="av"><Kompu eyes="happy" mouth="smile" arms="down" /></div>
        <div><div className="cn">Kompu</div><div className="cs">Autokompassi abiline · vastab kohe</div></div>
      </div>
      <div className="chatloc"><Icon.pin /><span className="lb">Sinu asukoht</span>
        <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="nt Algi tn 34, Tallinn — näitan lähimaid" />
      </div>
      <div className="chatlog" ref={logRef}>
        {msgs.map((m, i) => (
          <div key={i} className={'msg ' + m.who}>
            {m.who === 'bot' && <div className="mav"><Kompu eyes="normal" mouth="smile" arms="down" /></div>}
            <div className="bub">{fmt(m.text)}
              {m.count && <div style={{ marginTop: 10 }}><button className="btn btn-g btn-sm" onClick={() => goList(m.svc, m.city)}>{m.count} <Icon.arwr /></button></div>}
            </div>
          </div>
        ))}
      </div>
      <div className="chatchips">{PROBLEMS.map((p) => <button key={p} className="chip" onClick={() => send(p)}><Icon.bolt /> {p}</button>)}</div>
      <div className="chatinput">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Nt. mootori rikketuli süttis ja auto väristab..." />
        <button onClick={() => send()} aria-label="Saada"><Icon.send /></button>
      </div>
    </div>
  );
}
