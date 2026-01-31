"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Type, Link as LinkIcon, Lightbulb, Tag, Send, Sparkles, Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { summarizeContent, suggestTags } from '@/lib/puter-ai';
import KnowledgeItem from '@/lib/models/KnowledgeItem';

interface KnowledgeFormProps {
    onSuccess: (item?: any) => void;
    onClose: () => void;
    initialItem?: any;
    isEmbedded?: boolean;
}

export default function KnowledgeForm({ onSuccess, onClose, initialItem, isEmbedded = false }: KnowledgeFormProps) {
    const [title, setTitle] = useState(initialItem?.title || '');
    const [content, setContent] = useState(initialItem?.content || '');
    const [type, setType] = useState<'note' | 'link' | 'insight'>(initialItem?.type || 'note');
    const [tags, setTags] = useState<string[]>(initialItem?.tags || []);
    const [summary, setSummary] = useState(initialItem?.summary || '');
    const [tagInput, setTagInput] = useState('');
    const [sourceUrl, setSourceUrl] = useState(initialItem?.sourceUrl || '');
    const [fileName, setFileName] = useState(initialItem?.fileName || '');
    const [fileType, setFileType] = useState(initialItem?.fileType || '');
    const [fileUrl, setFileUrl] = useState(initialItem?.fileUrl || '');
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const isEditMode = !!initialItem;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Simulate upload
        setTimeout(async () => {
            setFileName(file.name);
            setFileType(file.type);
            setFileUrl('box://temp-storage/' + file.name); // Simulated URL
            setIsUploading(false);

            // Trigger AI Extraction from "file"
            setIsAiProcessing(true);
            try {
                // Simulate reading file content
                const simulatedContent = `Document: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\n\nThis is a placeholder for actual document content extraction.`;
                if (!content) setContent(simulatedContent);
                if (!title) setTitle(file.name.split('.')[0]);

                const [aiSummary, aiTags] = await Promise.all([
                    summarizeContent(simulatedContent),
                    suggestTags(simulatedContent)
                ]);

                if (aiSummary) setSummary(aiSummary);
                if (aiTags && aiTags.length > 0) {
                    setTags(prev => Array.from(new Set([...prev, ...aiTags])));
                }
            } catch (error) {
                console.error("AI Error:", error);
            } finally {
                setIsAiProcessing(false);
            }
        }, 1000);
    };

    const handleAddTag = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        if (e) e.preventDefault();
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleAutoProcess = async () => {
        if (!content) return;
        setIsAiProcessing(true);
        try {
            const [aiSummary, aiTags] = await Promise.all([
                summarizeContent(content),
                suggestTags(content)
            ]);

            if (aiSummary) setSummary(aiSummary);
            if (aiTags && aiTags.length > 0) {
                setTags(prev => Array.from(new Set([...prev, ...aiTags])));
            }
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsAiProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = isEditMode ? `/api/knowledge/${initialItem._id}` : '/api/knowledge';
        const method = isEditMode ? 'PUT' : 'POST';

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 'demo-user';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    summary,
                    type,
                    tags,
                    sourceUrl,
                    fileName,
                    fileType,
                    fileUrl,
                    userId
                }),
            });

            if (response.ok) {
                const createdItem = await response.json();
                onSuccess(createdItem);
                onClose();
            }
        } catch (error) {
            console.error("Submit Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={!isEmbedded ? { opacity: 0, scale: 0.95 } : { opacity: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "bg-white flex flex-col overflow-hidden",
                isEmbedded
                    ? "w-full p-4 md:p-5"
                    : "rounded-[24px] md:rounded-[32px] p-4 md:p-8 w-full relative shadow-2xl border border-slate-100 max-h-[85vh] md:max-h-[90vh]"
            )}
        >
            {!isEmbedded && (
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-10">
                    <X className="w-5 h-5" />
                </button>
            )}

            <div className="flex items-center gap-4 mb-8 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm relative overflow-hidden group/icon">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                    {isEditMode ? <Sparkles className="w-6 h-6 text-amber-600 relative z-10" /> : <Plus className="w-6 h-6 text-amber-600 relative z-10" />}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1.5">
                        {isEditMode ? 'Evolve' : 'Capture'}
                    </h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                        {isEditMode ? 'Update Entry' : 'New Brain Entry'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0" aria-label="Knowledge capture form">
                <div className="flex-1 overflow-y-auto premium-scrollbar pr-2 -mr-2 space-y-5 pb-8">
                    <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-100 shrink-0" role="radiogroup" aria-label="Content type">
                        {(['note', 'link', 'insight'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                role="radio"
                                aria-checked={type === t}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all capitalize text-[10px] font-black uppercase tracking-wider",
                                    type === t ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {t === 'note' && <Type className="w-3.5 h-3.5" />}
                                {t === 'link' && <LinkIcon className="w-3.5 h-3.5" />}
                                {t === 'insight' && <Lightbulb className="w-3.5 h-3.5" />}
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-1.5 shrink-0">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Attachment</label>
                        <div className="relative group/file">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={cn(
                                "w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                fileName ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100 hover:border-slate-300"
                            )}>
                                {isUploading ? (
                                    <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                                ) : fileName ? (
                                    <div className="flex items-center gap-3 w-full px-2">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-amber-100">
                                            <FileText className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-black text-amber-900 uppercase tracking-tight truncate">{fileName}</div>
                                            <div className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">Document Attached</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFileName(''); }}
                                            className="text-amber-300 hover:text-amber-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-slate-300 group-hover/file:text-amber-400 transition-colors" />
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-hover/file:text-slate-600 transition-colors">
                                            Drop document or click to browse
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="A brilliant title..."
                                required
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-slate-300 font-bold text-base"
                            />
                        </div>

                        {type === 'link' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Source URL</label>
                                <div className="relative group/input">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        value={sourceUrl}
                                        onChange={(e) => setSourceUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-50 border border-slate-100 text-slate-600 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your thoughts..."
                                required
                                rows={5}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none min-h-[140px] font-medium leading-relaxed text-sm shadow-inner"
                            />
                            <button
                                type="button"
                                onClick={handleAutoProcess}
                                disabled={isAiProcessing || !content}
                                className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-2xl hover:bg-amber-600 active:scale-95 group/ai"
                            >
                                {isAiProcessing ? (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : <Sparkles className="w-3.5 h-3.5 group-hover/ai:rotate-12 transition-transform" />}
                                AI Magic
                            </button>
                        </div>

                        {summary && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-1.5"
                            >
                                <label className="text-[10px] font-black uppercase tracking-widest text-amber-600 ml-1 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" />
                                    AI Summary
                                </label>
                                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-xs text-amber-900 font-medium italic leading-relaxed">
                                    {summary}
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tags</label>
                            <div className="flex flex-wrap gap-1.5 min-h-[10px]">
                                <AnimatePresence>
                                    {tags.filter(tag => tag.trim() !== "").map((tag, idx) => (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            key={`tag-input-${tag}-${idx}`}
                                            className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100"
                                        >
                                            #{tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="relative group/input">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add tags... (Enter)"
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-600 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-auto shrink-0 border-t border-slate-50 bg-white z-10">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-100 group/submit uppercase tracking-widest text-[11px]"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Store to Brain
                                <Send className="w-3.5 h-3.5 group-hover/submit:translate-x-0.5 group-hover/submit:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
