"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Grid,
    List,
    Plus,
    LogOut,
    Clock,
    ExternalLink,
    MoreVertical,
    Type,
    Link as LinkIcon,
    Lightbulb,
    Tag as TagIcon,
    MessageSquare,
    Sparkles,
    Brain,
    Share2,
    Zap,
    Bot,
    ChevronRight,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import KnowledgeForm from './KnowledgeForm';
import AIChat from './AIChat';
import GraphView from './GraphView';
import CommandPalette from './CommandPalette';
import { SkeletonCard } from './SkeletonLoader';
import Lenis from 'lenis';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KnowledgeItem {
    _id: string;
    title: string;
    content: string;
    summary?: string;
    type: 'note' | 'link' | 'insight';
    tags: string[];
    sourceUrl?: string;
    createdAt: string;
    userId?: string;
}

export default function Dashboard() {
    const router = useRouter();
    interface User { id?: string; name?: string; email?: string; }
    const [items, setItems] = useState<KnowledgeItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'note' | 'link' | 'insight'>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [view, setView] = useState<'grid' | 'graph'>('grid');
    const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('Home');
    const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const filteredItems = items
        .filter(item => {
            const matchesFilter = filter === 'all' || item.type === filter;
            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.content.toLowerCase().includes(search.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || 'demo-user';

            const query = new URLSearchParams({
                userId,
                type: filter,
                search
            });
            const res = await fetch(`/api/knowledge?${query}`);
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();

        const handleGlobalClick = () => {
            setMenuOpenId(null);
            setIsProfileMenuOpen(false);
        };
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        window.addEventListener('click', handleGlobalClick);
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleGlobalKeyDown);
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(fetchItems, 300);
        return () => clearTimeout(timer);
    }, [search, filter]);

    useEffect(() => {
        if (isFormOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isFormOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brilliance?')) return;
        try {
            const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
            if (res.ok) fetchItems();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (item: KnowledgeItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
        setMenuOpenId(null);
    };

    interface TopBarProps {
        search: string;
        setSearch: (val: string) => void;
        setIsFormOpen: (val: boolean) => void;
        user: { name?: string; email?: string } | null;
        handleLogout: () => void;
        isProfileMenuOpen: boolean;
        setIsProfileMenuOpen: (val: boolean) => void;
    }

    const TopBar = ({ search, setSearch, setIsFormOpen, user, handleLogout, isProfileMenuOpen, setIsProfileMenuOpen }: TopBarProps) => (
        <div className="sticky top-4 z-[100] px-8">
            <header className="h-14 bg-[#1e144a] border border-white/10 rounded-full px-6 flex items-center justify-between shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/50" />
                        <span className="hidden sm:block text-lg font-black tracking-tighter uppercase text-white shimmer-logo">
                            <span className="text-shimmer">Second</span> <span className="opacity-50">Brain</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1 max-w-lg relative px-2 sm:px-10">
                    <div className="relative group">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 sm:py-2 sm:pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all placeholder:text-white/20 font-medium text-[9px] sm:text-xs text-white"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFormOpen(true)}
                        className="bg-white text-[#1e144a] px-3 sm:px-5 py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/20 group"
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 h-4 transition-transform group-hover:rotate-90" />
                        <span className="hidden xs:block">New Note</span>
                        <span className="xs:hidden">New</span>
                    </motion.button>

                    <div className="h-8 w-[1px] bg-white/10 mx-1 sm:mx-2" />

                    <div className="flex items-center gap-3 relative">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{user?.name || 'User'}</span>
                            {/* Desktop logout removed as requested to match mobile behavior (inside profile menu) */}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsProfileMenuOpen(!isProfileMenuOpen);
                            }}
                            className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white/20 text-white font-black text-[10px] uppercase shadow-inner hover:scale-105 active:scale-95 transition-transform"
                        >
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'NU'}
                        </button>

                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-12 w-48 bg-[#1e144a] border border-white/10 rounded-3xl shadow-2xl p-2 overflow-hidden overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-wider">{user?.name || 'User Profile'}</p>
                                        <p className="text-[8px] font-medium text-white/40 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all rounded-2xl"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>
        </div>
    );

    interface ItemCardProps {
        item: KnowledgeItem;
        router: any;
        setIsAssistantOpen: (val: boolean) => void;
        setChatInitialMessage: (msg: string) => void;
        menuOpenId: string | null;
        setMenuOpenId: (id: string | null) => void;
        handleEdit: (item: KnowledgeItem) => void;
        handleDelete: (id: string) => void;
    }

    const ItemCard = ({ item, router, setIsAssistantOpen, setChatInitialMessage, menuOpenId, setMenuOpenId, handleEdit, handleDelete }: ItemCardProps) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200/50 transition-all cursor-pointer overflow-hidden"
            onClick={() => router.push(`/knowledge/${item._id}`)}
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        item.type === 'note' && "bg-blue-50 border-blue-100 text-blue-600",
                        item.type === 'link' && "bg-emerald-50 border-emerald-100 text-emerald-600",
                        item.type === 'insight' && "bg-amber-50 border-amber-100 text-amber-600"
                    )}>
                        {item.type === 'note' && <Type className="w-5 h-5" />}
                        {item.type === 'link' && <LinkIcon className="w-5 h-5" />}
                        {item.type === 'insight' && <Lightbulb className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight truncate group-hover:text-amber-600 transition-colors mb-1">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 relative z-20">
                    {item.summary && (
                        <div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100/50 text-[8px] font-black uppercase tracking-widest mr-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAssistantOpen(true);
                            setChatInitialMessage(`Please summarize this note for me: "${item.title}"\nContent: ${item.content}`);
                        }}
                        className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                        title="Summarize this"
                    >
                        <Zap className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === item._id ? null : item._id); }}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-sm"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-slate-500 font-medium text-[12px] leading-relaxed line-clamp-2 mb-5">
                {item.content}
            </p>

            {item.summary && (
                <div className="mb-5 bg-amber-50/30 border border-amber-100/30 rounded-2xl p-4 transition-all group-hover:bg-amber-50/50">
                    <div className="flex items-center gap-2 mb-2 text-amber-600 font-black text-[9px] uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Insights
                    </div>
                    <p className="text-[11px] text-amber-900 font-medium italic line-clamp-2 leading-relaxed">
                        {item.summary}
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-5 border-t border-slate-50">
                {item.tags.filter(tag => tag.trim() !== "").slice(0, 3).map((tag, idx) => (
                    <span key={`tag-${item._id}-${tag}-${idx}`} className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:border-amber-200/30 transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>

            <AnimatePresence>
                {menuOpenId === item._id && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-6 top-16 w-40 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[50]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(item); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border-b border-slate-50"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Edit Item
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item._id); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <div className="min-h-screen mesh-gradient text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 relative">
            <TopBar
                search={search}
                setSearch={setSearch}
                setIsFormOpen={setIsFormOpen}
                user={user}
                handleLogout={handleLogout}
                isProfileMenuOpen={isProfileMenuOpen}
                setIsProfileMenuOpen={setIsProfileMenuOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 md:p-10">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* FILTERS & SORT */}
                        <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {(['all', 'note', 'link', 'insight'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilter(t)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                                            filter === t ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900"
                                        )}
                                    >
                                        {t}s
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                                className="bg-white border border-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                            >
                                Sort-by: <span className="text-slate-900">{sortBy === 'newest' ? 'Relevance' : 'Date'}</span>
                            </button>
                        </section>

                        {/* KNOWLEDGE LIST */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Knowledge Feed</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    <>
                                        <SkeletonCard />
                                        <SkeletonCard />
                                        <SkeletonCard />
                                        <SkeletonCard />
                                    </>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <ItemCard
                                            key={`item-${item._id || idx}`}
                                            item={item}
                                            router={router}
                                            setIsAssistantOpen={setIsAssistantOpen}
                                            setChatInitialMessage={setChatInitialMessage}
                                            menuOpenId={menuOpenId}
                                            setMenuOpenId={setMenuOpenId}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </div>

                            {filteredItems.length === 0 && !isLoading && (
                                <div className="py-20 text-center bg-white/50 rounded-[40px] border border-dashed border-slate-200">
                                    <Brain className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm font-medium">No brilliance found in this view.</p>
                                </div>
                            )}
                        </section>

                        {/* KNOWLEDGE GRAPH */}
                        <section className="space-y-6 pt-4">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Connectivity Graph</h3>
                            </div>

                            <div className="h-[450px] w-full relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-[#1e144a] group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent pointer-events-none" />
                                <GraphView key={`graph-view-${filteredItems.length}`} items={filteredItems} />
                            </div>
                        </section>

                        {/* PUBLIC ACCESS */}
                        <section className="pt-20 pb-20 border-t border-slate-100 bg-slate-50/50 -mx-6 md:-mx-10 px-6 md:px-10">
                            <div className="max-w-5xl mx-auto space-y-12">
                                {/* Header */}
                                <div className="text-center max-w-2xl mx-auto">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        Public Intelligence API
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                        Access Your Brain as an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">API</span>
                                    </h2>
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                        Expose your system's intelligence through our public endpoints. Perfect for personal wikis, widgets, or third-party integrations.
                                    </p>
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Query Endpoint Card */}
                                    <div className="bg-white rounded-[32px] p-8 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden group transition-all duration-500 ring-1 ring-slate-100">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Query Endpoint</span>
                                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100 shadow-sm">v1.0 Active</div>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <div className="bg-[#1e1e2e] rounded-2xl p-5 border border-slate-800 shadow-xl shadow-slate-900/10 overflow-x-auto group-hover:border-indigo-500/30 transition-colors">
                                                <code className="text-[12px] font-mono text-indigo-300 whitespace-nowrap block">
                                                    <span className="text-purple-400">GET</span> /api/public/brain/query?q=<span className="text-emerald-400">What are LLMs?</span>
                                                </code>
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 border border-slate-100/80 text-[11px] font-mono text-slate-600 leading-relaxed shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] ring-1 ring-slate-50">
                                                <div className="flex gap-3 mb-3">
                                                    <span className="text-purple-600 font-bold">"answer":</span>
                                                    <span className="text-slate-700">"Large Language Models (LLMs) are AI systems trained on massive text datasets..."</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-purple-600 font-bold">"sources":</span>
                                                    <span className="text-slate-400">[ &#123; "id": 12, "title": "Intro to Generative AI" &#125; ... ]</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Embeddable Widget Card */}
                                    <div className="bg-white rounded-[32px] p-8 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(147,51,234,0.15)] relative overflow-hidden group transition-all duration-500 ring-1 ring-slate-100">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Embeddable Widget</span>
                                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>

                                        <div className="relative z-10 h-full">
                                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/50 text-[12px] font-mono text-slate-500 leading-loose shadow-inner h-full flex flex-col justify-center group-hover:border-indigo-200/50 transition-colors">
                                                <div>
                                                    &lt;<span className="text-pink-500">iframe</span> <br />
                                                    &nbsp;&nbsp;<span className="text-purple-600">src</span>="https://yourapp.com/embed/brain" <br />
                                                    &nbsp;&nbsp;<span className="text-purple-600">width</span>="100%" <br />
                                                    &nbsp;&nbsp;<span className="text-purple-600">height</span>="500" <br />
                                                    &nbsp;&nbsp;<span className="text-purple-600">style</span>="border:none;border-radius:12px;"&gt;<br />
                                                    &lt;/<span className="text-pink-500">iframe</span>&gt;
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                {/* Floating AI Assistant Trigger (Universal) */}
                <div className="fixed bottom-6 right-6 z-[160] flex flex-col items-end gap-1">
                    <AnimatePresence>
                        {!isAssistantOpen && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 20 }}
                                onClick={() => setIsAssistantOpen(true)}
                                className="relative group flex flex-col items-center"
                            >
                                {/* "CHAT" Bubble as seen in user image */}
                                <motion.div
                                    initial={{ y: 5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-2 bg-[#1e144a] text-white px-5 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2 group-hover:scale-105 transition-transform"
                                >
                                    <MessageCircle className="w-3 h-3 text-indigo-400" />
                                    Chat
                                </motion.div>

                                <div className="relative group">
                                    {/* Bot Glow Effect */}
                                    <div className="absolute inset-x-0 -bottom-4 h-8 bg-indigo-500 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity animate-pulse" />

                                    <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-visible transition-transform group-hover:scale-105 active:scale-95 group-hover:-translate-y-2">
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(30,20,74,0.3)]"
                                        >
                                            <source src="/bot.mp4" type="video/mp4" />
                                        </video>

                                        {/* Online Indicator */}
                                        <div className="absolute top-1/2 right-4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                                    </div>
                                </div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* AI Assistant Floating Modal/Panel */}
                <AnimatePresence>
                    {isAssistantOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[200] w-full h-full sm:w-[400px] sm:max-w-none sm:h-[600px] sm:max-h-[80vh] md:bottom-28 md:right-8 flex flex-col bg-white sm:rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <AIChat
                                onClose={() => setIsAssistantOpen(false)}
                                initialMessage={chatInitialMessage}
                                isDashboard={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Command Palette */}
                <CommandPalette
                    key="command-palette-nav"
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                    onCapture={() => setIsFormOpen(true)}
                    onFilterChange={setFilter}
                    onSortToggle={() => setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest')}
                />

                {/* Modal for New or Edit Mode */}
                <AnimatePresence>
                    {isFormOpen && (
                        <div key="knowledge-form-overlay" className="fixed inset-0 z-[200] overflow-y-auto custom-scrollbar">
                            <div className="min-h-full flex items-center justify-center p-6">
                                <motion.div
                                    key="form-backdrop"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => { setIsFormOpen(false); setEditingItem(null); }}
                                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                                />
                                <div className="relative z-10 w-full max-w-[500px]">
                                    <KnowledgeForm
                                        initialItem={editingItem}
                                        onClose={() => {
                                            setIsFormOpen(false);
                                            setEditingItem(null);
                                        }}
                                        onSuccess={(newItem) => {
                                            fetchItems();
                                            setIsFormOpen(false);
                                            setEditingItem(null);

                                            // Trigger Chat Summarization for new item
                                            if (newItem && !editingItem) {
                                                setTimeout(() => {
                                                    setIsAssistantOpen(true);
                                                    setChatInitialMessage(`I've just added a new note titled "${newItem.title}". Can you summarize it for me?\n\nContent: ${newItem.content}`);
                                                }, 500);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
