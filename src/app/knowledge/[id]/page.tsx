"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag as TagIcon, ExternalLink, Lightbulb, Type, Link as LinkIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KnowledgeDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [item, setItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`/api/knowledge/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setItem(data);
                } else {
                    router.push('/');
                }
            } catch (err) {
                console.error(err);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-slate-900 selection:bg-amber-100 pb-20">
            <nav className="sticky top-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold tracking-tight transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        BACK
                    </button>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border",
                            item.type === 'note' ? "bg-blue-50 border-blue-100 text-blue-600" :
                                item.type === 'link' ? "bg-green-50 border-green-100 text-green-600" :
                                    "bg-amber-50 border-amber-100 text-amber-600"
                        )}>
                            {item.type === 'note' && <Type className="w-5 h-5" />}
                            {item.type === 'link' && <LinkIcon className="w-5 h-5" />}
                            {item.type === 'insight' && <Lightbulb className="w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {item.type}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-[1000] tracking-tight leading-[1.1] text-slate-900">
                            {item.title}
                        </h1>
                    </header>

                    {item.summary && (
                        <section className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 md:p-10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                            <div className="flex items-center gap-2 mb-4 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                <Sparkles className="w-4 h-4" />
                                AI Summary
                            </div>
                            <p className="text-lg md:text-xl text-amber-900 font-semibold leading-relaxed">
                                {item.summary}
                            </p>
                        </section>
                    )}

                    <article className="prose prose-slate max-w-none">
                        <div className="text-xl md:text-2xl text-slate-600 font-medium leading-[1.6] whitespace-pre-wrap">
                            {item.content}
                        </div>
                    </article>

                    {item.sourceUrl && (
                        <div className="pt-8 border-t border-slate-100">
                            <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all hover:translate-y-[-2px] active:translate-y-0 group shadow-xl shadow-slate-200"
                            >
                                Visit Source
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    )}

                    <footer className="pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <TagIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Tags</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {item.tags?.map((tag: string, i: number) => (
                                <span
                                    key={`detail-tag-${tag}-${i}`}
                                    className="px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-amber-200 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </footer>
                </motion.div>
            </main>
        </div>
    );
}
