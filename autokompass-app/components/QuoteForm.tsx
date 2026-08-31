'use client';
import { useState } from 'react';
import { Icon } from './icons';

export function QuoteForm({ workshopId, phone, address }:
  { workshopId: string; phone: string | null; address: string | null }) {
  const [msg, setMsg] = useState('');
  const [tel, setTel] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const res = await fetch('/api/quote', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshop_id: workshopId, message: msg, phone: tel }),
    });
    setState(res.ok ? 'done' : 'error');
  }

  return (
    <div className="qbox">
      <h3>Küsi pakkumist</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '6px 0 4px' }}>Kirjelda oma muret ja jäta telefon — aitame sul selle töökojaga ühendust saada. Tasuta ja mittesiduv.</p>
      {state === 'done' ? (
        <p className="msg-ok">Päring on kirjas. Võtame sinuga peagi ühendust.</p>
      ) : (
        <form onSubmit={submit}>
          <label>Mis su autol viga on?</label>
          <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Nt. mootori rikketuli süttis ja auto väristab tühikäigul..." required />
          <label>Sinu telefon</label>
          <input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+372 ..." required />
          <button className="btn btn-p btn-block" style={{ marginTop: 16 }} disabled={state === 'sending'}>
            {state === 'sending' ? 'Saadan...' : 'Saada päring'}
          </button>
          {state === 'error' && <p className="msg-err">Midagi läks valesti. Proovi uuesti.</p>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: 'var(--muted)', fontSize: 12.5, marginTop: 14 }}>
            <Icon.shield /> Sinu andmeid ei jagata kolmandatele. Päring läheb ainult sellele töökojale.
          </div>
        </form>
      )}
      <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 20, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {phone && <div style={{ display: 'flex', gap: 11, alignItems: 'center', fontWeight: 600, fontSize: 14.5 }}><Icon.phone /> {phone}</div>}
        {address && <div style={{ display: 'flex', gap: 11, alignItems: 'center', fontWeight: 600, fontSize: 14.5 }}><Icon.pin /> {address}</div>}
      </div>
    </div>
  );
}
