// SEO-maandumislehtede andmemudel. Iga teenus = puhas URL (/rehvivahetus),
// iga suurema mahuga linn saab oma lehe (/rehvivahetus/tallinn).
// Sihitud märksõnad ja mahud: DataForSEO, Eesti, 08.2026 (vt auto-marksonauuring.xlsx).

export type LandingCity = { slug: string; name: string; ine: string; district?: boolean; parent?: string; blurb?: string };

// Ainult päris mõõdetud mahuga linnad saavad lehe (väldime tühje teenus×linn lehti).
export const CITIES: Record<string, LandingCity> = {
  tallinn: { slug: 'tallinn', name: 'Tallinn', ine: 'Tallinnas' },
  tartu: { slug: 'tartu', name: 'Tartu', ine: 'Tartus' },
  rakvere: { slug: 'rakvere', name: 'Rakvere', ine: 'Rakveres' },
  // Tallinna linnaosad. Töökoda seotakse linnaosaga koordinaatide järgi (workshops.district).
  kristiine: { slug: 'kristiine', name: 'Kristiine', ine: 'Kristiines', district: true, parent: 'tallinn', blurb: 'Kristiine on Tallinna töökodade tihedaim nurk: Sõpruse ja Tammsaare puiestee vahele jääb hulk väiksemaid remonditöökodi ning kesklinna on siit vaid mõni minut sõitu.' },
  mustamae: { slug: 'mustamae', name: 'Mustamäe', ine: 'Mustamäel', district: true, parent: 'tallinn', blurb: 'Mustamäe töökojad on koondunud Kadaka ja Laki tänava kanti — seal on koos nii kiirhooldust kui suuremaid teenindusi, mis teenindavad kogu ümbritsevat magalarajooni.' },
  lasnamae: { slug: 'lasnamae', name: 'Lasnamäe', ine: 'Lasnamäel', district: true, parent: 'tallinn', blurb: 'Lasnamäel on Tallinna kõige rohkem autotöökodi. Peterburi tee, Punase ja Suur-Sõjamäe ümbrus on linna tegelik autoteeninduse süda — valikut jagub nii soodsast garaažitöökojast margiesinduseni.' },
  haabersti: { slug: 'haabersti', name: 'Haabersti', ine: 'Haaberstis', district: true, parent: 'tallinn', blurb: 'Haaberstis on töökojad hajali suuremate teede ääres, Õismäe ja Rocca al Mare kandis — mugav neile, kes liiguvad Paldiski maantee või ringtee kaudu.' },
  nomme: { slug: 'nomme', name: 'Nõmme', ine: 'Nõmmel', district: true, parent: 'tallinn', blurb: 'Nõmme töökojad on väiksemad ja pereettevõtte-laadsed, enamik Pärnu maantee ja Vabaduse puiestee lähedal. Siin loeb hea meister sageli rohkem kui suur teenindushoone.' },
  pirita: { slug: 'pirita', name: 'Pirita', ine: 'Pirital', district: true, parent: 'tallinn', blurb: 'Pirital on töökodi vähe ja need on väikesed. Paljud siinsed autoomanikud sõidavad hoolduseks Lasnamäele või kesklinna, mis jääb kümne minuti kaugusele.' },
  'pohja-tallinn': { slug: 'pohja-tallinn', name: 'Põhja-Tallinn', ine: 'Põhja-Tallinnas', district: true, parent: 'tallinn', blurb: 'Põhja-Tallinnas, Kopli ja Sitsi kandis, tegutseb hulk vanema koolkonna remonditöökodi, kus tehakse lisaks hooldusele ka keevitus- ja keretöid.' },
  kesklinn: { slug: 'kesklinn', name: 'Kesklinn', ine: 'Kesklinnas', district: true, parent: 'tallinn', blurb: 'Kesklinna töökojad sobivad kõige paremini neile, kes jätavad auto tööpäevaks hooldusesse — enamik asub Tartu maantee ja Pärnu maantee vahelisel alal, kõnnitee kaugusel kontorist.' },
};

export type Service = {
  slug: string;
  h1: string;
  keyword: string;
  metaTitle: string;
  metaDesc: string;
  lead: string;
  svc: string | null; // serviceTags slug (matchesSvcW jaoks); null = kõik töökojad
  intro: string[];
  faq: { q: string; a: string }[];
  related: string[]; // teiste teenuste slug'id
  cities: string[]; // linna-slug'id, millel on oma leht
  districts?: string[]; // Tallinna linnaosad, millel on oma leht
};

export const SERVICES: Service[] = [
  {
    slug: 'rehvivahetus',
    h1: 'Rehvivahetus',
    keyword: 'rehvivahetus',
    metaTitle: 'Rehvivahetus — võrdle töökodi ja hindu | Autokompass',
    metaDesc:
      'Leia rehvivahetus oma lähedalt. Võrdle hindu, vaba aega ja arvustusi, broneeri enne hooaja tippu. Suve- ja talverehvide vahetus, tasakaalustamine ja hoiustamine.',
    lead: 'Võrdle rehvitöökodi, hindu ja vaba aega — broneeri enne hooaja tippu, mitte selle keskel.',
    svc: 'rehvivahetus',
    intro: [
      'Rehvivahetus on aasta suurim autohoolduse hetk: nõudlus kahekordistub kevadel ja sügisel, ning esimese lume saabudes on iga töökoda üle broneeritud. Kes vahetab rehvid enne tippu, saab vaba aja ja sageli soodsama hinna.',
      'Eestis on talverehvid kohustuslikud 1. detsembrist 1. märtsini, naastrehve tohib kasutada 15. oktoobrist 31. märtsini. Rehvitootjad soovitavad lähtuda temperatuurist: kui ööpäeva keskmine langeb alla +7 °C, kaotab suverehv haardumise ja pidurdusteekond pikeneb.',
      'Autokompassist näed korraga mitme lähedal asuva töökoja teenuseid, lahtiolekuaegu ja kontakti — ilma et peaksid igaühele eraldi helistama. Paljud töökojad pakuvad ka rehvihoiustamist (u 40–80 €/hooaeg), mis hoiab rehvid korras ja teeb vahetuse kiiremaks.',
    ],
    faq: [
      { q: 'Millal peaks rehvid vahetama?', a: 'Talverehvidele tasub minna, kui ööpäeva keskmine temperatuur püsib alla +7 °C — tavaliselt oktoobris. Suverehvidele kevadel, kui teed on püsivalt sulad. Seaduse järgi on talverehvid kohustuslikud 1. detsembrist 1. märtsini.' },
      { q: 'Kui palju rehvivahetus maksab?', a: 'Nelja rehvi vahetus koos tasakaalustusega jääb enamasti 25–50 € vahele, sõltuvalt velje suurusest ja linnast. Täpse hinna näed pärast päringut valitud töökojalt.' },
      { q: 'Kas rehve tasub hoiustada töökojas?', a: 'Kui kodus pole kuiva ja pimedat hoiukohta, tasub rehvihoiustamine end ära: rehvid püsivad kauem ning järgmine vahetus käib kiiremini, sest komplekt on juba kohal.' },
    ],
    related: ['autoremont', 'olivahetus', 'autohooldus'],
    cities: ['tallinn', 'tartu'],
    districts: ['lasnamae', 'mustamae', 'kristiine', 'kesklinn', 'haabersti', 'pohja-tallinn', 'nomme'],
  },
  {
    slug: 'autoremont',
    h1: 'Autoremont',
    keyword: 'autoremont',
    metaTitle: 'Autoremont — leia usaldusväärne töökoda | Autokompass',
    metaDesc:
      'Võrdle autoremonditöökodi üle Eesti: hinnad, teenused, lahtiolekuajad ja ehtsad arvustused. Kirjelda oma muret ja leia usaldusväärne meister sekunditega.',
    lead: 'Kirjelda oma muret ja võrdle usaldusväärseid töökodi — selge hind juba enne tööd.',
    svc: null,
    intro: [
      'Autoremont on usaldusküsimus: enamik meist ei tea, mis kapoti all päriselt toimub. Hea töökoda ei tähenda kõige odavamat, vaid seda, kus hind on selge ette ja töö tehakse üks kord õigesti.',
      'Korralik töökoda annab enne alustamist selge pakkumise ja selgitab, mida ja miks tehakse. Autokompassis näed teenuseid, asukohta ja arvustusi kõrvuti, et saaksid valida oma murele sobiva meistri — ilma pika helistamiseta.',
      'Väiksemast hooldusest suurema mootoriremondini: võrdle mitut töökoda korraga, vaata vaba aega ja saada päring otse. Klientidele on Autokompass alati tasuta.',
    ],
    faq: [
      { q: 'Kuidas valida usaldusväärne autotöökoda?', a: 'Vaata, kas töökoda annab selge hinnapakkumise enne tööd, kas arvustused on ehtsad ja konkreetsed, ning kas teenused on läbipaistvalt kirjas. Väldi töökodi, kus hinda öeldakse alles pärast tööd.' },
      { q: 'Kas ma pean enne teadma, mis autol viga on?', a: 'Ei. Kirjelda muret lihtsas keeles (nt „mootori rikketuli põleb" või „auto teeb pidurdades häält") ja leiad sobivad töökojad, kes teevad diagnostika.' },
      { q: 'Kas pakkumise küsimine on tasuta?', a: 'Jah. Töökodade otsimine, võrdlemine ja hinnapäringu saatmine on kliendile alati tasuta — me ei võta vahendustasu.' },
    ],
    related: ['olivahetus', 'autodiagnostika', 'rehvivahetus'],
    cities: ['tallinn', 'tartu', 'rakvere'],
    districts: ['lasnamae', 'kesklinn', 'kristiine', 'mustamae', 'nomme', 'pohja-tallinn', 'haabersti', 'pirita'],
  },
  {
    slug: 'olivahetus',
    h1: 'Õlivahetus',
    keyword: 'õlivahetus',
    metaTitle: 'Õlivahetus — hinnad ja töökojad | Autokompass',
    metaDesc:
      'Võrdle õlivahetust pakkuvaid töökodi: hind, õli ja filter, kiire hooldus. Leia sobiv töökoda oma lähedalt ja broneeri aeg.',
    lead: 'Kiire ja korralik õlivahetus — võrdle hindu ja leia töökoda oma lähedalt.',
    svc: 'olivahetus',
    intro: [
      'Õlivahetus on odavaim viis mootori eluiga pikendada. Enamik tootjaid soovitab vahetada mootoriõli ja filter iga 10 000–15 000 km järel või kord aastas — lühisõitude ja linnaliikluse puhul pigem sagedamini.',
      'Vana või vähene õli kiirendab mootori kulumist ja võib lõppeda kalli remondiga. Korralik töökoda vahetab koos õliga ka õlifiltri ja kontrollib muude vedelike taset.',
      'Autokompassist leiad töökojad, kes teevad kiire õlivahetuse sageli sama päeva jooksul. Võrdle hindu ja vaba aega ning saada päring otse.',
    ],
    faq: [
      { q: 'Kui tihti peaks õli vahetama?', a: 'Enamasti iga 10 000–15 000 km järel või kord aastas, olenevalt autost ja õlist. Palju lühisõite ja linnaliiklust tähendab sagedasemat vahetust.' },
      { q: 'Kui palju õlivahetus maksab?', a: 'Töö koos õlifiltriga jääb tavaliselt 40–90 € vahele, millele lisandub õli hind. Täpse summa näed pärast päringut.' },
    ],
    related: ['autohooldus', 'autoremont', 'autodiagnostika'],
    cities: [],
    districts: ['lasnamae', 'kesklinn', 'kristiine', 'mustamae', 'nomme', 'pohja-tallinn', 'haabersti', 'pirita'],
  },
  {
    slug: 'autoklaasi-vahetus',
    h1: 'Autoklaasi vahetus',
    keyword: 'autoklaasi vahetus',
    metaTitle: 'Autoklaasi vahetus ja parandus | Autokompass',
    metaDesc:
      'Tuuleklaasi vahetus ja kivikildude parandus. Võrdle autoklaasitöökodi, hindu ja vaba aega ning leia sobiv meister oma lähedalt.',
    lead: 'Tuuleklaasi vahetus või kivikillu parandus — võrdle töökodi ja hindu.',
    svc: 'autoklaas',
    intro: [
      'Praguline tuuleklaas ei ole ainult tüütu — see on ka ülevaatuse mittevastavus ja ohutusrisk. Väiksema kivikillu saab sageli parandada, suurema prao või vaatevälja jääva vigastuse puhul tuleb klaas vahetada.',
      'Paljud kindlustused katavad klaasikahju ilma boonust kaotamata, ja hea töökoda aitab ka kindlustuse paberitega. Kaasaegsete autode puhul tuleb pärast klaasivahetust sageli kalibreerida ka juhiabisüsteemide kaamera.',
      'Autokompassist leiad autoklaasile spetsialiseerunud töökojad — võrdle hindu ja broneeri aeg.',
    ],
    faq: [
      { q: 'Kas kivikillu saab parandada või tuleb klaas vahetada?', a: 'Väikese, mündisuurusest väiksema killu, mis pole otse juhi vaateväljas, saab tavaliselt parandada. Suurem pragu või vaatevälja jääv kahjustus nõuab klaasivahetust.' },
      { q: 'Kas kindlustus katab klaasivahetuse?', a: 'Paljud kaskokindlustused katavad klaasikahju eraldi, sageli ilma boonust mõjutamata. Kontrolli oma poliisi — töökoda oskab tavaliselt aidata ka vormistamisega.' },
    ],
    related: ['autoremont', 'keretood', 'autohooldus'],
    cities: [],
  },
  {
    slug: 'keretood',
    h1: 'Keretööd ja värvimine',
    keyword: 'keretööd',
    metaTitle: 'Keretööd ja autovärvimine | Autokompass',
    metaDesc:
      'Plekitööd, keretöö ja autovärvimine pärast avariid või kulumist. Võrdle keretöökodi, hindu ja arvustusi ning leia sobiv meister.',
    lead: 'Plekitööd, värvimine ja avariiremont — võrdle keretöökodi ja hindu.',
    svc: 'keretood',
    intro: [
      'Keretööd ulatuvad väikesest kriimustuse eemaldamisest kuni avariijärgse taastamiseni. Korralik keretöö taastab nii välimuse kui ka korrosioonikaitse, halb töö hakkab paari aastaga läbi lööma.',
      'Värvitöö kvaliteet sõltub ettevalmistusest ja värvikambrist. Hea töökoda leiab õige värvitooni ja teeb ülemineku märkamatuks. Avariiremondi puhul aitab töökoda sageli ka kindlustuse käsitlusega.',
      'Autokompassist leiad keretööle ja värvimisele spetsialiseerunud töökojad — võrdle näidistöid, hindu ja arvustusi.',
    ],
    faq: [
      { q: 'Kui kaua keretööd võtavad?', a: 'Väike plekitöö võib valmida päevaga, suurem avariiremont võtab koos värvimise ja kuivamisega tavaliselt mitu päeva kuni paar nädalat. Töökoda annab täpse ajakava pärast ülevaatust.' },
      { q: 'Kas keretöökoda aitab kindlustusega?', a: 'Enamik keretöökodi on kindlustustega kokku puutunud ja aitab kahjukäsitluse ning vajalike fotode ja hinnangutega.' },
    ],
    related: ['autoklaasi-vahetus', 'autoremont', 'autohooldus'],
    cities: [],
  },
  {
    slug: 'autohooldus',
    h1: 'Autohooldus',
    keyword: 'autohooldus',
    metaTitle: 'Autohooldus ja regulaarne teenindus | Autokompass',
    metaDesc:
      'Korraline autohooldus hoiab auto töökorras ja säilitab garantii. Võrdle hooldustöökodi, hindu ja vaba aega ning broneeri aeg.',
    lead: 'Korraline hooldus hoiab auto töökorras — võrdle töökodi ja hindu.',
    svc: null,
    intro: [
      'Regulaarne hooldus on odavam kui remont. Õigel ajal tehtud hooldus (õli, filtrid, vedelikud, pidurid, rihmad) hoiab ära suuremad rikked ja säilitab uuema auto puhul tehasegarantii.',
      'Hooldusvälp sõltub autost ja läbisõidust — tavaliselt kord aastas või iga 15 000 km järel. Hea töökoda peab hooldusloogi ja annab teada, mis vajab tähelepanu, ilma üle müümata.',
      'Autokompassist leiad hooldustöökojad üle Eesti — võrdle hindu, teenuseid ja arvustusi ning saada päring otse.',
    ],
    faq: [
      { q: 'Kui tihti peaks autot hooldama?', a: 'Enamasti kord aastas või iga 15 000 km järel, olenevalt tootja hooldusgraafikust. Vaata oma auto hooldusraamatut või küsi töökojalt.' },
      { q: 'Kas hooldus tuleb teha esinduses, et garantii säiliks?', a: 'Ei pruugi. EL-i reeglite järgi säilib garantii ka volitamata töökojas, kui kasutatakse nõuetele vastavaid varuosi ja peetakse hooldusgraafikut. Küsi töökojalt kinnitust.' },
    ],
    related: ['olivahetus', 'autoremont', 'autodiagnostika'],
    cities: [],
  },
  {
    slug: 'autodiagnostika',
    h1: 'Autodiagnostika',
    keyword: 'autodiagnostika',
    metaTitle: 'Autodiagnostika ja rikkeotsing | Autokompass',
    metaDesc:
      'Rikketuli põleb? Võrdle diagnostikat pakkuvaid töökodi. Veakoodide lugemine, rikkeotsing ja selgitus — leia töökoda oma lähedalt.',
    lead: 'Rikketuli põleb? Võrdle diagnostikat pakkuvaid töökodi ja broneeri aeg.',
    svc: 'diagnostika',
    intro: [
      'Kui armatuurlaual süttib rikketuli, ei tähenda see alati kallist remonti — aga tasub see kiiresti üle vaadata. Diagnostikaseade loeb veakoodid, ent koodi õige tõlgendamine nõuab kogenud meistrit.',
      'Hea diagnostika ei ole lihtsalt koodi ettelugemine, vaid põhjuse leidmine: sama veakood võib tuleneda mitmest asjast. Selge diagnoos hoiab ära asendetailide asjatu vahetamise.',
      'Autokompassist leiad töökojad, kes teevad põhjaliku rikkeotsingu ja selgitavad tulemuse arusaadavalt. Võrdle hindu ja broneeri aeg.',
    ],
    faq: [
      { q: 'Mida rikketuli tähendab?', a: 'Kollane mootori märgutuli tähendab tavaliselt, et süsteem on tuvastanud vea ja salvestanud veakoodi — sõita võib ettevaatlikult ja lasta üle vaadata. Punane tuli tähendab, et tuleb kohe peatuda.' },
      { q: 'Kui palju diagnostika maksab?', a: 'Veakoodide lugemine ja põhjalikum rikkeotsing jääb enamasti 20–60 € vahele. Osa töökodi arvestab diagnostikatasu remonti tehes maha.' },
    ],
    related: ['autoremont', 'autohooldus', 'olivahetus'],
    cities: [],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getCity(slug: string): LandingCity | undefined {
  return CITIES[slug];
}

// Kõik Tallinna linnaosad (filtrite ja siselinkide jaoks).
export const DISTRICT_LIST: LandingCity[] = Object.values(CITIES).filter((c) => c.district);

// Kõik teenus×linn ja teenus×linnaosa kombinatsioonid, millel on oma leht.
export function cityPageParams(): { teenus: string; linn: string }[] {
  const out: { teenus: string; linn: string }[] = [];
  for (const s of SERVICES) {
    for (const c of s.cities) out.push({ teenus: s.slug, linn: c });
    for (const d of s.districts ?? []) out.push({ teenus: s.slug, linn: d });
  }
  return out;
}
