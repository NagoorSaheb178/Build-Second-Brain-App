"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Zap, Sparkles } from 'lucide-react';

interface Node {
    id: string;
    title: string;
    type: string;
    tags: string[];
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface Link {
    source: string;
    target: string;
}

export default function GraphView({ items }: { items: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Zoom and Pan State
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const isDraggingGroup = useRef(false);
    const draggedNodeId = useRef<string | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!items.length) {
            setNodes([]);
            setLinks([]);
            return;
        }

        // Initialize simulation nodes with central positioning
        // Use container dimensions or fall back to center of the likely 1000x450 view
        const width = containerRef.current?.clientWidth || 1000;
        const height = containerRef.current?.clientHeight || 450;
        const centerX = width / 2;
        const centerY = height / 2;

        const initialNodes: Node[] = items.map((item, i) => ({
            id: item._id,
            title: item.title,
            type: item.type,
            tags: item.tags,
            x: centerX + (Math.random() - 0.5) * 100, // Tighter cluster
            y: centerY + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: 0
        }));

        const newLinks: Link[] = [];
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const commonTags = items[i].tags.filter((tag: string) =>
                    tag.trim() !== "" && items[j].tags.includes(tag)
                );
                if (commonTags.length > 0) {
                    newLinks.push({ source: items[i]._id, target: items[j]._id });
                }
            }
        }

        setNodes(initialNodes);
        setLinks(newLinks);

        let animationFrame: number;
        const simulate = () => {
            setNodes(prevNodes => {
                const nextNodes = prevNodes.map(n => ({ ...n }));
                const k = 0.08;
                const dist = 140;

                // Link Forces
                newLinks.forEach(link => {
                    const sIdx = nextNodes.findIndex(n => n.id === link.source);
                    const tIdx = nextNodes.findIndex(n => n.id === link.target);
                    if (sIdx !== -1 && tIdx !== -1) {
                        const s = nextNodes[sIdx];
                        const t = nextNodes[tIdx];
                        const dx = t.x - s.x;
                        const dy = t.y - s.y;
                        const d = Math.sqrt(dx * dx + dy * dy) || 1;
                        const force = (d - dist) * k;
                        const fx = (dx / d) * force;
                        const fy = (dy / d) * force;
                        s.vx += fx; s.vy += fy;
                        t.vx -= fx; t.vy -= fy;
                    }
                });

                // Repulsion
                for (let i = 0; i < nextNodes.length; i++) {
                    for (let j = i + 1; j < nextNodes.length; j++) {
                        const n1 = nextNodes[i];
                        const n2 = nextNodes[j];
                        const dx = n2.x - n1.x;
                        const dy = n2.y - n1.y;
                        const d = Math.sqrt(dx * dx + dy * dy) || 1;
                        if (d < 250) {
                            const force = -300 / (d * d);
                            n1.vx += (dx / d) * force;
                            n1.vy += (dy / d) * force;
                            n2.vx -= (dx / d) * force;
                            n2.vy -= (dy / d) * force;
                        }
                    }
                }

                nextNodes.forEach(node => {
                    // Skip simulation for the dragged node
                    if (node.id === draggedNodeId.current) {
                        node.vx = 0;
                        node.vy = 0;
                        return;
                    }

                    // Dynamic center point based on current dimensions
                    const cw = containerRef.current?.clientWidth || 1000;
                    const ch = containerRef.current?.clientHeight || 450;
                    node.vx += (cw / 2 - node.x) * 0.005;
                    node.vy += (ch / 2 - node.y) * 0.005;
                    node.x += node.vx;
                    node.y += node.vy;
                    node.vx *= 0.85;
                    node.vy *= 0.85;
                });

                return nextNodes;
            });
            animationFrame = requestAnimationFrame(simulate);
        };

        simulate();
        return () => cancelAnimationFrame(animationFrame);
    }, [items]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const delta = -e.deltaY;
        const scaleChange = Math.exp(delta * zoomSpeed);
        setTransform(prev => ({
            ...prev,
            k: Math.min(Math.max(prev.k * scaleChange, 0.1), 5)
        }));
    };

    const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
        if (nodeId) {
            draggedNodeId.current = nodeId;
        } else {
            isDraggingGroup.current = true;
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        if (draggedNodeId.current) {
            setNodes(prev => prev.map(n =>
                n.id === draggedNodeId.current
                    ? { ...n, x: n.x + dx / transform.k, y: n.y + dy / transform.k }
                    : n
            ));
        } else if (isDraggingGroup.current) {
            setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        }
    };

    const handleMouseUp = () => {
        isDraggingGroup.current = false;
        draggedNodeId.current = null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            ref={containerRef}
            className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden outline-none"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            role="application"
            aria-label="Interactive Knowledge Relationship Graph"
        >
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-700">
                    <Share2 className="w-3 h-3" />
                    Relationship Graph
                </div>
                <div className="text-[9px] font-bold text-slate-400 max-w-[150px] leading-relaxed">
                    Drag nodes to move. Drag background to pan. Scroll to zoom.
                </div>
            </div>

            <svg
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleMouseDown(e)}
            >
                {/* Subtle Neon Particles */}
                <g className="pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.circle
                            key={`particle-${i}`}
                            r={Math.random() * 1.5 + 0.5}
                            fill={i % 2 === 0 ? "#6366f1" : "#f59e0b"}
                            initial={{
                                x: Math.random() * 800,
                                y: Math.random() * 600,
                                opacity: Math.random() * 0.3
                            }}
                            animate={{
                                x: [null, Math.random() * 800],
                                y: [null, Math.random() * 600],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </g>
                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
                    <g>
                        {links.map((link, i) => {
                            const source = nodes.find(n => n.id === link.source);
                            const target = nodes.find(n => n.id === link.target);
                            if (!source || !target) return null;

                            // Find common tags for floating bubbles
                            const commonTags = source.tags.filter(t => target.tags.includes(t) && t.trim() !== "");
                            const midX = (source.x + target.x) / 2;
                            const midY = (source.y + target.y) / 2;

                            return (
                                <React.Fragment key={`graph-link-group-${i}`}>
                                    <line
                                        x1={source.x}
                                        y1={source.y}
                                        x2={target.x}
                                        y2={target.y}
                                        stroke={i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#f59e0b" : "#10b981"}
                                        strokeWidth={1.5 / transform.k}
                                        className="transition-opacity opacity-20 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    />
                                    {hoveredNode === source.id || hoveredNode === target.id ? (
                                        <motion.g
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <foreignObject x={midX - 30} y={midY - 10} width="60" height="20">
                                                <div className="flex justify-center">
                                                    <div className="bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20 text-[6px] text-white font-black uppercase tracking-wider">
                                                        {commonTags[0] || 'LINKED'}
                                                    </div>
                                                </div>
                                            </foreignObject>
                                        </motion.g>
                                    ) : null}
                                </React.Fragment>
                            );
                        })}
                    </g>
                    <g>
                        {nodes.map((node, i) => (
                            <motion.g
                                key={`graph-node-${node.id || i}`}
                                initial={false}
                                animate={{ x: node.x, y: node.y }}
                                transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleMouseDown(e, node.id);
                                }}
                                className="cursor-pointer"
                            >
                                <circle
                                    r={hoveredNode === node.id ? 16 : 12}
                                    className={cn(
                                        "transition-all duration-300 stroke-[5px] stroke-white shadow-2xl",
                                        node.type === 'note' ? "fill-blue-500 shadow-blue-500/50" :
                                            node.type === 'link' ? "fill-emerald-500 shadow-emerald-500/50" :
                                                "fill-amber-500 shadow-amber-500/50"
                                    )}
                                />
                                {node.type === 'insight' && (
                                    <Sparkles className="w-3 h-3 text-white absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                                <AnimatePresence>
                                    {(hoveredNode === node.id || nodes.length < 10) && (
                                        <motion.foreignObject
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            x="20"
                                            y="-25"
                                            width="220"
                                            height="70"
                                        >
                                            <div className={cn(
                                                "bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 transition-all",
                                                hoveredNode === node.id ? "scale-105 border-amber-500/30" : ""
                                            )}>
                                                <div className="text-[11px] font-black text-slate-900 uppercase tracking-tighter truncate leading-tight mb-1">
                                                    {node.title}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {node.tags.slice(0, 3).map((t, idx) => (
                                                        <span key={idx} className="text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100/50">#{t.toUpperCase()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.foreignObject>
                                    )}
                                </AnimatePresence>
                            </motion.g>
                        ))}
                    </g>
                </g>
            </svg>

            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4">
                <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 shadow-sm gap-1">
                    <button
                        onClick={() => setTransform(prev => ({ ...prev, k: Math.min(prev.k * 1.2, 5) }))}
                        className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 font-bold"
                    >+</button>
                    <button
                        onClick={() => setTransform(prev => ({ ...prev, k: Math.max(prev.k / 1.2, 0.1) }))}
                        className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 font-bold"
                    >-</button>
                    <button
                        onClick={() => setTransform({ x: 0, y: 0, k: 1 })}
                        className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900"
                    ><Zap className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Note</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Link</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Insight</div>
                </div>
            </div>
        </motion.div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

