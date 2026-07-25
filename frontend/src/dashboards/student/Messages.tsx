import { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../../SidebarLayout';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Badge } from '../../components/ui/badge';
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
  Sparkles,
  Zap,
  Users,
  Circle,
  Check,
  CheckCheck,
  Clock,
  Star,
  User,
  AtSign,
  Link,
  File,
  Image,
  Music,
  Play,
  Pause,
  X
} from 'lucide-react';

type Contact = {
  id: number;
  name: string;
  role: string;
  preview: string;
  unread: number;
  time: string;
  online?: boolean;
  lastSeen?: string;
  avatarColor?: string;
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
  read?: boolean;
  delivered?: boolean;
};

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const [role] = useState(locationState?.role || 'student');
  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(locationState?.view ?? 'student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(1);
  const [draftMessage, setDraftMessage] = useState('');
  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox');
  const [typingContact, setTypingContact] = useState<number | null>(null);

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

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [threads, setThreads] = useState<Record<number, ChatMessage[]>>({});
  const fallbackContact: Contact = {
    id: 0,
    name: 'Inbox',
    role: 'Conversations',
    preview: 'Choose a conversation to view messages.',
    unread: 0,
    time: '',
    online: false,
  };

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

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await api.get('/activity/messages');
        const loadedMessages = (data.data || []).map((message: any) => ({
          id: message.id,
          sender: message.sender_id === Number(localStorage.getItem('kschool_user') ? JSON.parse(localStorage.getItem('kschool_user') || '{}').id : 0) ? 'me' : 'them',
          text: message.content,
          time: new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          read: true,
          delivered: true,
        }));

        const grouped: Record<number, ChatMessage[]> = {};
        loadedMessages.forEach((message: ChatMessage) => {
          const key = Number(message.id) % 4 || 1;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(message);
        });

        setThreads(grouped);
        setContacts([
          { id: 1, name: 'Teacher Mary', role: 'Instructor', preview: 'Your latest updates are ready.', unread: 0, time: 'Now', online: true },
          { id: 2, name: 'Pastor John', role: 'Mentor', preview: 'Great work on your latest assignment.', unread: 0, time: 'Today', online: false },
        ]);
      } catch (error) {
        console.error('Unable to load messages', error);
      }
    };

    loadMessages();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) || contacts[0] || fallbackContact;
  const messages = threads[selectedContactId] || [];
  const selectedContactName = selectedContact?.name || 'Inbox';
  const selectedContactInitial = selectedContact?.name?.charAt(0) || 'I';

  const openConversation = (contactId: number) => {
    setSelectedContactId(contactId);
    setMobileView('chat');
    setThreads((current) => ({
      ...current,
      [contactId]: current[contactId]?.map(msg => 
        msg.sender === 'them' ? { ...msg, read: true } : msg
      ) || []
    }));
  };

  const sendMessage = async () => {
    const text = draftMessage.trim();
    if (!text) return;

    try {
      await api.post('/activity/messages', {
        receiver_id: selectedContactId,
        content: text,
      });

      setThreads((current) => ({
        ...current,
        [selectedContactId]: [
          ...(current[selectedContactId] || []),
          {
            id: Date.now(),
            sender: 'me',
            text,
            time: 'Now',
            delivered: true,
            read: false,
          },
        ],
      }));
      setDraftMessage('');
    } catch (error) {
      console.error('Unable to send message', error);
      alert('Your message could not be saved. Please try again.');
    }
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
          delivered: true,
          read: false,
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

  useEffect(() => {
    if (selectedContactId && Math.random() > 0.5) {
      const timer = setTimeout(() => {
        setTypingContact(selectedContactId);
        setTimeout(() => setTypingContact(null), 3000);
      }, 2000 + Math.random() * 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedContactId, messages.length]);

  // Simple clean inbox header
  const inboxHeader = (
    <div className="space-y-4 border-b border-[#E0AE3F]/10 px-5 pb-5 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-[#865014]">
            Messages
          </h1>
          <span className="text-xs font-medium text-[#865014]/60 bg-[#F6EBD8] px-2.5 py-0.5 rounded-full">
            {contacts.reduce((sum, c) => sum + c.unread, 0)} new
          </span>
        </div>
        <button className="p-2 rounded-full hover:bg-[#F6EBD8] transition-colors">
          <Bell className="h-5 w-5 text-[#865014]/60" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#865014]/40" />
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search conversations..."
          className="h-10 border-[#E0AE3F]/20 bg-[#F6EBD8]/30 pl-9 pr-4 text-sm rounded-xl focus-visible:ring-[#865014]/30 focus-visible:border-[#865014]/30 transition-all placeholder:text-[#865014]/30"
        />
      </div>
    </div>
  );

  // Clean minimal contact list
  const inboxPane = (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {inboxHeader}
      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        <div className="space-y-1">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openConversation(contact.id)}
              className={`group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all rounded-xl ${
                selectedContactId === contact.id
                  ? 'bg-[#F6EBD8]' 
                  : 'hover:bg-[#F6EBD8]/50'
              }`}
            >
              <div className="relative">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#865014] to-[#E0AE3F] flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-[#1a1a1a]">{contact.name}</p>
                  <span className="text-xs text-[#865014]/40 flex-shrink-0 ml-2">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs text-[#865014]/60">{contact.preview}</p>
                  {contact.unread > 0 && (
                    <span className="ml-2 h-5 min-w-[20px] flex-shrink-0 rounded-full bg-[#865014] px-1.5 text-[10px] font-medium text-white flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Clean minimal chat view
  const chatPane = (
    <div className="flex h-full min-h-0 flex-col bg-[#F6EBD8]/20">
      {/* Chat Header - Minimal */}
      <div className="flex items-center justify-between border-b border-[#E0AE3F]/10 bg-white/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-1.5 rounded-full hover:bg-[#F6EBD8] transition-colors"
            onClick={() => setMobileView('inbox')}
          >
            <ArrowLeft className="h-5 w-5 text-[#865014]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#865014] to-[#E0AE3F] flex items-center justify-center text-white font-medium text-sm shadow-sm">
              {selectedContactInitial}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">{selectedContactName}</h2>
              <p className="text-xs text-[#865014]/50">
                {selectedContact.id === 0 ? 'Select a conversation to begin' : selectedContact.online ? 'Online' : `Last seen ${selectedContact.lastSeen || 'recently'}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-full hover:bg-[#F6EBD8] transition-colors">
            <Phone className="h-4 w-4 text-[#865014]/60" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#F6EBD8] transition-colors">
            <Video className="h-4 w-4 text-[#865014]/60" />
          </button>
        </div>
      </div>

      {/* Messages - Clean bubbles */}
      <ScrollArea className="flex-1 min-h-0 px-4 py-4">
        <div className="space-y-2 pb-4">
          {messages.map((message, index) => {
            const isMe = message.sender === 'me';
            return (
              <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2.5 text-sm rounded-2xl ${
                      isMe 
                        ? 'bg-[#865014] text-white rounded-br-sm' 
                        : 'bg-white border border-[#E0AE3F]/10 text-[#1a1a1a] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {message.attachment ? (
                      <div className="space-y-2">
                        {message.attachment.type === 'image' && (
                          <img src={message.attachment.url} alt={message.attachment.name} className="max-h-60 w-auto rounded-lg" />
                        )}
                        {message.attachment.type === 'file' && (
                          <a href={message.attachment.url} download={message.attachment.name} className={`flex items-center gap-2 text-sm ${isMe ? 'text-white/90' : 'text-[#865014]'} underline`}>
                            <File className="h-4 w-4" />
                            {message.attachment.name || 'Download file'}
                          </a>
                        )}
                        {message.attachment.type === 'audio' && (
                          <audio controls src={message.attachment.url} className="w-full" />
                        )}
                        {message.attachment.type === 'video' && (
                          <video controls src={message.attachment.url} className="max-h-60 w-auto rounded-lg" />
                        )}
                        {message.text && <p>{message.text}</p>}
                      </div>
                    ) : (
                      <p className="leading-relaxed">{message.text}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-[#865014]/40">{message.time}</span>
                    {isMe && (
                      <span>
                        {message.read ? (
                          <CheckCheck className="h-3 w-3 text-emerald-500" />
                        ) : message.delivered ? (
                          <Check className="h-3 w-3 text-[#865014]/30" />
                        ) : (
                          <Clock className="h-3 w-3 text-[#865014]/30" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {typingContact === selectedContactId && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E0AE3F]/10 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#865014]/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-2 w-2 rounded-full bg-[#865014]/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-2 w-2 rounded-full bg-[#865014]/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input - Minimal */}
      <div className="border-t border-[#E0AE3F]/10 bg-white/80 backdrop-blur-sm px-3 py-3">
        <div className="flex items-end gap-2 bg-[#F6EBD8]/30 rounded-2xl border border-[#E0AE3F]/10 px-3 py-1.5 focus-within:border-[#865014]/30 focus-within:ring-1 focus-within:ring-[#865014]/20 transition-all">
          <button
            className="p-1.5 rounded-full hover:bg-[#F6EBD8] transition-colors flex-shrink-0"
            onClick={() => setPlusMenuOpen((s) => !s)}
          >
            <Plus className={`h-5 w-5 text-[#865014]/60 transition-transform ${plusMenuOpen ? 'rotate-45' : ''}`} />
          </button>

          {plusMenuOpen && (
            <div className="absolute bottom-14 left-0 w-48 rounded-xl border border-[#E0AE3F]/10 bg-white shadow-lg p-1.5 z-10 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2">
              {[
                { icon: Paperclip, label: 'File', action: () => fileInputRef.current?.click() },
                { icon: Image, label: 'Photo', action: () => imageInputRef.current?.click() },
                { icon: Camera, label: 'Camera', action: openCamera },
                { icon: Mic, label: recording ? 'Stop' : 'Voice', action: () => recording ? stopRecording() : startRecording() },
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#F6EBD8] transition-colors"
                  onClick={item.action}
                >
                  <item.icon className={`h-4 w-4 ${recording && item.label === 'Stop' ? 'text-red-500 animate-pulse' : 'text-[#865014]/60'}`} />
                  <span className="text-[#1a1a1a]">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <Textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="Type a message..."
            rows={1}
            className="min-h-9 flex-1 resize-none border-0 bg-transparent px-1 py-1.5 shadow-none focus-visible:ring-0 text-sm placeholder:text-[#865014]/30"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />

          <button className="p-1.5 rounded-full hover:bg-[#F6EBD8] transition-colors flex-shrink-0">
            <Smile className="h-5 w-5 text-[#865014]/60" />
          </button>

          <button 
            onClick={sendMessage} 
            className="h-9 w-9 flex-shrink-0 rounded-full bg-[#865014] text-white hover:bg-[#865014]/90 transition-colors flex items-center justify-center"
            disabled={!draftMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <input ref={fileInputRef} onChange={(e) => onSelectFile(e)} type="file" className="hidden" />
        <input ref={imageInputRef} onChange={(e) => onSelectImage(e)} accept="image/*" type="file" className="hidden" />

        {/* Camera Modal */}
        {cameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-[#1a1a1a]">Camera</h3>
                <button 
                  className="p-1.5 rounded-full hover:bg-[#F6EBD8] transition-colors"
                  onClick={() => { 
                    if (videoStream) { videoStream.getTracks().forEach((t) => t.stop()); setVideoStream(null);} 
                    setCameraOpen(false); 
                  }}
                >
                  <X className="h-5 w-5 text-[#865014]/60" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="h-56 w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <button 
                  onClick={() => capturePhoto(videoRef.current)} 
                  className="px-5 py-2 rounded-full bg-[#865014] text-white text-sm font-medium hover:bg-[#865014]/90 transition-colors"
                >
                  <Camera className="h-4 w-4 inline mr-2" />
                  Capture
                </button>
                <button 
                  className="px-5 py-2 rounded-full border border-[#E0AE3F]/20 text-sm text-[#865014] hover:bg-[#F6EBD8] transition-colors"
                  onClick={() => { 
                    if (videoStream) { videoStream.getTracks().forEach((t) => t.stop()); setVideoStream(null);} 
                    setCameraOpen(false); 
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <SidebarLayout userRole={role} userName={user.full_name} userEmail={user.email} activeView={activeView}>
      <div className="h-[calc(100dvh-4rem)]">
        <div className="h-full overflow-hidden rounded-2xl border border-[#E0AE3F]/10 bg-white shadow-sm">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[340px_1fr]">
            <div className={`${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-r border-[#E0AE3F]/10`}>
              {inboxPane}
            </div>
            <div className={`${mobileView === 'inbox' ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col`}>
              {chatPane}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}