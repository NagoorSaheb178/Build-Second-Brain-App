"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Brain,
    MoreVertical,
    Paperclip,
    Smile,
    RotateCcw,
    Zap,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { askPuterAI } from '@/lib/puter-ai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    isSummarizing?: boolean;
}

interface AIChatProps {
    onClose: () => void;
    mode?: 'modal' | 'panel';
    initialMessage?: string;
    isDashboard?: boolean;
}

export default function AIChat({ onClose, mode = 'modal', initialMessage, isDashboard = false }: AIChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: isDashboard
                ? 'Welcome to your Second Brain dashboard! I can help you find, summarize, or connect your notes. What are you looking for?'
                : 'Hi! I am the Second Brain assistant. How can I help you understand how to supercharge your knowledge today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const processedMessageRef = useRef<string | null>(null);

    // Initial message handling (e.g., from "Summarize" click)
    useEffect(() => {
        if (initialMessage && initialMessage !== processedMessageRef.current) {
            processedMessageRef.current = initialMessage;
            handleSend(null, initialMessage);
        }
    }, [initialMessage]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent | null, forcedMessage?: string) => {
        if (e) e.preventDefault();
        const messageText = forcedMessage || input.trim();
        if (!messageText || isTyping) return;

        if (!forcedMessage) setInput('');

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'user', content: messageText, timestamp }]);
        setIsTyping(true);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 'demo-user';

        try {
            let enrichedPrompt = messageText;

            if (isDashboard) {
                // 1. Fetch relevant context from the brain
                const contextRes = await fetch(`/api/public/brain/query?query=${encodeURIComponent(messageText)}&userId=${userId}`);
                const contextData = await contextRes.json();

                if (contextData.sources && contextData.sources.length > 0) {
                    const sourcesText = contextData.sources.map((s: any) => `[Source Note: ${s.title}]: ${s.content}`).join('\n\n');
                    enrichedPrompt = `You are a helpful knowledge assistant inside the user's Second Brain. Answer their question naturally using ONLY the relevant notes provided.

NOTES PROVIDED:
${sourcesText}

EXACT FORMATTING RULES:
1. Start with "🧠 AI Answer:"
2. Provide a detailed explanation (3-4 sentences). 
3. Do NOT mention internal database details, "stored notes", or "system". Just explain the concepts.
4. After the answer, add a section called "📚 Sources:"
5. List only the titles that directly contributed, using bullet points (•).

User Question: ${messageText}`;
                } else {
                    enrichedPrompt = `You are a helpful knowledge assistant.
                    The user asked: "${messageText}". 
                    I couldn't find any specific notes on this in their collection.
                    
                    INSTRUCTIONS:
                    1. Provide a clear, helpful 3-4 sentence answer based on your general knowledge.
                    2. Start with "🧠 AI Answer:".
                    3. Do NOT include a Sources section.
                    4. Politely suggest they add notes on this topic to their Second Brain.`;
                }
            } else {
                // Home page assistant mode
                enrichedPrompt = `You are a friendly and helpful AI assistant for the "Second Brain" landing page. 
                Explain what a second brain is (Capture, Organize, Summarize) and how this app helps. 
                Keep it high-level and inviting. Do NOT mention specific notes or try to search a database.
                User says: ${messageText}`;
            }

            // 2. Ask the AI with context
            const response = await askPuterAI(enrichedPrompt);
            const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Detect if it's a summary/answer from our specific template
            const looksLikeSummary = response?.includes('🧠 AI Answer:');

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response || "I couldn't process that request.",
                timestamp: aiTimestamp,
                isSummarizing: looksLikeSummary
            }]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now.", timestamp: errTimestamp }]);
        } finally {
            setIsTyping(false);
        }
    };

    const resetChat = () => {
        setMessages([{
            role: 'assistant',
            content: 'Chat history cleared. How can I help you now?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    return (
        <div className={cn(
            "bg-white flex flex-col h-full overflow-hidden",
            mode === 'modal' ? "shadow-2xl border border-slate-100 rounded-[32px]" : ""
        )}>
            {/* WhatsApp Style Header */}
            <header className="bg-[#1e144a] p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white/20 shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1e144a] rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-black text-white uppercase tracking-widest leading-none">
                            {isDashboard ? 'Brain Assistant' : 'Welcome Assistant'}
                        </h3>
                        <p className="text-[10px] text-indigo-300/80 font-medium mt-1">
                            {isTyping ? '🧠 Processing Brilliance...' : 'Online • Ready to help'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={resetChat} className="p-2 text-indigo-300/40 hover:text-white transition-all rounded-lg hover:bg-white/5">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-indigo-300/40 hover:text-white transition-all rounded-lg hover:bg-white/5">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {mode === 'modal' && (
                        <button onClick={onClose} className="p-2 text-indigo-300/40 hover:text-white transition-all rounded-lg hover:bg-white/5">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </header>

            {/* Chat Body - Added data-lenis-prevent to restore native scroll */}
            <div
                ref={scrollRef}
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fdfbf7]/60 custom-scrollbar overscroll-contain"
            >
                {messages.map((m, i) => (
                    <motion.div
                        key={`chat-bubble-${i}`}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={cn(
                            "flex w-full mb-1",
                            m.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[85%] relative p-3.5 shadow-sm transition-all",
                            m.role === 'user'
                                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                                : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
                        )}>
                            <p className="text-[13px] sm:text-[14px] leading-relaxed font-medium">
                                {m.content}
                            </p>
                            {m.isSummarizing && (
                                <div className="mt-2 pt-2 border-t border-indigo-100/20">
                                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest opacity-60">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Summary Generated
                                    </div>
                                </div>
                            )}
                            <div className={cn(
                                "flex items-center gap-2 mt-1.5",
                                m.role === 'user' ? "justify-end" : "justify-start"
                            )}>
                                <span className={cn(
                                    "text-[8px] font-bold uppercase tracking-widest",
                                    m.role === 'user' ? "text-indigo-200/60" : "text-slate-400"
                                )}>
                                    {m.timestamp}
                                </span>
                                {m.role === 'assistant' && <Sparkles className="w-2.5 h-2.5 text-indigo-400" />}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-inner">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Interaction Bar */}
            <div className="p-4 bg-white border-t border-slate-100/50">
                <form
                    onSubmit={(e) => handleSend(e)}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-full p-1.5 px-3 group focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all"
                >
                    <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[15px] sm:text-[13px] font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 bg-[#1e144a] text-white rounded-full flex items-center justify-center hover:bg-indigo-900 active:scale-95 transition-all shadow-lg disabled:opacity-50 shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
