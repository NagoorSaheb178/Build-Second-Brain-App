"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Command, X, Type, Link as LinkIcon, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: () => void;
    onFilterChange: (filter: 'all' | 'note' | 'link' | 'insight') => void;
    onSortToggle: () => void;
}

export default function CommandPalette({ isOpen, onClose, onCapture, onFilterChange, onSortToggle }: CommandPaletteProps) {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }

            if (isOpen) {
                const isInputActive = document.activeElement?.tagName === 'INPUT';
                const key = e.key.toLowerCase();

                if (key === 'n' && !isInputActive) {
                    e.preventDefault();
                    onCapture();
                    onClose();
                }
                if (key === 's' && !isInputActive) {
                    e.preventDefault();
                    onSortToggle();
                    onClose();
                }
                if (!isInputActive) {
                    if (e.key === '1') { onFilterChange('all'); onClose(); }
                    if (e.key === '2') { onFilterChange('note'); onClose(); }
                    if (e.key === '3') { onFilterChange('link'); onClose(); }
                    if (e.key === '4') { onFilterChange('insight'); onClose(); }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onCapture, onFilterChange, onSortToggle]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col relative"
            >
                <div className="flex items-center px-6 py-5 border-b border-slate-100">
                    <Search className="w-5 h-5 text-slate-400 mr-4" />
                    <input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search or execute actions..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 italic text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        esc
                    </div>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Power Commands</h4>

                        <button
                            onClick={() => { onCapture(); onClose(); }}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-amber-50 group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">New Brain Entry</div>
                                </div>
                            </div>
                            <kbd className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg group-hover:border-amber-200 group-hover:text-amber-600">N</kbd>
                        </button>

                        <button
                            onClick={() => { onSortToggle(); onClose(); }}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-slate-50 group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Toggle Sorting Order</div>
                                </div>
                            </div>
                            <kbd className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg group-hover:border-slate-200 group-hover:text-slate-600">S</kbd>
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">View Context</h4>
                        <div className="grid grid-cols-4 gap-2 px-2">
                            {[
                                { id: 'all', icon: Zap, color: 'slate', key: '1' },
                                { id: 'note', icon: Type, color: 'blue', key: '2' },
                                { id: 'link', icon: LinkIcon, color: 'green', key: '3' },
                                { id: 'insight', icon: Lightbulb, color: 'amber', key: '4' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { onFilterChange(item.id as any); onClose(); }}
                                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group relative"
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", `bg-${item.color}-50 text-${item.color}-600`)}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.id}</span>
                                    <kbd className="absolute top-2 right-2 text-[7px] font-black text-slate-300 group-hover:text-slate-500 transition-colors uppercase">{item.key}</kbd>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200">↑↓</kbd> Navigate</div>
                        <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200">↵</kbd> Select</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Power Mode</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
