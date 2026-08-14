// Autokompassi blogi — sisu on staatiline ja SEO-suunatud kõige suurema
// otsingumahuga märksõnadele (allikas: DataForSEO, Eesti, 08.2026).
// Iga artikkel sihib konkreetset märksõna, mille maht on päriselt mõõdetud.

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  keyword: string;      // peamine siht-märksõna
  date: string;         // ISO
  readMins: number;
  cover: string;        // emoji/lihtne visuaal (ei sõltu failidest)
  body: string;         // usaldusväärne, meie kirjutatud HTML
};

export const ARTICLES: Article[] = [
  {
    slug: 'millal-vahetada-suverehvid-talverehvid',
    title: 'Millal vahetada suverehvid talverehvide vastu? Eesti tähtajad 2026',
    excerpt:
      'Seadus ütleb kuupäevad, aga tegelik otsus sõltub temperatuurist. Vaata täpsed tähtajad, +7 °C reegel ja kuidas vältida sügisest järjekorda.',
    category: 'Rehvid',
    keyword: 'rehvivahetus',
    date: '2026-08-10',
    readMins: 5,
    cover: '🛞',
    body: `
<p>Rehvivahetus on aasta suurim autohoolduse hetk — otsingumaht kahekordistub kevadel ja sügisel. Kui tahad vältida pikka järjekorda ja kõrgemat hinda, tasub broneerida enne tippu, mitte selle keskel.</p>

<h2>Talverehvide kohustuslik periood Eestis</h2>
<p>Eestis on naastrehvid või lamell-talverehvid kohustuslikud <b>1. detsembrist 1. märtsini</b>. Naastrehve tohib kasutada <b>15. oktoobrist 31. märtsini</b>, ja libeda tee korral ka väljaspool seda vahemikku. Suverehvidele minek on lubatud alates märtsi algusest, kui teed on püsivalt sulad.</p>

<h2>Reaalne reegel: +7 °C</h2>
<p>Kuupäevad on miinimum, aga rehvitootjad soovitavad lähtuda temperatuurist. Kui ööpäeva keskmine langeb alla <b>+7 °C</b>, kaotab suverehvi kummisegu haardumise ja pidurdusteekond pikeneb. Sama kehtib vastupidi kevadel — soojas veerevad talverehvid kiiremini kulunud ja kütust kulub rohkem.</p>

<h2>Broneeri enne tippu</h2>
<p>Sügisene rehvitipp saabub tavaliselt esimese lumega ja siis on iga töökoda üle broneeritud. Kes broneerib oktoobri alguses, saab vaba aja ja sageli soodsama hinna. Autokompassis näed korraga mitme lähedal asuva töökoja vaba aega ja hinda, ilma et peaksid igaühele eraldi helistama.</p>

<h2>Rehvihoiustamine — kas tasub?</h2>
<p>Kui kodus pole kuiva ja pimedat hoiukohta, tasub rehvihoiustamine (u 40–80 €/hooaeg) end ära: rehvid püsivad kauem, ja vahetus käib kiiremini, sest komplekt on juba töökojas kohal.</p>
`,
  },
  {
    slug: 'kuidas-valida-usaldusvaarne-autotookoda',
    title: 'Kuidas valida usaldusväärne autotöökoda: 7 märki',
    excerpt:
      'Hind pole ainuke asi. Vaata, milliste märkide järgi eristada korralikku töökoda juhuslikust — ja millised laused peaksid tegema ettevaatlikuks.',
    category: 'Nõuanded',
    keyword: 'autoremont',
    date: '2026-08-08',
    readMins: 6,
    cover: '🔧',
    body: `
<p>Auto remont on usaldusküsimus: enamik meist ei tea, mis kapoti all päriselt toimub. Hea töökoda ei tähenda kõige odavamat, vaid seda, kus hind on selge ette ja töö tehakse üks kord õigesti.</p>

<h2>1. Selge hinnapakkumine enne tööd</h2>
<p>Korralik töökoda annab enne alustamist kirjaliku või selge suulise pakkumise. Kui hinda öeldakse alles pärast tööd, on see punane lipp.</p>

<h2>2. Ehtsad arvustused, mitte ainult tähed</h2>
<p>Vaata, kas arvustused kirjeldavad konkreetset tööd ja kas töökoda neile vastab. Autokompassis on osa arvustusi seotud tegeliku päringuga („Kontrollitud külastus"), mis vähendab võltsarvustuste osa.</p>

<h2>3. Läbipaistev varuosade poliitika</h2>
<p>Küsi, kas kasutatakse originaal- või järelturu varuosi ja mis on garantii. Hea meister selgitab vahet, mitte ei paku ainult kalleimat.</p>

<h2>4. Kirjalik garantii tööle</h2>
<p>Enamik korralikke töökodi annab tehtud tööle garantii (nt 12 kuud või teatud kilomeetrid). See näitab, et nad seisavad oma töö taga.</p>

<h2>5. Ei survestata „kohe ära tegema"</h2>
<p>Kui sulle öeldakse, et kõik tuleb kohe ja täna ära teha, ilma selgituseta miks — küsi teist arvamust. Tõeliselt kiireloomulisi asju on vähe (pidurid, rooliühendus, kütuseleke).</p>

<h2>6. Puhas ja korras töökoda</h2>
<p>Töökoja üldine kord annab aimu suhtumisest. See pole reegel, aga korralik keskkond käib sageli korraliku tööga kaasas.</p>

<h2>7. Selge kontakt ja aadress</h2>
<p>Reaalne aadress, töötav telefon ja vastamine päringutele on baas. Autokompassis näed neid kõiki ühelt profiililt ja saad võrrelda mitut töökoda kõrvuti.</p>
`,
  },
  {
    slug: 'kui-tihti-vahetada-mootorioli',
    title: 'Kui tihti vahetada mootoriõli? Õlivahetuse intervall Eestis',
    excerpt:
      'Iga 15 000 km või kord aastas? Vastus sõltub mootorist ja sõidustiilist. Vaata soovituslikud intervallid ja millal minna sagedamini.',
    category: 'Hooldus',
    keyword: 'õlivahetus',
    date: '2026-08-05',
    readMins: 4,
    cover: '🛢️',
    body: `
<p>Õlivahetus on odavaim viis mootorit pikalt töökorras hoida. Vahele jäetud vahetused on aga üks levinumaid põhjusi, miks mootor enneaegselt sureb.</p>

<h2>Üldine soovitus</h2>
<p>Enamikule kaasaegsetele bensiinimootoritele sobib <b>10 000–15 000 km</b> või <b>üks kord aastas</b>, kumb enne saabub. Diiselmootorid ja turboga mootorid vajavad sageli veidi sagedasemat vahetust.</p>

<h2>Millal minna sagedamini (iga 7 000–10 000 km)</h2>
<p>Lühikesed linnasõidud, palju külmkäivitusi talvel, haagise vedu või sportlik sõidustiil koormavad õli rohkem. Kui su tüüpiline sõit on 5–10 km korraga, vaheta õli sagedamini kui manuaal ette näeb.</p>

<h2>Miks kilometraaž üksi ei loe</h2>
<p>Õli vananeb ka ajaga, isegi kui autoga vähe sõidad. Seepärast on „kord aastas" reegel oluline just väikese läbisõiduga autodele — kalendriaeg võidab sel juhul kilomeetrid.</p>

<h2>Mida vahetuse juures veel kontrollida</h2>
<p>Korralik töökoda vahetab koos õliga õlifiltri ja kontrollib üle muud vedelikud, rihmad ja piduriklotside seisu. Küsi, kas need on hinna sees — Autokompassis näed teenuse hinnavahemikku juba enne päringut.</p>
`,
  },
  {
    slug: 'mootori-rikketuli-poleb-mida-teha',
    title: 'Mootori rikketuli põleb — mida see tähendab ja kui kiire on?',
    excerpt:
      'Kollane või punane? Vilkuv või püsiv? Vaata, millal võib ettevaatlikult edasi sõita ja millal tuleb kohe peatuda.',
    category: 'Diagnostika',
    keyword: 'autodiagnostika',
    date: '2026-08-02',
    readMins: 4,
    cover: '⚠️',
    body: `
<p>Armatuurlaua rikketuli tekitab paanikat, aga enamasti pole tegu kohese katastroofiga. Oluline on tuvastada, kui kiireloomuline see on.</p>

<h2>Püsiv kollane tuli</h2>
<p>Kõige tavalisem. Tähendab, et mootori juhtplokk on salvestanud veakoodi — põhjus võib olla lambda-andur, süütepool, kütusesüsteem vms. Autoga tohib ettevaatlikult edasi sõita, aga diagnostika tasub teha lähipäevil, enne kui väike viga suuremaks kasvab.</p>

<h2>Vilkuv rikketuli</h2>
<p>See on tõsine. Vilkumine viitab tavaliselt süütevahelejätule, mis võib katalüsaatorit kahjustada. Vähenda kiirust, väldi koormust ja vii auto võimalikult ruttu töökotta.</p>

<h2>Punane tuli (õli või temperatuur)</h2>
<p>Punane õlirõhu või temperatuuri tuli tähendab <b>peatu kohe ohutus kohas</b>. Edasisõit võib mootori hävitada. Kutsu abi või lase auto pukseerida.</p>

<h2>Kuidas diagnostika käib</h2>
<p>Töökoda loeb OBD-II lugejaga veakoodid välja ja tõlgendab neid. Koodi lugemine üksi ei ole diagnoos — hea meister kontrollib põhjuse üle, mitte ei vaheta lihtsalt esimest kahtlast osa. Kirjelda Autokompassi abilisele oma sümptomeid ja leiame diagnostikat pakkuvad töökojad su lähedal.</p>
`,
  },
  {
    slug: 'tehnoulevaatus-kuidas-valmistuda',
    title: 'Tehnoülevaatus: kuidas valmistuda ja vältida korduskontrolli',
    excerpt:
      'Enamik läbikukkumisi tuleb pisiasjadest — tuled, klaasipuhastid, rehvimmuster. Vaata kiire kontroll-nimekiri enne ülevaatust.',
    category: 'Ülevaatus',
    keyword: 'autoülevaatus',
    date: '2026-07-30',
    readMins: 4,
    cover: '✅',
    body: `
<p>Suur osa ülevaatusel läbikukkumistest pole seotud mootoriga, vaid lihtsate asjadega, mille saab enne ise üle vaadata. Korduskontroll maksab aega ja raha — enamasti tarbetult.</p>

<h2>Kiire kontroll-nimekiri</h2>
<ul>
  <li><b>Tuled:</b> kõik lähi-, kaug-, piduri-, suuna- ja numbrituled töökorras.</li>
  <li><b>Klaasipuhastid ja pesuvedelik:</b> kummid ei tohi määrida, pesuvedelik peab olema.</li>
  <li><b>Rehvid:</b> mustri sügavus vähemalt 1,6 mm (talvel soovituslikult 3 mm), ühtlane kulumine.</li>
  <li><b>Klaas:</b> juhi vaatevälja ei tohi jääda pragu.</li>
  <li><b>Pidurid:</b> ei tohi vinguda ega vedada autot ühele poole.</li>
  <li><b>Numbrimärk ja dokumendid:</b> loetav märk, kehtiv liikluskindlustus.</li>
</ul>

<h2>Eelkontroll säästab korduskäigu</h2>
<p>Paljud töökojad pakuvad „ülevaatuse eelkontrolli" — sama nimekiri tehakse läbi enne ametlikku ülevaatust ja vead parandatakse kohe. See on odavam kui korduskontroll pluss parandus eraldi.</p>

<h2>Millal broneerida</h2>
<p>Ära jäta viimasele päevale. Kui midagi vajab parandust, on hea, kui jääb paar päeva varu. Autokompassis leiad eelkontrolli ja remonti pakkuvad töökojad ühest kohast.</p>
`,
  },
  {
    slug: 'piduriklotsid-millal-vahetada',
    title: 'Piduriklotsid: millal vahetada ja mis see maksab?',
    excerpt:
      'Kriuksumine, vibratsioon või pikem pidurdusteekond — vaata märgid, mis näitavad, et piduriklotsid on otsas.',
    category: 'Hooldus',
    keyword: 'piduriklotside vahetus',
    date: '2026-07-26',
    readMins: 4,
    cover: '🛑',
    body: `
<p>Pidurid on auto kõige olulisem ohutussüsteem. Piduriklotside vahetus on suhteliselt odav töö, aga edasilükkamine võib kahjustada kettaid ja teha remondi mitu korda kallimaks.</p>

<h2>Märgid, et klotsid on otsas</h2>
<ul>
  <li><b>Kõrge kriuksuv heli</b> pidurdamisel — kulumisindikaator annab märku.</li>
  <li><b>Metalli-metalli krigin</b> — klotsid on läbi, ketas saab kahjustada. Kiire!</li>
  <li><b>Vibratsioon pedaalis</b> — võib viidata deformeerunud kettale.</li>
  <li><b>Pikem pidurdusteekond</b> või pehme pedaal.</li>
</ul>

<h2>Kui tihti klotse vahetatakse</h2>
<p>Sõltub sõidustiilist ja teedest, aga enamasti <b>30 000–70 000 km</b> vahel. Linnasõit ja mägine maastik kulutavad kiiremini. Piduriketaste eluiga on tavaliselt kaks klotsikomplekti.</p>

<h2>Orienteeruv hind</h2>
<p>Ühe telje klotside vahetus jääb tavaliselt <b>60–140 €</b> vahele (osad + töö), sõltuvalt autost. Kui ka kettad vajavad vahetust, tõuseb hind. Täpne summa selgub pärast kontrolli — Autokompassis saad korraga mitmelt töökojalt pakkumise.</p>
`,
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function relatedArticles(slug: string, n = 3) {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, n);
}
