import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import api from '../../services/api';
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
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'admin');

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/content/podcasts');
        setPodcasts(data.data || []);
      } catch (error) {
        console.error('Unable to load podcasts from database', error);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, []);

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        setEpisodesLoading(true);
        const { data } = await api.get('/content/episodes');
        setEpisodes(data.data || []);
      } catch (error) {
        console.error('Unable to load episodes from database', error);
        setEpisodes([]);
      } finally {
        setEpisodesLoading(false);
      }
    };

    loadEpisodes();
  }, []);

  const stats = useMemo(() => {
    const autoSynced = podcasts.filter((item) => item.status === 'published').length;
    const durations = podcasts.reduce((sum, item) => sum + Number(item.duration || 0), 0);

    return {
      totalSeries: podcasts.length,
      totalDuration: durations,
      published: autoSynced,
    };
  }, [podcasts]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Podcasts & Sermons</h1>
          <p className="text-muted-foreground">Listen to inspiring messages and teachings</p>
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
                <DialogDescription>Create a new podcast series or connect to Spotify RSS feed</DialogDescription>
              </DialogHeader>
              <CreatePodcastForm />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Podcast Series</CardDescription>
            <CardTitle className="text-3xl">{stats.totalSeries}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Duration</CardDescription>
            <CardTitle className="text-3xl">{formatDuration(stats.totalDuration)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Live Feed</CardDescription>
            <CardTitle className="text-3xl">{podcasts.filter((item) => item.audio_url).length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Podcast Series</h2>
        {loading ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading podcast data from the database...</div>
        ) : podcasts.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">No podcast data is available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={podcast.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=400&h=300&fit=crop'}
                    alt={podcast.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {podcast.status === 'published' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{podcast.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>By {podcast.author_name || 'Unknown'}</span>
                      <span>{podcast.duration ? formatDuration(podcast.duration) : 'No duration'}</span>
                    </div>

                    {podcast.created_at && (
                      <p className="text-xs text-muted-foreground">Created: {new Date(podcast.created_at).toLocaleDateString()}</p>
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
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Episodes</h2>
          <Button variant="outline">View All</Button>
        </div>

        {episodesLoading ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading episodes...</div>
        ) : episodes.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">No episodes available yet.</div>
        ) : (
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Card key={episode.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={episode.podcast_thumbnail || episode.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=400&h=300&fit=crop'} 
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
                            {episode.podcast_title || 'Untitled Series'}
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
                          {new Date(episode.published_at || episode.created_at || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(episode.duration)}
                        </span>
                        {episode.episode_number && (
                          <span>Episode #{episode.episode_number}</span>
                        )}
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
        )}
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