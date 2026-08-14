'use client';
import { useState } from 'react';
import { Icon } from './icons';
import { createClient } from '@/lib/supabase/client';

export function ReviewForm({ workshopId }: { workshopId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!rating) return setErr('Palun vali tärnidega hinnang.');
    if (body.trim().length < 8) return setErr('Kirjuta paar sõna oma kogemusest.');

    // Sisselogimise kontroll (klient peab olema registreerunud)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/sisene?mode=client&next=' + encodeURIComponent(location.pathname); return; }

    const res = await fetch('/api/review', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshop_id: workshopId, rating, body }),
    });
    if (res.ok) { setDone(true); setOpen(false); }
    else { const j = await res.json().catch(() => ({})); setErr(j.error || 'Arvustuse salvestamine ebaõnnestus.'); }
  }

  if (done) return <p className="msg-ok">Aitäh! Sinu kontrollitud arvustus on avaldatud.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>Käisid siin? Jäta oma kogemus.</span>
        <button className="btn btn-p btn-sm" onClick={() => setOpen(!open)}><Icon.star /> Jäta arvustus</button>
      </div>
      {open && (
        <form className="revform pcard" style={{ background: '#F8FAFC', padding: 18 }} onSubmit={submit}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>
            <Icon.shield /> Arvustada saavad registreerunud kliendid, kellel on selle töökojaga seotud päring — nii tulevad kõik arvustused päris külastustelt.
          </div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Sinu hinnang</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button type="button" key={v} onClick={() => setRating(v)}
                style={{ color: v <= rating ? '#f5a524' : '#D3DBE6', padding: 2, lineHeight: 0 }}>
                <span style={{ display: 'inline-block', width: 30, height: 30 }}><Icon.star /></span>
              </button>
            ))}
          </div>
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Kirjelda oma kogemust — kuidas läks, kas hind oli aus, kas soovitaksid?" />
          {err && <p className="msg-err">{err}</p>}
          <button className="btn btn-p btn-sm" style={{ marginTop: 12 }}>Avalda arvustus</button>
        </form>
      )}
    </div>
  );
}
