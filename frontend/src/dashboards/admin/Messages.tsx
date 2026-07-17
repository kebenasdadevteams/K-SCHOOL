import { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  ArrowLeft,
  Bell,
  Camera,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react';

type Contact = {
  id: number;
  name: string;
  role: string;
  preview: string;
  unread: number;
  time: string;
};

type ChatMessage = {
  id: number;
  sender: 'me' | 'them';
  text?: string;
  attachment?: {
    type: 'file' | 'image' | 'audio' | 'video';
    url: string;
    name?: string;
  };
  time: string;
};

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const [role] = useState(locationState?.role || 'admin');
  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : locationState?.role === 'developer' ? 'developer' : 'admin'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(1);
  const [draftMessage, setDraftMessage] = useState('');
  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox');

  const user = {
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com',
  };

  const navigateWithState = (path: string) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: activeView,
      },
    });
  };

  const contacts: Contact[] = useMemo(() => [
    { id: 1, name: 'Teacher Mary', role: 'Instructor', preview: 'Please submit your chapter summary.', unread: 2, time: '08:08' },
    { id: 2, name: 'Pastor John', role: 'Mentor', preview: 'Great work on your last assignment.', unread: 0, time: 'Yesterday' },
    { id: 3, name: 'Class Group', role: 'Study Group', preview: 'We will meet after the podcast.', unread: 4, time: '1d' },
    { id: 4, name: 'Lisa Baker', role: 'Volunteer', preview: 'I sent the resources you asked for.', unread: 1, time: '3d' },
  ], []);

  const [threads, setThreads] = useState<Record<number, ChatMessage[]>>({
    1: [
      { id: 1, sender: 'them', text: 'Please submit your chapter summary.', time: '09:10' },
      { id: 2, sender: 'me', text: 'I am working on it and will send it today.', time: '09:14' },
    ],
    2: [{ id: 1, sender: 'them', text: 'Great work on your last assignment.', time: 'Yesterday' }],
    3: [{ id: 1, sender: 'them', text: 'We will meet after the podcast.', time: '08:45' }],
    4: [
      { id: 1, sender: 'them', text: 'I sent the resources you asked for.', time: '10:12' },
      { id: 2, sender: 'me', text: 'Perfect, thank you!', time: '10:15' },
    ],
  });

  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      try {
        videoRef.current.srcObject = videoStream;
      } catch (err) {
        // ignore
      }
    }
    if (!videoStream && videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch (err) {}
    }
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [videoStream]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) || contacts[0];
  const messages = threads[selectedContactId] || [];

  const openConversation = (contactId: number) => {
    setSelectedContactId(contactId);
    setMobileView('chat');
  };

  const avatarTone = (id: number) => {
    const tones = ['bg-muted text-foreground ring-border', 'bg-muted text-foreground ring-border', 'bg-muted text-foreground ring-border', 'bg-muted text-foreground ring-border'];
    return tones[(id - 1) % tones.length];
  };

  const sendMessage = () => {
    const text = draftMessage.trim();
    if (!text) return;

    setThreads((current) => ({
      ...current,
      [selectedContactId]: [
        ...(current[selectedContactId] || []),
        {
          id: Date.now(),
          sender: 'me',
          text,
          time: 'Now',
        },
      ],
    }));
    setDraftMessage('');
  };

  const appendAttachment = (attachment: ChatMessage['attachment']) => {
    setThreads((current) => ({
      ...current,
      [selectedContactId]: [
        ...(current[selectedContactId] || []),
        {
          id: Date.now(),
          sender: 'me',
          attachment,
          time: 'Now',
        },
      ],
    }));
    setPlusMenuOpen(false);
  };

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const input = e?.target;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    appendAttachment({ type: 'file', url, name: file.name });
    if (input) input.value = '';
  };

  const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const input = e?.target;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    appendAttachment({ type: 'image', url, name: file.name });
    if (input) input.value = '';
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setVideoStream(stream);
      setCameraOpen(true);
      setPlusMenuOpen(false);
    } catch (err) {
      // ignore
    }
  };

  const capturePhoto = async (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 640;
    canvas.height = videoEl.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      appendAttachment({ type: 'image', url, name: 'photo.jpg' });
      // close camera
      if (videoStream) {
        videoStream.getTracks().forEach((t) => t.stop());
        setVideoStream(null);
      }
      setCameraOpen(false);
    }, 'image/jpeg');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        appendAttachment({ type: 'audio', url, name: 'recording.webm' });
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setMediaRecorder(null);
        setAudioChunks([]);
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
      setAudioChunks(chunks);
      setPlusMenuOpen(false);
    } catch (err) {
      // ignore
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const startVideoCallPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      setCameraOpen(true);
      setPlusMenuOpen(false);
    } catch (err) {
      // ignore
    }
  };

  const inboxHeader = (
    <div className="space-y-4 border-b bg-background px-4 pb-5 pt-3 text-foreground sm:px-5 sm:pb-6">
      <div className="flex items-center justify-end">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      <div>
        <h1 className="text-center text-2xl font-semibold tracking-tight">Chats</h1>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search message"
            className="h-11 rounded-full border border-border bg-background pl-11 pr-4 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Button variant="ghost" className="rounded-full bg-muted px-4 text-foreground hover:bg-muted/80">
          Message
        </Button>
        <div className="flex items-center gap-2 font-medium">
          <span className="text-muted-foreground">Active</span>
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );

  

  const inboxPane = (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {inboxHeader}
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-1 px-2 py-2">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openConversation(contact.id)}
              className={`group relative flex w-full items-center gap-3 px-3 py-3 text-left transition-shadow ${
                selectedContactId === contact.id
                  ? 'bg-muted border border-border shadow-sm' 
                  : 'bg-background border border-border/50 hover:shadow-sm'
              } rounded-lg`}
            >
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r ${selectedContactId === contact.id ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="pl-3" />
              <Avatar className={`h-14 w-14 shrink-0 ring-1 shadow-sm ${avatarTone(contact.id)}`}>
                <AvatarFallback className="bg-transparent">{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-foreground">{contact.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{contact.preview}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 pl-2 text-xs text-muted-foreground">
                    <span>{contact.time}</span>
                    {contact.unread > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const chatPane = (
    <div className="flex h-full min-h-0 flex-col bg-background lg:border-l lg:border-primary/40">
      <div className="flex items-center justify-between border-b px-4 pb-3 pt-4 text-foreground sm:px-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted lg:hidden" onClick={() => setMobileView('inbox')} aria-label="Back to chats">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden h-10 w-10 rounded-full hover:bg-muted lg:inline-flex" onClick={() => navigateWithState('/dashboard')} aria-label="Dashboard">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className={`h-11 w-11 border shadow-sm ${avatarTone(selectedContact.id)}`}>
              <AvatarFallback className="bg-transparent">{selectedContact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold leading-none">{selectedContact.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" aria-label="Call">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" aria-label="Video call">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" aria-label="More options">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4 py-4 sm:px-5">
        <div className="space-y-4 pb-4">
          <div className="mx-auto w-fit rounded-2xl border bg-muted px-4 py-2 text-sm text-foreground shadow-sm">
            Friends, Romans, countrymen, lend me your ears; I come to bury Caesar, not to praise him.
          </div>

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                  message.sender === 'me' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border bg-background text-foreground'
                }`}
              >
                {message.attachment ? (
                  <div className="space-y-2">
                    {message.attachment.type === 'image' && (
                      <img src={message.attachment.url} alt={message.attachment.name} className="max-h-72 w-auto rounded-md" />
                    )}
                    {message.attachment.type === 'file' && (
                      <a href={message.attachment.url} download={message.attachment.name} className="text-sm text-primary underline">
                        {message.attachment.name || 'Download file'}
                      </a>
                    )}
                    {message.attachment.type === 'audio' && (
                      <audio controls src={message.attachment.url} className="w-full" />
                    )}
                    {message.attachment.type === 'video' && (
                      <video controls src={message.attachment.url} className="max-h-72 w-auto rounded-md" />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
                <p className={`mt-1 text-[11px] ${message.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{message.time}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <div className="rounded-3xl rounded-br-md border bg-background px-4 py-3 text-sm text-foreground shadow-sm">
              <span className="mr-1">🙂</span>
              <span>🙂</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t bg-background px-3 py-3 sm:px-4">
        <div className="relative flex items-end gap-2 rounded-3xl border bg-muted/30 px-3 py-2 shadow-sm">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full hover:bg-muted"
              aria-label="Attach file"
              onClick={() => setPlusMenuOpen((s) => !s)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            {plusMenuOpen && (
              <div className="absolute left-0 bottom-12 w-44 rounded-lg border bg-background p-2 shadow-lg">
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Attach file</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <span>Upload photo</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted" onClick={openCamera}>
                  <Camera className="h-4 w-4" />
                  <span>Take photo</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => (recording ? stopRecording() : startRecording())}
                >
                  <Mic className="h-4 w-4" />
                  <span>{recording ? 'Stop recording' : 'Record voice'}</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted" onClick={startVideoCallPreview}>
                  <Video className="h-4 w-4" />
                  <span>Video chat</span>
                </button>
              </div>
            )}
          </div>
          <Textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder={`Message ${selectedContact.name}`}
            rows={1}
            className="min-h-10 flex-1 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full hover:bg-muted" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={sendMessage} className="h-10 w-10 shrink-0 rounded-full p-0" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <input ref={fileInputRef} onChange={(e) => onSelectFile(e)} type="file" className="hidden" />
        <input ref={imageInputRef} onChange={(e) => onSelectImage(e)} accept="image/*" type="file" className="hidden" />

        {/* Camera / video preview modal */}
        {cameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-2xl rounded-lg bg-background p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Camera</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => { if (videoStream) { videoStream.getTracks().forEach((t) => t.stop()); setVideoStream(null);} setCameraOpen(false); }}>
                    Close
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <video ref={videoRef} autoPlay playsInline muted className="h-72 w-full rounded-md bg-black" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button onClick={() => capturePhoto(videoRef.current)}>Capture photo</Button>
                <Button variant="ghost" onClick={() => { if (videoStream) { videoStream.getTracks().forEach((t) => t.stop()); setVideoStream(null);} setCameraOpen(false); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:grid lg:grid-cols-[360px_1fr] min-h-[calc(100vh-4rem)]">
        <div className={`hidden lg:flex lg:flex-col border-r border-border ${mobileView === 'chat' ? 'lg:hidden' : ''}`}>
          {inboxPane}
        </div>
        <div className="min-h-[calc(100vh-4rem)]">
          {chatPane}
        </div>
      </div>
    </div>
  );
}
