"use client";

export default function NewsSkeleton() {
    return (
        <div
            className="
                overflow-hidden rounded-2xl border
                border-[var(--color-border)]
                bg-[var(--color-card)]
            "
        >
            <div className="aspect-[16/9] w-full animate-pulse bg-[var(--color-background)]" />
            <div className="space-y-4 p-4 sm:p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--color-background)]" />
                <div className="h-5 w-full animate-pulse rounded bg-[var(--color-background)]" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-[var(--color-background)]" />
                <div className="h-4 w-full animate-pulse rounded bg-[var(--color-background)]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-background)]" />
                <div className="flex items-center justify-between pt-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-background)]" />
                    <div className="h-10 w-24 animate-pulse rounded-xl bg-[var(--color-background)]" />
                </div>
            </div>
        </div>
    );
}