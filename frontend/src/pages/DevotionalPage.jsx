import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function DevotionalPage() {
  const { slug } = useParams();
  const [dev, setDev] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/public/devotionals/${slug}`);
        setDev(res.data.data || null);
      } catch (err) { console.error(err); setDev(null); }
    };
    if (slug) load();
  }, [slug]);

  if (!dev) return <div className="container mx-auto p-6">Devotional not found.</div>;

  return (
    <main className="container mx-auto p-6">
      <article className="prose lg:prose-xl">
        <h1>{dev.title}</h1>
        <p className="text-sm text-muted-foreground">{dev.published_at ? new Date(dev.published_at).toLocaleDateString() : ''} • {dev.category}</p>
        <img src={dev.featured_image} alt={dev.title} className="rounded w-full" />
        <blockquote>{dev.verse_text} — <strong>{dev.verse_reference}</strong></blockquote>
        <div dangerouslySetInnerHTML={{ __html: dev.content }} />
      </article>
    </main>
  );
}
