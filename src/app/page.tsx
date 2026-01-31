"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Layers,
  Search,
  MessageSquare,
  MessageCircle,
  Check,
  Cpu,
  Network,
  ZapOff,
  CloudLightning,
  Play,
  Lock
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import SmoothScroll from '@/components/SmoothScroll';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem('user');
    if (user) setIsLoggedIn(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    if (!mounted || isLoggedIn) return;

    // Hero Animations
    gsap.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.2
    });

    // Parallax background items
    gsap.to(".parallax-bg", {
      y: (i, target) => -100 * parseFloat(target.dataset.speed || "1"),
      ease: "none",
      scrollTrigger: {
        trigger: "section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Floating Bot Parallax
    gsap.to(".hero-bot-container", {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-bot-container",
        start: "top 80%",
        end: "bottom 20%",
        scrub: true
      }
    });

    // Reveal on Scroll Animations
    const reveals = gsap.utils.toArray('.reveal-on-scroll');
    reveals.forEach((elem: any) => {
      gsap.fromTo(elem,
        {
          y: 100,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Features Section Staggered reveal
    gsap.from(".feature-card", {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 75%",
      }
    });

    // Graph Section Scale effect
    gsap.from(".graph-container", {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".graph-container",
        start: "top 90%",
        end: "top 20%",
        scrub: true
      }
    });
    // Horizontal Parallax
    gsap.to(".parallax-horizontal", {
      x: (i, target) => 100 * parseFloat(target.dataset.speed || "1"),
      ease: "none",
      scrollTrigger: {
        trigger: "section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Section Blur/Opacity transitions
    const sections = gsap.utils.toArray('section');
    sections.forEach((section: any, i) => {
      if (i === 0) return; // Skip hero
      gsap.fromTo(section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 40%",
            scrub: true
          }
        }
      );
    });
  }, [mounted, isLoggedIn]);

  if (!mounted) return null;

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#fdfbf7] text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">

        {/* 🌌 1️⃣ HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
          {/* Background Aura */}
          <div data-speed="0.2" className="parallax-bg absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.05),transparent_70%)]" />
          <div data-speed="0.4" className="parallax-bg absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-100/30 blur-[120px] rounded-full" />

          {/* Horizontal Floating Blobs */}
          <div data-speed="0.8" className="parallax-horizontal absolute top-1/3 -left-20 w-40 h-40 bg-amber-200/20 blur-[60px] rounded-full" />
          <div data-speed="-0.6" className="parallax-horizontal absolute top-2/3 -right-20 w-60 h-60 bg-indigo-200/20 blur-[80px] rounded-full" />

          {/* Light Streaks */}
          <div data-speed="0.6" className="parallax-bg light-streak top-1/4 left-0" style={{ animationDuration: '3s' }} />
          <div data-speed="0.8" className="parallax-bg light-streak top-1/2 right-0" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div data-speed="0.5" className="parallax-bg light-streak bottom-1/4 left-1/3" style={{ animationDuration: '4s', animationDelay: '2s' }} />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-200/50 text-amber-700 text-sm font-bold mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Empowering Thought with AI
              </div>

              <h1 className="hero-title text-6xl md:text-8xl font-black heading-premium tracking-tighter mb-8 text-balance text-slate-900">
                Supercharge Your <span className="text-amber-600">Second Brain</span> with AI
              </h1>

              <p className="text-slate-600 text-xl font-medium max-w-xl mb-12 leading-relaxed text-balance">
                Capture, organize, and think with your knowledge — powered by intelligent automation and semantic processing.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <motion.div
                  animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href="/signup"
                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div
                  animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  className="w-full sm:w-auto"
                >
                  <button
                    className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-2 w-full sm:w-auto justify-center group"
                  >
                    <Play className="w-5 h-5 fill-slate-900 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Animated Bot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end hero-bot-container"
            >
              <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                {/* Floating Elements */}
                <motion.div
                  className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full animate-float"
                  style={{ animationDuration: '8s' }}
                />

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <video
                    src="/bot.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    className="w-[80%] h-[80%] object-contain animate-float pointer-events-none"
                  />

                  {/* Floating Tags/Notes Mockup UI */}
                  <motion.div
                    animate={{
                      x: mousePos.x * 1.2,
                      y: mousePos.y * 1.2
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="absolute -top-4 -right-4 glass p-4 rounded-2xl shadow-xl max-w-[160px]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-black uppercase">Auto-Tagging</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded">#Physics</span>
                      <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded">#Quantum</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      x: mousePos.x * -0.8,
                      y: mousePos.y * -0.8
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="absolute bottom-10 -left-6 glass p-4 rounded-2xl shadow-xl max-w-[180px]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-black uppercase">AI Summary</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium">Neural networks mimic brain structure...</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🧠 2️⃣ PROBLEM → SOLUTION SECTION */}
        <section className="py-32 px-6 bg-white relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-20 reveal-on-scroll"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Your ideas are scattered.<br />
                <span className="text-slate-400">Your knowledge shouldn&apos;t be.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative z-10">
              {[
                {
                  icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
                  title: "Notes everywhere",
                  text: "Ideas buried in apps, browser tabs, and random scratchpads."
                },
                {
                  icon: <Search className="w-8 h-8 text-amber-500" />,
                  title: "Hard to find info",
                  text: "You forget what you already saved and waste time searching."
                },
                {
                  icon: <ZapOff className="w-8 h-8 text-red-500" />,
                  title: "No intelligence",
                  text: "Static notes don't help you think or generate new insights."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="bg-slate-900 rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden reveal-on-scroll"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(217,119,6,0.15),transparent_50%)]" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <blockquote className="text-2xl md:text-4xl font-bold text-white mb-8 leading-tight">
                  Our AI-powered Second Brain connects your knowledge and makes it searchable, summarized, and conversational.
                </blockquote>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full border border-white/10 text-white/80 text-sm font-bold uppercase tracking-widest backdrop-blur-md">
                  The Intelligence Layer
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ⚡ 3️⃣ CORE FEATURES SECTION */}
        <section className="py-32 px-6 relative bg-[#fdfbf7]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-700 mb-4">
                  Feature Suite
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
                  BUILT TO <span className="text-amber-600">THINK</span> <br />WITH YOU
                </h2>
              </div>
              <p className="text-slate-500 font-medium md:text-lg max-w-sm">
                Advanced tools designed to turn your static information into an evolving knowledge ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 feature-grid">
              {[
                {
                  icon: <Brain className="text-blue-500" />,
                  title: "Smart Capture",
                  desc: "Save notes, links, and ideas in one place effortlessly."
                },
                {
                  icon: <Sparkles className="text-amber-500" />,
                  title: "AI Summaries",
                  desc: "Instantly turn long content into key insights and takeaways."
                },
                {
                  icon: <Network className="text-purple-500" />,
                  title: "Auto-Tagging",
                  desc: "AI organizes your knowledge automatically with semantic metadata."
                },
                {
                  icon: <Search className="text-emerald-500" />,
                  title: "Intelligent Search",
                  desc: "Find anything across your brain in seconds using semantic meaning."
                },
                {
                  icon: <MessageSquare className="text-indigo-500" />,
                  title: "Ask Your Knowledge",
                  desc: "Chat with your notes like an AI assistant that knows everything you do."
                },
                {
                  icon: <Globe className="text-slate-500" />,
                  title: "Public Brain API",
                  desc: "Connect your knowledge base to other tools and workflows."
                }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden feature-card"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700">
                    {React.cloneElement(f.icon as React.ReactElement<any>, { size: 100 })}
                  </div>
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-transform duration-500">
                    {React.cloneElement(f.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 🌐 4️⃣ KNOWLEDGE GRAPH SECTION */}
        <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative -mt-[1px] graph-container">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 lg:max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
                Visual Intelligence
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 uppercase">
                See How Your <span className="text-indigo-400">Ideas Connect</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
                Your knowledge isn&apos;t isolated. Our system visualizes relationships between topics so you can discover patterns, connections, and new insights that others miss.
              </p>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center gap-3 mx-auto lg:mx-0">
                Explore Your Graph <Network className="w-5 h-5" />
              </button>
            </div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="relative glass-dark p-2 rounded-[48px] overflow-hidden group">
                <Image
                  src="/knowledge-graph.png"
                  alt="Knowledge Graph"
                  width={800}
                  height={600}
                  className="rounded-[40px] opacity-100 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />

                {/* Floating Insight */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/4 left-1/4 glass p-4 rounded-2xl bg-white text-slate-900 shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase">Hidden Connection</div>
                      <div className="text-[9px] font-bold text-slate-500">Related to AI Ethics</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🤖 5️⃣ AI CAPABILITIES SECTION */}
        <section className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 uppercase">
                More Than Storage.<br />
                <span className="text-amber-600">This is Intelligence.</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                We don&apos;t just save your notes; we actively process them to provide insights that help you do your best work.
              </p>
            </div>

            <div className="space-y-12">
              {[
                {
                  title: "AI writes summaries",
                  desc: "Instantly condense complex articles or long notes into high-quality summaries with key takeaways.",
                  ui: (
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Sparkles className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-200 rounded" />
                        <div className="h-2 w-full bg-slate-200 rounded" />
                        <div className="h-2 w-[70%] bg-slate-200 rounded" />
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="h-24 bg-white/50 rounded-xl" />
                      </div>
                    </div>
                  )
                },
                {
                  title: "AI finds related notes",
                  desc: "Discover connections you never knew existed. Our AI surface relevant notes as you type.",
                  reversed: true,
                  ui: (
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-full overflow-hidden flex flex-col justify-between">
                      <div className="flex flex-wrap gap-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <Layers className="w-3 h-3 text-indigo-500" />
                            <div className="h-2 w-16 bg-slate-100 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 flex gap-4">
                        <div className="flex-1 h-32 bg-white rounded-2xl border-2 border-dashed border-slate-200" />
                        <div className="w-32 h-32 bg-indigo-50 rounded-2xl flex items-center justify-center">
                          <Network className="w-10 h-10 text-indigo-300 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  title: "AI answers questions",
                  desc: "Talk to your knowledge base directly. Ask for facts, dates, or complex syntheses of your own data.",
                  ui: (
                    <div className="bg-slate-900 rounded-3xl p-6 h-full flex flex-col shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-slate-900" />
                        </div>
                        <span className="text-white text-xs font-black uppercase">Brain AI</span>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="ml-8 p-3 bg-white/10 rounded-2xl text-[10px] text-white/60">What are my insights on Quantum Computing?</div>
                        <div className="mr-8 p-3 bg-white rounded-2xl text-[10px] text-slate-900 font-bold">Based on your notes from the last 3 research papers...</div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 h-8 bg-white/5 rounded-lg border border-white/10" />
                        <div className="w-8 h-8 bg-white rounded-lg" />
                      </div>
                    </div>
                  )
                }
              ].map((item, i) => (
                <div key={i} className={cn(
                  "flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 rounded-[48px] border border-slate-100 reveal-on-scroll",
                  item.reversed && "lg:flex-row-reverse bg-slate-50/50"
                )}>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-amber-200 flex items-center justify-center text-amber-600">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest text-slate-400 font-bold">Included in Pro</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full max-w-lg aspect-square lg:aspect-video parallax-bg" data-speed="0.2">
                    {item.ui}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🛠 6️⃣ HOW IT WORKS (3 STEPS) */}
        <section className="py-32 px-6 bg-[#fdfbf7] reveal-on-scroll">
          <div className="max-w-7xl mx-auto text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-slate-900 uppercase">
              From Idea to <span className="text-amber-600">Insight</span><br /> in Seconds
            </h2>
          </div>

          <div className="max-w-6xl mx-auto relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 hidden md:block -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              {[
                { step: "01", title: "Capture", icon: <Layers />, desc: "Add notes, articles, links, and quick ideas to your inbox." },
                { step: "02", title: "AI Organizes", icon: <Cpu />, desc: "Summaries, semantic tags, and relationships are generated instantly." },
                { step: "03", title: "Think Better", icon: <Zap />, desc: "Search, explore, and ask questions to discover patterns." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm relative group hover:scale-105 transition-all duration-500 hover:shadow-2xl reveal-on-scroll">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                    {item.step}
                  </div>
                  <div className="text-amber-500 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 40 })}
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 7️⃣ BONUS POWER FEATURES SECTION */}
        <section className="py-32 px-6 bg-white reveal-on-scroll">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white mb-6">
                Engineered for Power
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                Built Like Infrastructure,<br />Not Just an App
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 power-features-grid">
              {[
                { icon: <Search />, title: "Semantic Vector Search", desc: "Find ideas by meaning, not just keywords." },
                { icon: <Network />, title: "Knowledge Graph", desc: "Visualize how all your topics connect." },
                { icon: <Shield />, title: "File Uploads", desc: "Extract knowledge from PDFs and Docs." },
                { icon: <Brain />, title: "Command Palette", desc: "Keyboard-first productivity (Cmd + K)." },
                { icon: <Lock />, title: "Private & Secure", desc: "Your knowledge base is yours alone." },
                { icon: <CloudLightning />, title: "Real-time Sync", desc: "Always available across all devices." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  whileHover={{ y: -5, backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                  className="p-8 rounded-3xl border border-slate-100 hover:border-amber-200 transition-all group flex gap-6 power-feature-card"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors shrink-0">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 💬 8️⃣ FINAL CTA SECTION */}
        <section className="py-20 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="relative bg-slate-900 rounded-[64px] p-16 md:p-32 text-center text-white overflow-hidden gradient-flow shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
              style={{ background: 'linear-gradient(-45deg, #0f172a, #1e293b, #d9770610, #6366f110)' }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl md:text-8xl font-black heading-premium tracking-tighter mb-8 leading-[0.8] uppercase">
                    Start Building Your <br />
                    <span className="text-amber-500 italic">Second Brain</span> Today
                  </h2>
                  <p className="text-slate-300 text-xl font-medium mb-12 max-w-xl mx-auto">
                    Your future self will thank you for the clarity. Join thousands of thinkers building their intelligent ecosystems.
                  </p>
                  <motion.div
                    animate={{ x: mousePos.x * 0.4, y: mousePos.y * 0.4 }}
                    transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  >
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-3 px-12 py-6 bg-white text-slate-900 rounded-[32px] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Get Started Free <ArrowRight className="w-6 h-6" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Visual accents */}
                <div className="absolute top-1/4 -left-10 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full" />
                <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-amber-500/20 blur-[80px] rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-slate-100 bg-white/50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
              <div className="max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter">SECOND<span className="text-amber-600">BRAIN</span></span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The ultimate intelligent ecosystem for your thoughts, notes, and professional brilliance. Capture once, remember forever.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
                {[
                  {
                    title: "Product",
                    links: ["Features", "Pricing", "Integrations", "API"]
                  },
                  {
                    title: "Company",
                    links: ["About", "Blog", "Manifesto", "Careers"]
                  },
                  {
                    title: "Social",
                    links: ["Twitter (X)", "GitHub", "LinkedIn", "Discord"]
                  }
                ].map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                  >
                    <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6 font-bold">{section.title}</h5>
                    <ul className="space-y-4 text-sm font-medium text-slate-500">
                      {section.links.map((link, lIdx) => (
                        <li key={lIdx}><Link href="#" className="hover:text-amber-600 transition-colors">{link}</Link></li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>&copy; 2026 Second Brain Inc.</span>
                <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
              </div>
              <div className="flex items-center gap-6">
                <Globe className="w-5 h-5 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer" />
                <Shield className="w-5 h-5 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Entry Bot Trigger */}
        <div className="fixed bottom-6 right-6 z-[160] flex flex-col items-end gap-1">
          <AnimatePresence>
            {!isChatOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                onClick={() => setIsChatOpen(true)}
                className="relative group flex flex-col items-center"
              >
                <div className="relative group">
                  {/* Bot Glow Effect */}
                  <div className="absolute inset-x-0 -bottom-4 h-12 bg-indigo-500 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity animate-pulse" />

                  <motion.div
                    animate={{ x: mousePos.x * 0.3, y: mousePos.y * 0.3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    className="relative w-48 h-48 md:w-64 md:h-64 overflow-visible transition-transform group-hover:scale-105 active:scale-95 group-hover:-translate-y-2"
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain pointer-events-none drop-shadow-[0_30px_60px_rgba(30,20,74,0.4)]"
                    >
                      <source src="/gt.mp4" type="video/mp4" />
                    </video>

                    {/* Online Indicator */}
                    <div className="absolute top-[45%] right-8 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-xl animate-pulse" />
                  </motion.div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[170] w-full h-full sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] sm:rounded-[32px] shadow-2xl overflow-hidden"
            >
              <AIChat onClose={() => setIsChatOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SmoothScroll >
  );
}  
