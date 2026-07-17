import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarLayout } from '../../SidebarLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Headphones, 
  PlayCircle, 
  Pause, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Clock, 
  TrendingUp,
  Sparkles,
  Zap,
  Radio,
  Music,
  Podcast as PodcastIcon,
  ListMusic,
  Heart,
  Share2,
  Download,
  Bookmark,
  Volume2,
  Globe,
  Repeat,
  Shuffle,
  Mic2,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

export default function Podcasts() {
  const location = useLocation();
  const [playing, setPlaying] = useState<number | null>(null);
  const [likedEpisodes, setLikedEpisodes] = useState<number[]>([]);
  const [bookmarkedEpisodes, setBookmarkedEpisodes] = useState<number[]>([]);

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'student');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'student')
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
      listeners: '1.2k',
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
      listeners: '856',
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
      listeners: '432',
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
      plays: 342,
      likes: 87,
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
      plays: 521,
      likes: 134,
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
      plays: 289,
      likes: 56,
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
      plays: 167,
      likes: 43,
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
      plays: 198,
      likes: 72,
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

  const toggleLike = (id: number) => {
    setLikedEpisodes(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedEpisodes(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Podcasts & Sermons
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600">
                <Sparkles className="h-4 w-4" />
                {episodes.length} Episodes
              </span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Listen to inspiring messages and teachings
            </p>
          </div>
          {(role === 'admin' || role === 'editor') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <PodcastIcon className="h-4 w-4 text-amber-500" />
              Podcast Series
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {podcasts.length}
              <span className="text-sm font-normal text-muted-foreground">series</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-amber-500" />
              Total Episodes
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {podcasts.reduce((sum, p) => sum + p.total_episodes, 0)}
              <span className="text-sm font-normal text-muted-foreground">episodes</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-green-500" />
              Auto-Synced
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2 text-green-600">
              {podcasts.filter(p => p.is_automated).length}
              <span className="text-sm font-normal text-muted-foreground">active</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              This Week
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              5
              <span className="text-sm font-normal text-muted-foreground">new</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Podcast Series */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="h-5 w-5 text-amber-500" />
            Podcast Series
          </h2>
          <Button variant="outline" className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
            View All
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200 dark:border-slate-700 overflow-hidden">
              <CardHeader className="p-0 relative">
                <img 
                  src={podcast.thumbnail} 
                  alt={podcast.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Badge className="bg-white/90 text-black border-0">
                    <Headphones className="h-3 w-3 mr-1" />
                    {podcast.listeners} listeners
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {podcast.is_automated && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Auto-Synced
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
                        <Mic2 className="h-3 w-3 mr-1" />
                        {podcast.total_episodes} episodes
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-amber-600 transition-colors">{podcast.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {podcast.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      By {podcast.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {podcast.listeners} listeners
                    </span>
                  </div>

                  {podcast.last_synced_at && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last synced: {new Date(podcast.last_synced_at).toLocaleDateString()}
                    </p>
                  )}

                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-5 w-5 text-amber-500" />
            Recent Episodes
          </h2>
          <Button variant="outline" className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
            View All
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-3">
          {episodes.map((episode) => (
            <Card key={episode.id} className="group hover:shadow-xl transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={episode.podcast_thumbnail} 
                      alt={episode.title}
                      className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-all group-hover:scale-105"
                      onClick={() => setPlaying(playing === episode.id ? null : episode.id)}
                    >
                      {playing === episode.id ? (
                        <Pause className="h-10 w-10 text-white drop-shadow-lg" />
                      ) : (
                        <PlayCircle className="h-10 w-10 text-white drop-shadow-lg" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                            {episode.podcast_title}
                          </Badge>
                          <Badge variant="outline" className="border-slate-200 dark:border-slate-700">
                            Episode #{episode.episode_number}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-amber-600 transition-colors truncate">{episode.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {episode.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={`h-8 w-8 transition-all ${likedEpisodes.includes(episode.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
                          onClick={() => toggleLike(episode.id)}
                        >
                          <Heart className={`h-4 w-4 ${likedEpisodes.includes(episode.id) ? 'fill-red-500' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={`h-8 w-8 transition-all ${bookmarkedEpisodes.includes(episode.id) ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground hover:text-amber-500'}`}
                          onClick={() => toggleBookmark(episode.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedEpisodes.includes(episode.id) ? 'fill-amber-500' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-500 transition-all">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(episode.published_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(episode.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" />
                        {episode.plays} plays
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {episode.likes} likes
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all"
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
                      <Button size="sm" variant="outline" className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mini player progress bar (visible when playing) */}
                {playing === episode.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Shuffle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg">
                        <Pause className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Repeat className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">1:23</span>
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDuration(episode.duration)}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}

function CreatePodcastForm() {
  const [isAutomated, setIsAutomated] = useState(false);

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Podcast Series Title</Label>
        <Input id="title" placeholder="Enter podcast series name" className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe the podcast series..." 
          rows={4}
          className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author/Host</Label>
        <Input id="author" placeholder="Pastor name or host" className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500" />
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
        <input 
          type="checkbox" 
          id="is_automated" 
          checked={isAutomated}
          onChange={(e) => setIsAutomated(e.target.checked)}
          className="h-4 w-4 rounded border-amber-300 text-amber-500 focus:ring-amber-500" 
        />
        <Label htmlFor="is_automated" className="text-sm font-medium">Auto-sync from Spotify RSS</Label>
      </div>

      {isAutomated && (
        <div className="space-y-2 p-4 rounded-lg border border-amber-200/50 dark:border-amber-800/30 bg-white/50 dark:bg-slate-800/50">
          <Label htmlFor="rss_url">Spotify RSS Feed URL</Label>
          <Input 
            id="rss_url" 
            placeholder="https://anchor.fm/s/xxxxx/podcast/rss" 
            className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Episodes will be automatically synced from your Spotify podcast RSS feed
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input id="thumbnail" placeholder="https://example.com/image.jpg" className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500" />
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" className="border-slate-200 dark:border-slate-700">Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
          Create Podcast Series
        </Button>
      </div>
    </form>
  );
}

// Missing icons from lucide-react
function ChevronRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}

function SkipBack(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>;
}

function SkipForward(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
}