import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-slate-100/50 rounded-lg", className)} />
);

export const SkeletonCard = ({ className }: { className?: string }) => (
    <div className={cn("p-6 rounded-[32px] border border-slate-100 bg-white shadow-sm space-y-4", className)}>
        <div className="flex justify-between items-start">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    </div>
);

export const SkeletonHeader = () => (
    <div className="w-full h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center px-8 gap-10">
        <Skeleton className="h-8 w-32" />
        <div className="flex-1 flex justify-center">
            <Skeleton className="h-10 max-w-lg w-full rounded-full" />
        </div>
        <div className="flex gap-4">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
    </div>
);
