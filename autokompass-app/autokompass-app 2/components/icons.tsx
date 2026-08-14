import React from 'react';

// width/height="1em" annab vaikesuuruse; CSS (nt .btn svg) kirjutab selle üle kus vaja.
const s = (d: React.ReactNode, sw = 1.9) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

export const Icon = {
  pin: () => s(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" /><circle cx="12" cy="10" r="3" /></>),
  star: () => <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z" /></svg>,
  check: () => s(<><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.4 2.4 4.6-4.8" /></>, 2),
  checkPlain: () => s(<path d="M20 6L9 17l-5-5" />, 2.4),
  arwr: () => s(<path d="M5 12h14M13 6l6 6-6 6" />, 2.2),
  shield: () => s(<><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" /><path d="M9 12l2 2 4-4" /></>),
  phone: () => s(<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />),
  clock: () => s(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  bolt: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z" /></svg>,
  search: () => s(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>, 2.1),
  user: () => s(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>, 2),
  wrench: () => s(<path d="M14.7 6.3a4 4 0 00-5 5L3 18l3 3 6.7-6.7a4 4 0 005-5l-2.6 2.6-2.4-.6-.6-2.4z" />),
  send: () => s(<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></>, 2),
  menu: () => s(<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>, 2.1),
  close: () => s(<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>, 2.1),
};

export function Stars() {
  return <span className="stars">{[0, 1, 2, 3, 4].map((i) => <Icon.star key={i} />)}</span>;
}

export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 34 34" fill="none">
      <rect x="1" y="1" width="32" height="32" rx="9.5" fill="#0F172A" />
      <circle cx="17" cy="17" r="11" fill="none" stroke="#39506f" strokeWidth="1.4" />
      <polygon points="17,6.5 20.4,17 17,15 13.6,17" fill="#F5A524" />
      <polygon points="17,27.5 20.4,17 17,19 13.6,17" fill="#EAF2F9" />
      <circle cx="17" cy="17" r="1.9" fill="#F5A524" />
    </svg>
  );
}
