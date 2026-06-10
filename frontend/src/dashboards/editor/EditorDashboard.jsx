import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

const NAV = [
  { path: '/editor', icon: '🏠', label: 'Overview' },
  { path: '/editor/posts', icon: '📄', label: 'Posts' },
  { path: '/editor/events', icon: '📅', label: 'Events' },
  { path: '/editor/programs', icon: '🗓️', label: 'Programs' },
  { path: '/editor/podcasts', icon: '🎙️', label: 'Podcasts' },
  { path: '/editor/quotes', icon: '✝️', label: 'Daily Quotes' },
  { path: '/editor/settings', icon: '⚙️', label: 'Site Settings' },
];

// ── Reusable Form Modal ────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h3 className="font-display text-gold-400 text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ── Overview ──────────────────────────────────────────
const Overview = () => {
  const [stats, setStats] = useState({ posts: 0, events: 0, podcasts: 0, programs: 0 });
  useEffect(() => {
    api.get('/content/posts').then(r => setStats(s => ({ ...s, posts: r.data.data?.length || 0 }))).catch(() => {});
    api.get('/editor/events').then(r => setStats(s => ({ ...s, events: r.data.data?.length || 0 }))).catch(() => {});
    api.get('/content/podcasts').then(r => setStats(s => ({ ...s, podcasts: r.data.data?.length || 0 }))).catch(() => {});
    api.get('/editor/programs').then(r => setStats(s => ({ ...s, programs: r.data.data?.length || 0 }))).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Editor Dashboard</h1>
        <p className="text-gray-400">Manage all public website content from here</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Posts', value: stats.posts, icon: '📄', path: '/editor/posts' },
          { label: 'Events', value: stats.events, icon: '📅', path: '/editor/events' },
          { label: 'Podcasts', value: stats.podcasts, icon: '🎙️', path: '/editor/podcasts' },
          { label: 'Programs', value: stats.programs, icon: '🗓️', path: '/editor/programs' }].map(s => (
          <Link key={s.label} to={s.path} className="card flex items-center gap-4 hover:border-gold-500/40 transition-colors">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className="text-white text-2xl font-bold font-display">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="card">
        <h3 className="font-display text-gold-400 text-lg mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[['📄 New Post', '/editor/posts'], ['📅 New Event', '/editor/events'], ['✝️ New Quote', '/editor/quotes'], ['⚙️ Site Settings', '/editor/settings'], ['🎙️ New Podcast', '/editor/podcasts'], ['🗓️ Manage Programs', '/editor/programs']].map(([label, path]) => (
            <Link key={label} to={path} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gold-500/40 rounded-lg px-4 py-3 text-white text-sm transition-all text-center">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Posts ─────────────────────────────────────────────
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: '', status: 'published' });

  const load = () => { setLoading(true); api.get('/content/posts').then(r => setPosts(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', content: '', category: '', status: 'published' }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, content: p.content, category: p.category || '', status: p.status }); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/content/posts/${editing.id}`, form);
    else await api.post('/content/posts', form);
    setShowModal(false); load();
  };

  const del = async (id) => { if (!confirm('Delete post?')) return; await api.delete(`/content/posts/${id}`); load(); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Posts</h1>
        <button onClick={openNew} className="btn-gold text-sm py-2">+ New Post</button>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> : posts.length === 0 ? (
        <div className="card text-center py-12"><p className="text-4xl mb-4">📄</p><p className="text-gray-400">No posts yet.</p></div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="card flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${p.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>{p.status}</span>
                </div>
                <p className="text-gray-500 text-xs">{p.category} · {new Date(p.created_at).toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm mt-1 line-clamp-1">{p.content?.replace(/<[^>]*>/g, '').slice(0, 100)}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 border border-blue-400/30 rounded-lg">Edit</button>
                <button onClick={() => del(p.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400/30 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Post' : 'New Post'} onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Title</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="label">Category</label><input className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Sermon, News" /></div>
            <div><label className="label">Content</label><textarea className="input-field" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div><label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save Post</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ── Events ────────────────────────────────────────────
const Events = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', title_am: '', description: '', description_am: '', event_date: '', event_time: '', category: 'Worship', image_url: '', link: '', status: 'published' });

  const load = () => { setLoading(true); api.get('/editor/events').then(r => setItems(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', title_am: '', description: '', description_am: '', event_date: '', event_time: '', category: 'Worship', image_url: '', link: '', status: 'published' }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/editor/events/${editing.id}`, form);
    else await api.post('/editor/events', form);
    setShowModal(false); load();
  };

  const del = async (id) => { if (!confirm('Delete event?')) return; await api.delete(`/editor/events/${id}`); load(); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Events & Announcements</h1>
        <button onClick={openNew} className="btn-gold text-sm py-2">+ New Event</button>
      </div>
      <p className="text-gray-400 text-sm">These events appear on the church homepage automatically.</p>
      {loading ? <p className="text-gray-400">Loading...</p> : items.length === 0 ? (
        <div className="card text-center py-12"><p className="text-4xl mb-4">📅</p><p className="text-gray-400">No events yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">{item.title_am || item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${item.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>{item.status}</span>
                </div>
                <p className="text-gray-500 text-xs">{item.category} · {item.event_date ? new Date(item.event_date).toLocaleDateString() : 'No date'} {item.event_time && `· ${item.event_time}`}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 border border-blue-400/30 rounded-lg">Edit</button>
                <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400/30 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Event' : 'New Event'} onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Title (English)</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div><label className="label">Title (Amharic)</label><input className="input-field" value={form.title_am} onChange={e => setForm({ ...form, title_am: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Date</label><input type="date" className="input-field" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} /></div>
              <div><label className="label">Time</label><input className="input-field" placeholder="e.g. 4:45 AM" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Worship', 'Youth', 'Community', 'Prayer', 'Special'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div><label className="label">Description (Amharic)</label><textarea className="input-field" rows={3} value={form.description_am} onChange={e => setForm({ ...form, description_am: e.target.value })} /></div>
            <div><label className="label">Description (English)</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Image URL</label><input className="input-field" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
            <div><label className="label">Link (Telegram, etc.)</label><input className="input-field" placeholder="https://t.me/..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save Event</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ── Programs ──────────────────────────────────────────
const Programs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_en: '', name_am: '', time_display: '', description: '', order_index: 0 });

  const load = () => { setLoading(true); api.get('/editor/programs').then(r => setItems(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ day_en: 'Saturday', day_am: 'ሰንበት (ቅዳሜ)', name_en: '', name_am: '', time_display: '', description: '', order_index: items.length + 1 }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/editor/programs/${editing.id}`, form);
    else await api.post('/editor/programs', form);
    setShowModal(false); load();
  };

  const del = async (id) => { if (!confirm('Delete program?')) return; await api.delete(`/editor/programs/${id}`); load(); };

  const days = [
    { en: 'Saturday', am: 'ሰንበት (ቅዳሜ)' },
    { en: 'Wednesday', am: 'ረቡዕ' },
    { en: 'Friday', am: 'ዓርብ' },
    { en: 'Sunday', am: 'እሁድ' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Weekly Programs</h1>
        <button onClick={openNew} className="btn-gold text-sm py-2">+ New Program</button>
      </div>
      <p className="text-gray-400 text-sm">These programs appear on the church homepage schedule section.</p>
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card flex justify-between items-center">
              <div>
                <span className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded-full mr-2">{item.day_am || item.day_en}</span>
                <span className="text-white font-medium">{item.name_am || item.name_en}</span>
                <span className="text-gray-500 text-sm ml-3">🕐 {item.time_display}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="text-blue-400 text-sm px-3 py-1 border border-blue-400/30 rounded-lg">Edit</button>
                <button onClick={() => del(item.id)} className="text-red-400 text-sm px-3 py-1 border border-red-400/30 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Program' : 'New Program'} onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Day</label>
              <select className="input-field" value={form.day_en} onChange={e => {
                const d = days.find(x => x.en === e.target.value);
                setForm({ ...form, day_en: d.en, day_am: d.am });
              }}>
                {days.map(d => <option key={d.en} value={d.en}>{d.am} ({d.en})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Name (Amharic)</label><input className="input-field" value={form.name_am} onChange={e => setForm({ ...form, name_am: e.target.value })} required /></div>
              <div><label className="label">Name (English)</label><input className="input-field" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
            </div>
            <div><label className="label">Time</label><input className="input-field" placeholder="ከ ጠዋቱ 4:45-6:30" value={form.time_display} onChange={e => setForm({ ...form, time_display: e.target.value })} /></div>
            <div><label className="label">Description</label><input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Order</label><input type="number" className="input-field" value={form.order_index} onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) })} /></div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ── Podcasts ──────────────────────────────────────────
const Podcasts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', audio_url: '', duration: '' });

  const load = () => { setLoading(true); api.get('/content/podcasts').then(r => setItems(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post('/content/podcasts', form);
    setShowModal(false); setForm({ title: '', description: '', audio_url: '', duration: '' }); load();
  };

  const del = async (id) => { if (!confirm('Delete podcast?')) return; await api.delete(`/content/podcasts/${id}`).catch(() => {}); load(); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Podcasts / Sermons</h1>
        <button onClick={() => setShowModal(true)} className="btn-gold text-sm py-2">+ New Podcast</button>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> : items.length === 0 ? (
        <div className="card text-center py-12"><p className="text-4xl mb-4">🎙️</p><p className="text-gray-400">No podcasts yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description?.slice(0, 80)}{item.duration && ` · ${Math.round(item.duration / 60)} min`}</p>
                {item.audio_url && <a href={item.audio_url} target="_blank" rel="noopener noreferrer" className="text-gold-400 text-xs hover:underline">▶ Play</a>}
              </div>
              <button onClick={() => del(item.id)} className="text-red-400 text-sm px-3 py-1 border border-red-400/30 rounded-lg">Delete</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title="New Podcast" onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Title</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="label">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Audio URL</label><input className="input-field" placeholder="https://..." value={form.audio_url} onChange={e => setForm({ ...form, audio_url: e.target.value })} /></div>
            <div><label className="label">Duration (seconds)</label><input type="number" className="input-field" placeholder="e.g. 3600 for 1 hour" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ── Daily Quotes ──────────────────────────────────────
const Quotes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ text_en: '', text_am: '', reference: '' });

  const load = () => { setLoading(true); api.get('/editor/quotes').then(r => setItems(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post('/editor/quotes', form);
    setShowModal(false); setForm({ text_en: '', text_am: '', reference: '' }); load();
  };

  const del = async (id) => { if (!confirm('Delete quote?')) return; await api.delete(`/editor/quotes/${id}`); load(); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Daily Bible Quotes</h1>
        <button onClick={() => setShowModal(true)} className="btn-gold text-sm py-2">+ New Quote</button>
      </div>
      <p className="text-gray-400 text-sm">A random quote from this list is shown on the homepage daily.</p>
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card flex justify-between items-start">
              <div>
                <p className="text-white font-display italic">"{item.text_am || item.text_en}"</p>
                {item.text_am && item.text_en && <p className="text-gray-500 text-sm mt-1">"{item.text_en}"</p>}
                {item.reference && <p className="text-gold-400 text-sm mt-1">— {item.reference}</p>}
              </div>
              <button onClick={() => del(item.id)} className="text-red-400 text-sm px-3 py-1 border border-red-400/30 rounded-lg ml-4 flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title="New Quote" onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Verse (Amharic)</label><textarea className="input-field" rows={3} value={form.text_am} onChange={e => setForm({ ...form, text_am: e.target.value })} /></div>
            <div><label className="label">Verse (English)</label><textarea className="input-field" rows={3} value={form.text_en} onChange={e => setForm({ ...form, text_en: e.target.value })} /></div>
            <div><label className="label">Reference (e.g. John 3:16)</label><input className="input-field" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} /></div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save Quote</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ── Site Settings ─────────────────────────────────────
const SiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/editor/settings').then(r => setSettings(r.data.data || {})).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.put('/editor/settings', settings);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { key: 'church_phone', label: 'Church Phone', placeholder: '+251911772660' },
    { key: 'church_email', label: 'Church Email', placeholder: 'info@kebenasdachurch.org' },
    { key: 'pastor_name', label: 'Pastor Name (Amharic)', placeholder: 'ፓ/ር ወርቁ ፀጋዬ' },
    { key: 'telegram_link', label: 'Telegram Group Link', placeholder: 'https://t.me/...' },
    { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
    { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
    { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/...' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Site Settings</h1>
      <p className="text-gray-400 text-sm">These settings control information shown on the public church website.</p>
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <form onSubmit={save} className="card space-y-5">
          {fields.map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input className="input-field" placeholder={f.placeholder} value={settings[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Saving...' : 'Save Settings'}</button>
            {saved && <span className="text-green-400 text-sm">✅ Saved successfully!</span>}
          </div>
        </form>
      )}
    </div>
  );
};

// ── Editor Dashboard ──────────────────────────────────
const EditorDashboard = () => (
  <DashboardLayout title="Editor" roleColor="text-orange-400" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="posts" element={<Posts />} />
      <Route path="events" element={<Events />} />
      <Route path="programs" element={<Programs />} />
      <Route path="podcasts" element={<Podcasts />} />
      <Route path="quotes" element={<Quotes />} />
      <Route path="settings" element={<SiteSettings />} />
    </Routes>
  </DashboardLayout>
);

export default EditorDashboard;
