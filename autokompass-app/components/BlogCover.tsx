import React from 'react';

// Isetehtud vektorkaaned (SVG) blogiartiklitele — brändivärvides, teravad igas suuruses.
// `art` võti tuleb lib/blog.ts-st.

type Props = { art: string; className?: string };

function Frame({ id, from, to, children }: { id: string; from: string; to: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 240" className="bcsvg" preserveAspectRatio="xMidYMid slice" role="img">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx="60" cy="40" r="120" fill="#fff" opacity="0.05" />
      <circle cx="350" cy="210" r="90" fill="#000" opacity="0.06" />
      {children}
    </svg>
  );
}

export function BlogCover({ art, className }: Props) {
  const wrap = (node: React.ReactNode) => <div className={'bcover ' + (className || '')}>{node}</div>; const PHOTO: Record<string, boolean> = { tire: true, choose: true, oil: true }; if (PHOTO[art]) return wrap(<img src={'/blog-' + art + '.webp'} alt="" className="bcsvg" style={{ objectFit: 'cover', objectPosition: art === 'choose' ? 'center 25%' : 'center' }} loading="lazy" />);

  switch (art) {
    case 'tire':
      return wrap(
        <Frame id="g-tire" from="#0B5394" to="#083B68">
          <g transform="translate(200,120)">
            <circle r="78" fill="#111a2b" />
            <circle r="78" fill="none" stroke="#1f2c44" strokeWidth="6" />
            {Array.from({ length: 24 }).map((_, i) => (
              <rect key={i} x="-4" y="-78" width="8" height="15" rx="2" fill="#0c1322" transform={`rotate(${i * 15})`} />
            ))}
            <circle r="46" fill="#1b2740" />
            <circle r="30" fill="#26344f" />
            <circle r="12" fill="#F5A524" />
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={0} cy={-38} r="3.5" fill="#8fa0b5" transform={`rotate(${a})`} />
            ))}
          </g>
          <g transform="translate(320,54)"><circle r="20" fill="#ffd68a" opacity="0.9" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="-2" y="-30" width="4" height="9" rx="2" fill="#ffd68a" opacity="0.85" transform={`rotate(${a})`} />)}
          </g>
          <g transform="translate(74,182)" fill="#EAF2F9" opacity="0.9">
            <path d="M0 -16 L0 16 M-14 -8 L14 8 M-14 8 L14 -8" stroke="#EAF2F9" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </Frame>
      );
    case 'choose':
      return wrap(
        <Frame id="g-choose" from="#0A8F63" to="#076848">
          <g transform="translate(168,120) rotate(-25)">
            <path d="M-8 -60 a26 26 0 1 0 26 26 l58 58 a10 10 0 0 0 14 -14 l-58 -58 a26 26 0 0 0 -34 -34 z" fill="none" stroke="#EAF2F9" strokeWidth="9" strokeLinejoin="round" />
          </g>
          <g transform="translate(268,150)">
            <circle r="40" fill="#F5A524" />
            <path d="M-18 2 l12 13 l24 -28" fill="none" stroke="#3A2A05" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </Frame>
      );
    case 'oil':
      return wrap(
        <Frame id="g-oil" from="#B4700F" to="#7a4c08">
          <g transform="translate(150,110)">
            <path d="M0 -60 C34 -14 40 6 40 22 a40 40 0 1 1 -80 0 C-40 6 -34 -14 0 -60 Z" fill="#111a2b" />
            <path d="M-6 4 a16 16 0 0 0 -14 16" fill="none" stroke="#8fa0b5" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          </g>
          <g transform="translate(268,150) rotate(20)">
            <rect x="-8" y="-70" width="16" height="120" rx="8" fill="#EAF2F9" />
            <rect x="-8" y="18" width="16" height="34" rx="8" fill="#111a2b" />
            <circle cx="0" cy="-70" r="13" fill="#F5A524" />
          </g>
        </Frame>
      );
    case 'warning':
      return wrap(
        <Frame id="g-warn" from="#1E293B" to="#0F172A">
          <g transform="translate(200,124)">
            <path d="M-70 22 q0 -40 40 -46 q6 -22 30 -22 q24 0 30 22 q40 6 40 46 q0 6 -8 6 h-124 q-8 0 -8 -6 Z" fill="#26344f" />
            <path d="M-70 22 q0 -40 40 -46 q6 -22 30 -22 q24 0 30 22 q40 6 40 46 q0 6 -8 6 h-124 q-8 0 -8 -6 Z" fill="none" stroke="#3a506f" strokeWidth="2" />
            <g transform="translate(0,-6)">
              <path d="M0 -30 L26 16 H-26 Z" fill="#F5A524" />
              <rect x="-4" y="-16" width="8" height="18" rx="3" fill="#3A2A05" />
              <circle cx="0" cy="8" r="4" fill="#3A2A05" />
            </g>
          </g>
        </Frame>
      );
    case 'check':
      return wrap(
        <Frame id="g-check" from="#0A8F63" to="#076848">
          <g transform="translate(200,120)">
            <rect x="-52" y="-72" width="104" height="144" rx="14" fill="#EAF2F9" />
            <rect x="-20" y="-84" width="40" height="24" rx="8" fill="#0B5394" />
            {[-34, -6, 22].map((y, i) => (
              <g key={i} transform={`translate(-34,${y + 12})`}>
                <circle r="9" fill={i < 2 ? '#0A8F63' : '#cdd8e6'} />
                {i < 2 && <path d="M-4 0 l3 3 l6 -7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
                <rect x="18" y="-4" width="48" height="8" rx="4" fill="#c3d0e0" />
              </g>
            ))}
          </g>
        </Frame>
      );
    case 'brake':
      return wrap(
        <Frame id="g-brake" from="#334155" to="#1E293B">
          <g transform="translate(200,120)">
            <circle r="74" fill="#5A6A7D" />
            <circle r="74" fill="none" stroke="#41505f" strokeWidth="4" />
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx="0" cy="-52" r="3" fill="#2b3543" transform={`rotate(${i * 9})`} />
            ))}
            <circle r="30" fill="#3a4658" />
            <circle r="14" fill="#26303e" />
            <path d="M-88 -30 a30 30 0 0 1 30 -30 l0 60 a30 30 0 0 1 -30 -30 Z" fill="#F5A524" transform="translate(52,0)" />
          </g>
        </Frame>
      );
    default:
      return wrap(
        <Frame id="g-def" from="#0B5394" to="#083B68">
          <g transform="translate(200,120)" fill="none" stroke="#EAF2F9" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-30 -20 a26 26 0 1 0 26 26 l40 40 a10 10 0 0 0 14 -14 l-40 -40 a26 26 0 0 0 -34 -34 z" />
          </g>
        </Frame>
      );
  }
}
