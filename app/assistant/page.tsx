'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Send,
  ArrowLeft,
  Leaf,
  Cloud,
  Pill,
  TrendingUp,
  ArrowUpRight,
  Play,
  Pause,
  Mic,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Insight {
  type: string;
  title: string;
  description: string;
}

interface QueryResult {
  summary: string;
  insights: Insight[];
  risk_score: number;
  final_score: number;
  confidence_level: string;
  language: string;
  audio_url: string | null;
}

interface Question {
  field: string;
  question: string;
  question_ta: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  result?: QueryResult;
  questions?: Question[];
  isLoading?: boolean;
  isForm?: boolean;
  isError?: boolean;
}

const uiText = {
  EN: {
    title: 'Farm Assistant',
    subtitle: 'Your AI farming guide',
    inputPlaceholder: 'Ask a follow-up question...',
    analyzing: 'Analyzing your farm...',
    analyzingSubtext: 'This takes about 30 seconds',
    play: 'Play voice',
    playing: 'Playing...',
    listenTamil: 'Listen in Tamil',
    generatingAudio: 'Generating Tamil audio...',
    moreDetails: 'I need a few more details:',
    analyze: 'Analyze →',
    retry: 'Retry',
    errorMsg: 'Could not connect to server. Make sure backend is running.',
    viewRec: 'View recommendation',
  },
  TA: {
    title: 'பண்ணை உதவியாளர்',
    subtitle: 'உங்கள் AI வழிகாட்டி',
    inputPlaceholder: 'அடுத்த கேள்வியை கேளுங்கள்...',
    analyzing: 'பகுப்பாய்வு செய்கிறோம்...',
    analyzingSubtext: 'சுமார் 30 விநாடிகள் ஆகும்',
    play: 'குரல் இயக்கு',
    playing: 'இயங்குகிறது...',
    listenTamil: 'தமிழில் கேளுங்கள்',
    generatingAudio: 'ஆடியோ உருவாக்கப்படுகிறது...',
    moreDetails: 'சில விவரங்கள் தேவை:',
    analyze: 'பகுப்பாய்வு →',
    retry: 'மீண்டும் முயற்சி',
    errorMsg: 'இணைக்க முடியவில்லை. Backend இயங்குகிறதா என சரிபார்க்கவும்.',
    viewRec: 'பரிந்துரை காண்க',
  },
} as const;

const CARD_ICONS = [Leaf, Cloud, Pill, TrendingUp];
const CARD_TONES = [
  'from-primary/20 to-primary/5',
  'from-secondary/20 to-secondary/5',
  'from-accent/20 to-accent/5',
  'from-primary/15 to-accent/10',
];

function AssistantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialLang = (searchParams.get('lang') as 'EN' | 'TA') || 'EN';
  const cropParam = searchParams.get('crop') || '';
  const locationParam = searchParams.get('location') || '';
  const monthParam = searchParams.get('month') || '';
  const irrigationParam = searchParams.get('irrigation') || '';

  const [language, setLanguage] = useState<'EN' | 'TA'>(initialLang);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [context, setContext] = useState({
    crop: cropParam,
    location: locationParam,
    month: monthParam,
    irrigation: irrigationParam,
    land_size_acres: 2,
    market_dependency: true,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = uiText[language];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialQuery) {
      runQuery(initialQuery, {
        crop: cropParam,
        location: locationParam,
        month: monthParam,
        irrigation: irrigationParam,
        land_size_acres: 2,
        market_dependency: true,
      });
    }
  }, []);

  const runQuery = async (q: string, ctx: Record<string, any>) => {
    const userMsgId = Date.now().toString();
    const loadingId = userMsgId + '-loading';

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: q },
      { id: loadingId, role: 'assistant', text: '', isLoading: true },
    ]);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          language,
          context: {
            crop: ctx.crop || '',
            location: ctx.location || '',
            month: ctx.month || '',
            irrigation: ctx.irrigation || '',
            land_size_acres: ctx.land_size_acres || 2,
            market_dependency: ctx.market_dependency ?? true,
          },
        }),
      });

      const data = await res.json();

      if (data.status === 'complete' && data.result) {
        setContext(ctx as typeof context);
        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? { ...m, isLoading: false, result: data.result, text: data.result.summary }
              : m
          )
        );
        if (data.result.language === 'TA' || language === 'TA') {
          fetchAudio(data.result.summary);
        }
      } else if (data.status === 'questions_needed') {
        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? { ...m, isLoading: false, isForm: true, questions: data.questions, text: '' }
              : m
          )
        );
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? { ...m, isLoading: false, isError: true, text: t.errorMsg }
              : m
          )
        );
      }
    } catch (e) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, isLoading: false, isError: true, text: t.errorMsg }
            : m
        )
      );
    }
  };

  const fetchAudio = async (text: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'TA' }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.play().catch(() => {});
            setPlaying(true);
          }
        }, 800);
      }
    } catch (e) {
      console.log('TTS error:', e);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setInput('');
    runQuery(q, context);
  };

  const handleFormSubmit = (questions: Question[]) => {
    const ctx = { ...context };
    questions.forEach(q => {
      if (formAnswers[q.field]) (ctx as any)[q.field] = formAnswers[q.field];
    });
    setContext(ctx);
    setFormAnswers({});
    runQuery(initialQuery || input, ctx);
  };

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Use Chrome for voice input'); return; }
    const recognition = new SR();
    recognition.lang = language === 'TA' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background relative"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/?lang=${language}`)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setLanguage(l => l === 'EN' ? 'TA' : 'EN')}
            className="px-3 py-1 rounded-full bg-muted border border-border text-sm font-bold text-foreground"
          >
            {language === 'EN' ? 'TA' : 'EN'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-4 pb-44 space-y-4">
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%] shadow-sm text-sm"
                  >
                    {msg.text}
                  </motion.div>
                </div>
              );
            }

            if (msg.isLoading) {
              return (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 p-[1px] mt-1 shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                      <Image src="/images/farmer-mascot.png" alt="AI" fill className="object-cover" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted rounded-2xl rounded-tl-md px-4 py-4 shadow-sm"
                  >
                    <p className="text-sm text-foreground font-medium">{t.analyzing}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.analyzingSubtext}</p>
                    <div className="flex gap-1 mt-3">
                      {[0,1,2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            }

            if (msg.isForm && msg.questions) {
              return (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 p-[1px] mt-1 shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                      <Image src="/images/farmer-mascot.png" alt="AI" fill className="object-cover" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted rounded-2xl rounded-tl-md px-4 py-4 max-w-[85%] shadow-sm"
                  >
                    <p className="text-sm font-semibold text-foreground mb-3">{t.moreDetails}</p>
                    {msg.questions.map(q => (
                      <div key={q.field} className="mb-3">
                        <label className="text-xs text-muted-foreground block mb-1">
                          {language === 'TA' ? q.question_ta : q.question}
                        </label>
                        <input
                          value={formAnswers[q.field] || ''}
                          onChange={e => setFormAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none"
                          placeholder="Type your answer..."
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleFormSubmit(msg.questions!)}
                      className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-bold mt-1"
                    >
                      {t.analyze}
                    </button>
                  </motion.div>
                </div>
              );
            }

            if (msg.isError) {
              return (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 p-[1px] mt-1 shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                      <Image src="/images/farmer-mascot.png" alt="AI" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-red-600">{msg.text}</p>
                    <button
                      onClick={() => runQuery(initialQuery, context)}
                      className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-full"
                    >
                      {t.retry}
                    </button>
                  </div>
                </div>
              );
            }

            if (msg.result) {
              const insights = msg.result.insights || [];
              return (
                <div key={msg.id} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 p-[1px] mt-1 shrink-0">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                        <Image src="/images/farmer-mascot.png" alt="AI" fill className="object-cover" />
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted text-foreground rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%] shadow-sm"
                    >
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                        msg.result.confidence_level === 'high' ? 'bg-green-100 text-green-700' :
                        msg.result.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {msg.result.confidence_level === 'high' ? '🟢 High' :
                         msg.result.confidence_level === 'medium' ? '🟡 Medium' : '🔴 Low'} Confidence
                      </span>

                      <p className="text-sm leading-relaxed mt-1">{msg.result.summary}</p>

                      {/* Tamil Audio Player */}
                      {(msg.result.language === 'TA' || language === 'TA') && (
                        <div className="mt-3 rounded-2xl bg-background/80 border border-border px-3 py-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={toggleAudio}
                              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"
                            >
                              {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-[1px]" />}
                            </button>
                            <div className="flex-1 flex items-end gap-1 h-5">
                              {[2,4,3,5,3,4,2].map((h, i) => (
                                <span key={i} className="w-1 rounded-full bg-primary/70" style={{ height: `${h*4}px` }} />
                              ))}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {audioUrl ? (playing ? t.playing : t.listenTamil) : t.generatingAudio}
                            </span>
                          </div>
                          <audio ref={audioRef} src={audioUrl || ''} onEnded={() => setPlaying(false)} />
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* 4 Cards */}
                  <motion.div
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-10 grid grid-cols-2 gap-3 pb-2"
                  >
                    {insights.map((insight, i) => {
                      const IconComp = CARD_ICONS[i] || Leaf;
                      return (
                        <div
                          key={i}
                          className={`rounded-2xl shadow-sm p-3 h-28 bg-gradient-to-br ${CARD_TONES[i] || 'from-gray-100 to-gray-50'} border border-border flex flex-col justify-between`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-background/80 flex items-center justify-center shrink-0">
                              <IconComp className="w-4 h-4 text-foreground" />
                            </div>
                            <p className="font-semibold text-sm text-foreground leading-tight">{insight.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-tight line-clamp-2">{insight.description}</p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>{t.viewRec}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            }

            return null;
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-16 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-2 rounded-full bg-card/90 border border-border shadow-sm p-1">
            <input
              type="text"
              placeholder={t.inputPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent rounded-full px-3 py-2.5 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleVoice}
              className={`w-10 h-10 rounded
