import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/button';

export default function DevotionalLanding() {
  const [dev, setDev] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/public/devotionals/today');
        setDev(res.data.data || null);
      } catch (err) { console.error(err); setDev(null); }
    };
    load();
  }, []);

  if (!dev) return null;

  const excerpt = dev.content ? (dev.content.length > 300 ? dev.content.slice(0, 300) + '...' : dev.content) : '';

  return (
    <section className="devotional-landing container mx-auto p-6 bg-white rounded-lg shadow mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="col-span-1">
          <img src={dev.featured_image} alt={dev.title} className="w-full h-64 object-cover rounded" />
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">{dev.category}</span>
              <h2 className="text-2xl font-bold mt-3">{dev.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{dev.header}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">{dev.published_at ? new Date(dev.published_at).toLocaleDateString() : ''}</div>
          </div>

          <div className="mt-4 text-base leading-relaxed text-gray-700">
            <blockquote className="italic text-lg">{dev.verse_text} — <strong>{dev.verse_reference}</strong></blockquote>
            <p className="mt-3">{excerpt}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <Button asChild>
              <a href={`/devotionals/${dev.slug}`}>Read More</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={dev.featured_image} download>Download Image</a>
            </Button>
            <Button variant="ghost" onClick={() => navigator.share ? navigator.share({ title: dev.title, url: window.location.origin + `/devotionals/${dev.slug}` }) : window.alert('Share not supported')}>Share</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
