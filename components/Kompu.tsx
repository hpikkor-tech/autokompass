import React from 'react';

type Eyes = 'normal' | 'happy' | 'wide';
type Mouth = 'smile' | 'bigsmile' | 'o';
type Arms = 'down' | 'wave' | 'point' | 'up';

// Autokompassi maskott "Kompu" — merevaik-kollane, et paista sinisel taustal.
export function Kompu({ eyes = 'happy', mouth = 'bigsmile', arms = 'wave', style }:
  { eyes?: Eyes; mouth?: Mouth; arms?: Arms; style?: React.CSSProperties }) {
  const ink = '#0F172A';
  const amber = '#f5a524';
  const eye = eyes === 'happy'
    ? <><path d="M74 104 q8 -9 16 0" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M110 104 q8 -9 16 0" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" /></>
    : eyes === 'wide'
    ? <><circle cx="82" cy="100" r="10" fill={ink} /><circle cx="118" cy="100" r="10" fill={ink} /><circle cx="85" cy="96" r="3" fill="#fff" /><circle cx="121" cy="96" r="3" fill="#fff" /></>
    : <><circle cx="82" cy="100" r="8" fill={ink} /><circle cx="118" cy="100" r="8" fill={ink} /><circle cx="85" cy="97" r="2.6" fill="#fff" /><circle cx="121" cy="97" r="2.6" fill="#fff" /></>;
  const m = mouth === 'bigsmile'
    ? <path d="M80 116 q20 20 40 0" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />
    : mouth === 'o'
    ? <ellipse cx="100" cy="121" rx="7" ry="9" fill={ink} />
    : <path d="M85 117 q15 13 30 0" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
  const la = <><rect x="18" y="120" width="30" height="14" rx="7" fill={amber} transform="rotate(24 33 127)" /><circle cx="22" cy="146" r="9" fill={amber} /></>;
  const rd = <><rect x="152" y="120" width="30" height="14" rx="7" fill={amber} transform="rotate(-24 167 127)" /><circle cx="178" cy="146" r="9" fill={amber} /></>;
  const rw = <><rect x="150" y="66" width="30" height="14" rx="7" fill={amber} transform="rotate(-40 165 73)" /><circle cx="176" cy="52" r="10" fill={amber} /></>;
  const rp = <><rect x="150" y="104" width="44" height="14" rx="7" fill={amber} /><circle cx="197" cy="111" r="9" fill={amber} /></>;
  const lu = <><rect x="24" y="66" width="30" height="14" rx="7" fill={amber} transform="rotate(40 39 73)" /><circle cx="24" cy="52" r="10" fill={amber} /></>;
  const armEls = arms === 'wave' ? <>{la}{rw}</> : arms === 'point' ? <>{la}{rp}</> : arms === 'up' ? <>{lu}{rw}</> : <>{la}{rd}</>;
  return (
    <svg viewBox="0 0 200 224" style={{ width: '100%', height: 'auto', ...style }}>
      <ellipse cx="100" cy="214" rx="50" ry="8" fill={ink} opacity="0.1" />
      <rect x="82" y="176" width="14" height="28" rx="7" fill="#d98613" /><rect x="104" y="176" width="14" height="28" rx="7" fill="#d98613" />
      {armEls}
      <polygon points="100,18 108,48 100,43 92,48" fill={ink} /><polygon points="100,54 108,48 100,43 92,48" fill="#c26f0a" />
      <rect x="36" y="46" width="128" height="122" rx="42" fill={amber} /><rect x="36" y="46" width="128" height="122" rx="42" fill="none" stroke="#d98613" strokeWidth="4" />
      <rect x="52" y="58" width="96" height="34" rx="17" fill="#fff" opacity="0.18" />
      <rect x="58" y="72" width="84" height="62" rx="30" fill="#FFF7EA" />
      {eye}{m}
    </svg>
  );
}
