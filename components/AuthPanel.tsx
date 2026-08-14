'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mark, Icon } from './icons';
import { Kompu } from './Kompu';
import { createClient } from '@/lib/supabase/client';

const COPY = {
  client: {
    h: 'Logi sisse või registreeru', s: 'Jäta arvustusi, salvesta lemmiktöökojad ja halda oma päringuid ühest kohast.',
    swa: 'Loo tasuta konto', rh: 'Leia usaldusväärne töökoda ja jäta oma hinnang.',
    rp: 'Registreeru, et jätta kontrollitud arvustusi ja aidata teistel autojuhtidel teha õige valik.',
    pts: ['Jäta töökodadele arvustusi', 'Salvesta lemmiktöökojad', 'Halda oma päringuid ühest kohast'],
  },
  shop: {
    h: 'Tere tulemast tagasi', s: 'Logi sisse, et hallata oma töökoja profiili ja päringuid.',
    swa: 'Loo töökoja konto', rh: 'Too oma töökoda sinna, kus kliendid otsivad.',
    rp: 'Liitu 1 240 töökojaga, kes juba saavad Autokompassist päringuid.',
    pts: ['Tasuta profiil ja päringud', 'Statistika kliendipäringutest', 'Esiletõst, kui soovid rohkem kliente'],
  },
};

export function AuthPanel({ initialMode, next }: { initialMode: 'client' | 'shop'; next: string }) {
  const [mode, setMode] = useState<'client' | 'shop'>(initialMode);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [signup, setSignup] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const c = COPY[mode];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const supabase = createClient();
    const fn = signup
      ? supabase.auth.signUp({ email, password: pw, options: { data: { role: mode } } })
      : supabase.auth.signInWithPassword({ email, password: pw });
    const { error } = await fn;
    setBusy(false);
    if (error) setErr(error.message);
    else window.location.href = next;
  }

  async function google() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + next } });
  }

  return (
    <main className="auth">
      <div className="left">
        <div className="authcard">
          <Link href="/" className="brand"><Mark /><span className="wm">Autokompass<i>.ee</i></span></Link>
          <div className="authtabs">
            <button className={'atab' + (mode === 'client' ? ' on' : '')} onClick={() => setMode('client')}>Olen klient</button>
            <button className={'atab' + (mode === 'shop' ? ' on' : '')} onClick={() => setMode('shop')}>Olen töökoda</button>
          </div>
          <h1 style={{ fontSize: 30 }}>{c.h}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, margin: '8px 0 20px' }}>{c.s}</p>
          <form onSubmit={submit}>
            <div className="field"><label>E-post</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sinu@email.ee" required /></div>
            <div className="field"><label>Parool</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" required /></div>
            {err && <p className="msg-err">{err}</p>}
            <button className="btn btn-p btn-block" style={{ marginTop: 8 }} disabled={busy}>{busy ? '...' : (signup ? 'Loo konto' : 'Sisene')}</button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0', color: 'var(--muted-2)', fontSize: 13, fontWeight: 600 }}>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />või jätka<span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          <button className="btn btn-o btn-block" onClick={google} style={{ marginBottom: 20 }}>Jätka Google'iga</button>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14.5 }}>
            {signup ? 'On juba konto? ' : 'Uus siin? '}
            <a style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setSignup(!signup)}>
              {signup ? 'Logi sisse' : c.swa}
            </a>
          </p>
        </div>
      </div>
      <div className="right">
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 420 }}>
          <div style={{ width: 130, marginBottom: 22 }}><Kompu eyes="happy" mouth="bigsmile" arms="wave" /></div>
          <h2>{c.rh}</h2>
          <p>{c.rp}</p>
          <div style={{ marginTop: 26 }}>
            {c.pts.map((p) => <div className="pt" key={p}><Icon.check /> {p}</div>)}
          </div>
        </div>
      </div>
    </main>
  );
}
