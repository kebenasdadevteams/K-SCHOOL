import { useState } from 'react';
import { useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Headphones, PlayCircle, Pause, Plus, ExternalLink, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function Podcasts() {
  const location = useLocation();
  const [playing, setPlaying] = useState<number | null>(null);

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'admin');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'admin')
  );

  // Mock data based on database schema (podcasts, episodes, podcast_metadata)
  const podcasts = [
    {
      id: 1,
      title: 'Sunday Sermons',
      description: 'Weekly inspirational messages from our Sunday worship services',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=400&h=300&fit=crop',
      author: 'Pastor John',
      rss_url: 'https://spotify.com/rss/sunday-sermons',
      source_platform: 'spotify',
      is_automated: true,
      total_episodes: 48,
      last_synced_at: '2026-02-15 08:00:00',
    },
    {
      id: 2,
      title: 'Daily Devotionals - የዕለት ጸሎት',
      description: 'Short daily messages for spiritual growth in Amharic and English',
      thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
      author: 'Pastor Michael',
      rss_url: 'https://spotify.com/rss/daily-devotionals',
      source_platform: 'spotify',
      is_automated: true,
      total_episodes: 120,
      last_synced_at: '2026-02-15 06:00:00',
    },
    {
      id: 3,
      title: 'Bible Study Podcast',
      description: 'In-depth biblical teaching and verse-by-verse analysis',
      thumbnail: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=400&h=300&fit=crop',
      author: 'Teacher Mary',
      rss_url: null,
      source_platform: null,
      is_automated: false,
      total_episodes: 32,
      last_synced_at: null,
    },
  ];

  const episodes = [
    {
      id: 1,
      podcast_id: 1,
      title: 'Walking in Faith - A Journey of Trust',
      description: 'Explore what it means to walk by faith and not by sight in our daily lives',
      episode_number: 48,
      audio_url: 'https://example.com/audio/episode-48.mp3',
      duration: 2700, // seconds
      publish_status: 'published',
      published_at: '2026-02-14',
      podcast_title: 'Sunday Sermons',
      podcast_thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      podcast_id: 2,
      title: 'የቀን መልእክት - ጸሎትን ማስቀደም',
      description: 'ስለ ጸሎት አስፈላጊነት እና በጸሎት ላይ ምን ያህል ጊዜ ማስቀደም እንዳለብን',
      episode_number: 120,
      audio_url: 'https://example.com/audio/episode-120.mp3',
      duration: 900,
      publish_status: 'published',
      published_at: '2026-02-15',
      podcast_title: 'Daily Devotionals',
      podcast_thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      podcast_id: 1,
      title: 'The Power of Prayer in Difficult Times',
      description: 'Understanding how prayer sustains us through life\'s challenges',
      episode_number: 47,
      audio_url: 'https://example.com/audio/episode-47.mp3',
      duration: 2400,
      publish_status: 'published',
      published_at: '2026-02-11',
      podcast_title: 'Sunday Sermons',
      podcast_thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=200&h=200&fit=crop',
    },
    {
      id: 4,
      podcast_id: 3,
      title: 'Genesis Chapter 1: In the Beginning',
      description: 'Deep dive into the creation story and its theological significance',
      episode_number: 1,
      audio_url: 'https://example.com/audio/episode-genesis-1.mp3',
      duration: 3600,
      publish_status: 'published',
      published_at: '2026-02-10',
      podcast_title: 'Bible Study Podcast',
      podcast_thumbnail: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=200&h=200&fit=crop',
    },
    {
      id: 5,
      podcast_id: 2,
      title: 'የቀን መልእክት - እምነት እና ተስፋ',
      description: 'እምነትና ተስፋ በህይወታችን ውስጥ ስላላቸው ሚና አጭር ትምህርት',
      episode_number: 119,
      audio_url: 'https://example.com/audio/episode-119.mp3',
      duration: 900,
      publish_status: 'published',
      published_at: '2026-02-14',
      podcast_title: 'Daily Devotionals',
      podcast_thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=200&fit=crop',
    },
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Podcasts & Sermons</h1>
          <p className="text-muted-foreground">
            Listen to inspiring messages and teachings
          </p>
        </div>
        {(role === 'admin' || role === 'editor') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Podcast Series
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Podcast Series</DialogTitle>
                <DialogDescription>
                  Create a new podcast series or connect to Spotify RSS feed
                </DialogDescription>
              </DialogHeader>
              <CreatePodcastForm />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Podcast Series</CardDescription>
            <CardTitle className="text-3xl">{podcasts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Episodes</CardDescription>
            <CardTitle className="text-3xl">
              {podcasts.reduce((sum, p) => sum + p.total_episodes, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Auto-Synced</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {podcasts.filter(p => p.is_automated).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Podcast Series */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Podcast Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img 
                  src={podcast.thumbnail} 
                  alt={podcast.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {podcast.is_automated && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Auto-Synced
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{podcast.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {podcast.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {podcast.author}</span>
                    <span>{podcast.total_episodes} episodes</span>
                  </div>

                  {podcast.last_synced_at && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(podcast.last_synced_at).toLocaleDateString()}
                    </p>
                  )}

                  <Button className="w-full">
                    <Headphones className="h-4 w-4 mr-2" />
                    Browse Episodes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Episodes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Episodes</h2>
          <Button variant="outline">View All</Button>
        </div>

        <div className="space-y-3">
          {episodes.map((episode) => (
            <Card key={episode.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <img 
                      src={episode.podcast_thumbnail} 
                      alt={episode.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => setPlaying(playing === episode.id ? null : episode.id)}
                    >
                      {playing === episode.id ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <PlayCircle className="h-8 w-8 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {episode.podcast_title}
                        </Badge>
                        <h4 className="font-bold text-lg mb-1">{episode.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {episode.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(episode.published_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(episode.duration)}
                      </span>
                      <span>Episode #{episode.episode_number}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button 
                        size="sm"
                        onClick={() => setPlaying(playing === episode.id ? null : episode.id)}
                      >
                        {playing === episode.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

function CreatePodcastForm() {
  const [isAutomated, setIsAutomated] = useState(false);

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Podcast Series Title</Label>
        <Input id="title" placeholder="Enter podcast series name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe the podcast series..." 
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author/Host</Label>
        <Input id="author" placeholder="Pastor name or host" />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="is_automated" 
          checked={isAutomated}
          onChange={(e) => setIsAutomated(e.target.checked)}
          className="h-4 w-4" 
        />
        <Label htmlFor="is_automated">Auto-sync from Spotify RSS</Label>
      </div>

      {isAutomated && (
        <div className="space-y-2">
          <Label htmlFor="rss_url">Spotify RSS Feed URL</Label>
          <Input 
            id="rss_url" 
            placeholder="https://anchor.fm/s/xxxxx/podcast/rss" 
          />
          <p className="text-xs text-muted-foreground">
            Episodes will be automatically synced from your Spotify podcast RSS feed
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input id="thumbnail" placeholder="https://example.com/image.jpg" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Podcast Series</Button>
      </div>
    </form>
  );
}