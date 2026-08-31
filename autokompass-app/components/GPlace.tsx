import { getPlace } from '@/lib/gplaces';

function pid(w: any): string | null {
  return w.google_place_id && w.google_place_id !== 'NONE' ? w.google_place_id : null;
}

// NB! Fotot EI kusita enam Google'ilt renderdamise ajal.
// Foto URI hoitakse DB-s (workshops.photo_url) ja seda varskendab
// /api/cron/refresh-ratings iga 25 paeva jarel (Google lubab 30).
// Varem tegi listing 24 kaardi kohta ~48 API-kutset iga vaatamise kohta.
function demo(name: string): string {
  return '/demo/' + ((name.length % 3) + 1) + '.jpg';
}

export function GHero({ w }: { w: any }) {
  const photo: string | null = w.photo_url || null;
  const author: string | null = w.photo_attr || null;
  if (photo) {
    return (
      <div className="ghero">
        <img src={photo} alt={w.name} />
        <div className="gcap">Foto: Google{author ? ' · ' + author : ''}</div>
      </div>
    );
  }
  const sv = w.lat && w.lng
    ? 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + w.lat + ',' + w.lng
    : null;
  return (
    <div className="ghero">
      <img src={demo(w.name)} alt="" />
      <div className="gbar">
        <span>Näidisfoto — töökoda pole veel oma pilte lisanud</span>
        {sv ? <a href={sv} target="_blank" rel="noreferrer">Vaata Street View&apos;s</a> : null}
      </div>
    </div>
  );
}

export function GThumb({ w }: { w: any }) {
  const style = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const };
  if (w.photo_url) {
    return <img src={w.photo_url} alt="" loading="lazy" style={style} />;
  }
  return (
    <>
      <img src={demo(w.name)} alt="" loading="lazy" style={style} />
      <span className="phtag">Näidisfoto</span>
    </>
  );
}

export async function GReviews({ w }: { w: any }) {
  const id = pid(w);
  if (!id) return null;
  const p = await getPlace(id);
  if (!p || (!p.rating && !(p.reviews && p.reviews.length))) return null;
  const revs = (p.reviews ?? []).slice(0, 5);
  return (
    <div className="pcard">
      <div className="ghead">
        <h3>Google&apos;i arvustused</h3>
        {p.rating ? (
          <div className="gscore">
            <b>{p.rating.toFixed(1).replace('.', ',')}</b>
            <span className="gstars" aria-label={p.rating + ' viiest'}>★★★★★</span>
            <span className="gcount">{p.userRatingCount ?? 0} arvustust</span>
          </div>
        ) : null}
      </div>
      {revs.map((r: any, i: number) => (
        <div className="grev" key={i}>
          {r.authorAttribution?.photoUri
            ? <img className="gav" src={r.authorAttribution.photoUri} alt="" />
            : <div className="gav gavf">{(r.authorAttribution?.displayName || 'G')[0]}</div>}
          <div className="gbody">
            <div className="gname">
              {r.authorAttribution?.uri
                ? <a href={r.authorAttribution.uri} target="_blank" rel="noreferrer">{r.authorAttribution.displayName}</a>
                : (r.authorAttribution?.displayName || "Google'i kasutaja")}
              <span className="gwhen">{r.relativePublishTimeDescription}</span>
            </div>
            <div className="grate" aria-label={r.rating + ' viiest'}>
              {'★'.repeat(Math.round(r.rating || 0))}<i>{'★'.repeat(5 - Math.round(r.rating || 0))}</i>
            </div>
            {r.text?.text ? <p>{r.text.text}</p> : null}
          </div>
        </div>
      ))}
      <div className="gfoot">
        {p.googleMapsUri ? <a href={p.googleMapsUri} target="_blank" rel="noreferrer">Vaata kõiki arvustusi Google&apos;is →</a> : null}
        <span>Kuvatakse asjakohasuse järjekorras. Arvustused ei ole Google&apos;i poolt kontrollitud.</span>
      </div>
    </div>
  );
}
