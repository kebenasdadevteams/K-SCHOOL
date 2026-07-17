import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import kebenaChurch from '../../assets/kebena_church.jpg';
import jesusWalking from '../../assets/jesus_walking.jpg';
import openBible from '../../assets/open_bible.jpg';
import logo from '../../assets/logo.png';
import tentage from '../../assets/tentage.jpg';
import specialProgram from '../../assets/special_program.png';
import sintayew from '../../assets/sintayew.png';

// ── Language Context ───────────────────────────────────
const usePublicData = () => {
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [quote, setQuote] = useState(null);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/public/events').then(r => setEvents(r.data.data || [])).catch(() => {});
    api.get('/public/programs').then(r => setPrograms(r.data.data || [])).catch(() => {});
    api.get('/public/quotes').then(r => setQuote(r.data.data)).catch(() => {});
    api.get('/public/posts').then(r => setPosts(r.data.data || [])).catch(() => {});
    api.get('/public/settings').then(r => setSettings(r.data.data || {})).catch(() => {});
  }, []);

  return { events, programs, quote, posts, settings };
};

// ── Hero Slider ────────────────────────────────────────
const HeroSlider = ({ settings }) => {
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState('am');

  const slides = [
    { image: kebenaChurch, title: { en: 'Welcome to Kebena Seventh Day Adventist Church', am: 'ወደ ቀበና ሰባተኛ ቀን አድቬንቲስት ቤ/ክ እንኳን በደህና መጡ።' }, subtitle: { en: 'Come worship with us and experience the love of God our Savior.', am: '\"...የመድኃኒታችን የእግዚአብሔር ቸርነትና ሰውን መውደዱ...\" ቲቶ 3:4-5' } },
    { image: jesusWalking, title: { en: 'Growing Together in Faith', am: 'ከእኛ ጋር አብረው በአምልኮ ያሳልፉ' }, subtitle: { en: 'A community devoted to God\'s word', am: 'ህይወትዎ የሚለወጥበት ትምህርት እንደተዘጋጀ ያውቃሉ?' } },
    { image: openBible, title: { en: 'Experience God\'s Love', am: 'የእግዚአብሔርን ፍቅር ይለማመዱ' }, subtitle: { en: 'Everyone is welcome here', am: 'እንኳን በደህና መጡ።' } },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight max-w-4xl drop-shadow-lg">
              {slide.title[lang]}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow">
              {slide.subtitle[lang]}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <a href={settings.telegram_link || 'https://t.me/+c0aL2WBX7L5iNWI0'} target="_blank" rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-lg transition-all text-base">
                {lang === 'am' ? 'ይቀላቀሉን' : 'Join Us'}
              </a>
              <Link to="/login" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-3 rounded-lg transition-all text-base">
                {lang === 'am' ? 'ግባ' : 'Login'}
              </Link>
            </div>
          </div>
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-secondary w-8' : 'bg-white/50'}`} />
        ))}
      </div>
      {/* Nav arrows */}
      <button onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/60 w-12 h-12 rounded-full flex items-center justify-center transition-all">‹</button>
      <button onClick={() => setCurrent(p => (p + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/60 w-12 h-12 rounded-full flex items-center justify-center transition-all">›</button>
      {/* Lang switcher */}
      <div className="absolute top-6 right-6 flex gap-2">
        {['am', 'en'].map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === l ? 'bg-secondary text-secondary-foreground' : 'bg-black/40 text-white border border-white/30'}`}>
            {l === 'am' ? 'አማ' : 'EN'}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Daily Quote ────────────────────────────────────────
const DailyQuote = ({ quote }) => {
  if (!quote) return null;
  return (
    <div className="bg-card border-y border-secondary/20 py-10 px-6 text-center">
      <p className="text-secondary font-display text-sm tracking-widest uppercase mb-4">✝ Daily Verse</p>
      <p className="text-foreground text-xl md:text-2xl font-display italic max-w-3xl mx-auto leading-relaxed mb-3">
        "{quote.text_am || quote.text_en}"
      </p>
      {quote.reference && <p className="text-secondary text-sm font-medium">{quote.reference}</p>}
    </div>
  );
};

// ── Announcements ─────────────────────────────────────
const Announcements = ({ events }) => {
  const defaultEvents = [
    { id: 1, title: 'Easter Celebration', title_am: 'ትንሣኤ ክብረ በዓል', description_am: 'የጻሎት እና የአብሮነት ቀን ከእኛ ጋር ይካፈሉ።', image_url: tentage, event_date: '2025-12-06', category: 'Worship', link: 'https://t.me/+c0aL2WBX7L5iNWI0' },
    { id: 2, title: 'Youth Program', title_am: 'የወጣቶች ፕሮግራም', description_am: 'የወጣቶች ፕሮግራም።', image_url: specialProgram, event_date: '2025-12-13', category: 'Youth', link: 'https://t.me/+c0aL2WBX7L5iNWI0' },
    { id: 3, title: 'Youth Summer Camp', title_am: 'የወጣቶች የበጋ ካምፕ', description_am: 'ለወጣቶቻችን አስደሳች የበጋ ካምፕ', image_url: sintayew, event_date: '2025-12-20', category: 'Youth', link: 'https://t.me/+c0aL2WBX7L5iNWI0' },
  ];
  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-display tracking-widest text-sm uppercase mb-3">ማስታወቂያዎች</p>
          <h2 className="font-display text-4xl font-bold text-foreground">Announcements</h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {displayEvents.slice(0, 3).map((ev, i) => (
            <div key={ev.id || i} className="bg-card border border-border rounded-xl overflow-hidden hover:border-secondary/40 transition-all group">
              {ev.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded-full">{ev.category}</span>
                <h3 className="font-display text-foreground font-semibold mt-3 mb-2">{ev.title_am || ev.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{ev.description_am || ev.description}</p>
                {ev.event_date && <p className="text-secondary text-xs mb-3">📅 {new Date(ev.event_date).toLocaleDateString()}</p>}
                {ev.link && (
                  <a href={ev.link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/80 text-sm font-medium transition-colors">
                    Learn more →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── About SDA ─────────────────────────────────────────
const AboutSDA = () => (
  <section className="py-20 px-6 bg-background">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-secondary font-display tracking-widest text-sm uppercase mb-4">ስለ አድቬንቲስቶች</p>
        <h2 className="font-display text-4xl font-bold text-foreground mb-6">Who Are Seventh-day Adventists?</h2>
        <div className="w-16 h-0.5 bg-secondary mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          የሰባተኛ ቀን አድቬንቲስቶች መጽሐፍ ቅዱስን እንደ ብቸኛ እምነታቸው ይቀበላሉ። የሰባተኛ ቀን አድቬንቲስት ቤተ ክርስቲያን በ1863 ዓ.ም. በሰሜን አሜሪካ ተቋቋመ።
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Seventh-day Adventists accept the Bible as their only creed and hold certain fundamental beliefs to be the teaching of the Holy Scriptures.
        </p>
        <a href="https://www.adventist.org" target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-secondary border border-secondary/50 hover:bg-secondary hover:text-primary-foreground px-6 py-2 rounded-lg transition-all text-sm font-medium">
          Learn More →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Biblical Foundation', 'Sabbath Observance', 'Christ-Centered', 'Health & Wellness'].map((v, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 text-center hover:border-secondary/40 transition-colors">
            <div className="text-3xl mb-3">{['📖', '⛪', '✝', '🌿'][i]}</div>
            <p className="text-foreground font-display text-sm font-semibold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── About Kebena ──────────────────────────────────────
const AboutKebena = () => (
  <section className="py-20 px-6 bg-background">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1">
        <img src={kebenaChurch} alt="Kebena Church" className="rounded-2xl w-full h-80 object-cover border border-border" />
      </div>
      <div className="order-1 md:order-2">
        <p className="text-secondary font-display tracking-widest text-sm uppercase mb-4">ስለ ቀበና</p>
        <h2 className="font-display text-4xl font-bold text-foreground mb-6">About Kebena SDA Church</h2>
        <div className="w-16 h-0.5 bg-secondary mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          የቀበና ሰባተኛ ቀን አድቬንቲስት ቤ/ክ በአዲስ አበባ እምብርት የሚገኝ ሲሆን በመካከለኛው ኢትዮጲያ የተቋቋመው የመጀመሪያው የሰ/ቀ/አ ሚሽን ጣቢያ ነው።
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The Kebena compound was first established as a mission site in July 1921 by V.E. Toppenberg. "ቀበና እንግዳ አጥታ አታውቅም" — Kebena has never lacked Sabbath Day visitors.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[['1921', 'Founded'], ['150+', 'Members'], ['100+', 'Years'], ].map(([n, l]) => (
            <div key={l} className="bg-card border border-border rounded-lg p-4">
              <p className="font-display text-secondary text-2xl font-bold">{n}</p>
              <p className="text-muted-foreground text-xs mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Weekly Programs ────────────────────────────────────
const WeeklyPrograms = ({ programs }) => {
  const defaultPrograms = [
    { day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_am: 'የጸሎት አገልግሎት', name_en: 'Prayer Meeting', time_display: 'ከ ጠዋቱ 2:00-3:00' },
    { day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_am: 'የሰንበት ትምህርት', name_en: 'Sabbath School', time_display: 'ከ ጠዋቱ 3:00-4:30' },
    { day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_am: 'የአምልኮ ግዜ', name_en: 'Worship Service', time_display: 'ከ ጠዋቱ 4:45-6:30' },
    { day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_am: 'የወጣቶች አገልግሎት', name_en: 'Youth Service', time_display: 'ከሰዓት 8:30-10:00' },
    { day_en: 'Wednesday', day_am: 'ረቡዕ', name_am: 'የጸሎት ጊዜ', name_en: 'Prayer Meeting', time_display: 'ከምሽቱ 12:00-1:30' },
    { day_en: 'Friday', day_am: 'ዓርብ', name_am: 'የምሽት አምልኮ', name_en: 'Vespers Service', time_display: 'ከምሽቱ 12:00-1:30' },
  ];
  const displayPrograms = programs.length > 0 ? programs : defaultPrograms;

  const grouped = displayPrograms.reduce((acc, p) => {
    const key = p.day_am || p.day_en;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <section id="programs" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-display tracking-widest text-sm uppercase mb-3">ሳምንታዊ ፕሮግራሞቻችን</p>
          <h2 className="font-display text-4xl font-bold text-foreground">Our Weekly Programs</h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mt-4" />
          <p className="text-muted-foreground mt-4">Join us throughout the week for worship, fellowship, and spiritual growth</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([day, progs]) => (
            <div key={day} className="bg-white border border-border rounded-xl overflow-hidden hover:border-secondary/40 transition-colors">
              <div className="bg-secondary/10 border-b border-secondary/20 px-5 py-4">
                <h3 className="font-display text-secondary font-bold text-lg">{day}</h3>
              </div>
              <div className="p-5 space-y-4">
                {progs.map((p, i) => (
                  <div key={i} className="border-b border-border/70 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-foreground font-semibold text-sm mb-1">{p.name_am || p.name_en}</h4>
                    <p className="text-secondary text-xs flex items-center gap-1">🕐 {p.time_display}</p>
                    {p.description && <p className="text-muted-foreground text-xs mt-1">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Posts Section ─────────────────────────────────────
const PostsSection = ({ posts }) => {
  if (posts.length === 0) return null;
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-display tracking-widest text-sm uppercase mb-3">ዜናዎች</p>
          <h2 className="font-display text-4xl font-bold text-foreground">Latest News & Articles</h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map(p => (
            <div key={p.id} className="bg-white border border-border rounded-xl p-6 hover:border-secondary/40 transition-colors">
              <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded-full">{p.category || 'News'}</span>
              <h3 className="font-display text-foreground font-semibold mt-3 mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{p.content?.replace(/<[^>]*>/g, '').slice(0, 120)}...</p>
              <p className="text-muted-foreground text-xs mt-3">{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────
const Footer = ({ settings }) => (
  <footer id="contact" className="bg-card border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Map */}
      <div className="mb-12 rounded-2xl overflow-hidden border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.2316676514943!2d38.772226674025234!3d9.042620191019255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8fb9b2dc6941%3A0xbe67f38a387fdf6a!2sKabana%20SDA%20church!5e0!3m2!1sen!2set!4v1765594829741!5m2!1sen!2set"
          width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" title="Kebena SDA Church Location"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
            <div>
              <h3 className="font-display text-secondary font-bold">ቀበና ሰ/ቀ/አ</h3>
              <p className="text-muted-foreground text-xs">Kebena SDA Church</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            እግዚአብሔርን እና ጎረቤቶቻችንን ለማገልገል የተሰጠች የእምነት፣ ተስፋ እና ፍቅር ማህበረሰብ።
          </p>
        </div>
        <div>
          <h4 className="font-display text-white font-semibold mb-4">ያግኙን / Contact Us</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>📍 ቀበና፣ ከዳግማዊ ምኒልክ ሆስፒታል ወረድ ብሎ፣ አዲስ አበባ</p>
            <p>📞 <a href={`tel:${settings.church_phone || '+251911772660'}`} className="hover:text-secondary transition-colors">{settings.church_phone || '+251911772660'}</a></p>
            <p>✉️ <a href={`mailto:${settings.church_email || 'info@kebenasdachurch.org'}`} className="hover:text-secondary transition-colors">{settings.church_email || 'info@kebenasdachurch.org'}</a></p>
          </div>
        </div>
        <div>
          <h4 className="font-display text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#programs" className="hover:text-secondary transition-colors">Weekly Programs</a></li>
            <li><a href="#contact" className="hover:text-secondary transition-colors">Contact</a></li>
            <li><Link to="/login" className="hover:text-secondary transition-colors">K-School Login</Link></li>
            <li><Link to="/signup" className="hover:text-secondary transition-colors">Join K-School</Link></li>
          </ul>
        </div>
      </div>

      {/* Social + Copyright */}
      <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          {[
            { url: settings.facebook_url, label: 'FB', icon: 'f' },
            { url: settings.youtube_url, label: 'YT', icon: '▶' },
            { url: settings.instagram_url, label: 'IG', icon: '◉' },
            { url: settings.tiktok_url, label: 'TT', icon: '♪' },
          ].filter(s => s.url).map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-secondary/10 border border-secondary/20 hover:border-secondary hover:text-secondary rounded-full flex items-center justify-center text-secondary text-sm transition-all">
              {s.icon}
            </a>
          ))}
          <a href={settings.telegram_link || 'https://t.me/+c0aL2WBX7L5iNWI0'} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 bg-muted border border-border hover:border-secondary hover:text-secondary rounded-full flex items-center justify-center text-muted-foreground text-sm transition-all">
            ✈
          </a>
        </div>
        <div className="text-center">
          {settings.pastor_name && <p className="text-muted-foreground text-sm mb-1">የቤተክርስቲያን ፐስተር: {settings.pastor_name}</p>}
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} ቀበና ሰ/ቀ/አ ቤተ ክርስቲያን · All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

// ── Header / Navbar ────────────────────────────────────
const Navbar = ({ settings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" onError={e => e.target.style.display = 'none'} />
          <div>
            <p className="font-display text-secondary font-bold text-sm leading-tight">ቀበና ሰ/ቀ/አ ቤ/ክ</p>
            <p className="text-muted-foreground text-xs">Kebena SDA Church</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {[['home', 'Home'], ['about', 'About'], ['programs', 'Programs'], ['contact', 'Contact']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-muted-foreground hover:text-secondary transition-colors">{label}</button>
          ))}
          <a href={`tel:${settings.church_phone || '+251911772660'}`} className="text-muted-foreground hover:text-secondary transition-colors">Give 📞</a>
          <Link to="/login" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-all text-sm">Login</Link>
        </nav>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">{menuOpen ? '✕' : '☰'}</button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-3">
          {[['home', 'Home'], ['about', 'About'], ['programs', 'Programs'], ['contact', 'Contact']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-muted-foreground hover:text-secondary text-left transition-colors">{label}</button>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-center">Login to K-School</Link>
        </div>
      )}
    </header>
  );
};

// ── Main GuestPage ────────────────────────────────────
const GuestPage = () => {
  const { events, programs, quote, posts, settings } = usePublicData();
  return (
    <div id="home" className="min-h-screen bg-background text-foreground">
      <Navbar settings={settings} />
      <div className="pt-0">
        <HeroSlider settings={settings} />
        <DailyQuote quote={quote} />
        <Announcements events={events} />
        <div id="about">
          <AboutSDA />
          <AboutKebena />
        </div>
        <WeeklyPrograms programs={programs} />
        <PostsSection posts={posts} />
        <Footer settings={settings} />
      </div>
    </div>
  );
};

export default GuestPage;
