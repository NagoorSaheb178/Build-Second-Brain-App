"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Layout, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    const principles = [
        {
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            title: "Data Sovereignty",
            description: "Your knowledge is yours. AI acts as a curator, not an owner. We prioritize private extraction over public indexing."
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: "Zero-Latency Insight",
            description: "Knowledge should be captured at the speed of thought. AI processing happens in the background to never block your flow."
        },
        {
            icon: <Layout className="w-6 h-6 text-indigo-500" />,
            title: "Contextual Interconnectivity",
            description: "Notes are not silos. Every piece of information is part of a larger graph, connected by semantic resonance and explicit tags."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-slate-900 selection:bg-amber-100 pb-20">
            <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50 py-6 px-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold tracking-tight transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        BACK TO APP
                    </Link>
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-amber-600" />
                        <span className="font-black tracking-tighter uppercase">Architecture & Principles</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-20"
                >
                    <section className="text-center space-y-6">
                        <h1 className="text-6xl font-[1000] tracking-tight leading-none text-slate-900">
                            Engineering <span className="text-amber-600">Meets</span> Design
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            A philosophical framework for the next generation of personal knowledge management systems.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {principles.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                                    {p.icon}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{p.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{p.description}</p>
                            </motion.div>
                        ))}
                    </section>

                    <section className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-white space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[120px] rounded-full" />
                        <div className="relative z-10 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black tracking-tight uppercase">Agent Thinking</h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                                    Our system doesn't just store; it understands. The AI pipeline runs background agents that:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {[
                                        "Perform semantic extraction for auto-tagging",
                                        "Abstract long content into high-density summaries",
                                        "Simulate relationship graphs based on usage patterns",
                                        "Index knowledge for conversational querying"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-200 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-6 h-6 text-amber-500" />
                                    <h2 className="text-4xl font-black tracking-tight uppercase">Infrastructure</h2>
                                </div>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                                    Second Brain exposes its intelligence via a modular API. Our Public Infrastructure allows third-party tools to interact with your brain securely.
                                </p>
                                <code className="block bg-black/50 p-6 rounded-2xl border border-slate-800 text-amber-500 font-mono text-sm">
                                    GET /api/public/brain/query?q=What+is+design?
                                </code>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </main>
        </div>
    );
}
