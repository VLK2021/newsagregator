"use client";

import { NewsItem } from "@/interfaces/news";
import NewsCard from "./NewsCard";
import NewsSkeleton from "./NewsSkeleton";

type NewsGridProps = {
    items: NewsItem[];
    isLoading: boolean;
    emptyText: string;
    labels: {
        open: string;
        noImage: string;
        published: string;
    };
};

export default function NewsGrid({
                                     items,
                                     isLoading,
                                     emptyText,
                                     labels,
                                 }: NewsGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                    <NewsSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (!items.length) {
        return (
            <div
                className="
                    flex min-h-[240px] items-center justify-center rounded-2xl border
                    border-dashed border-[var(--color-border)]
                    bg-[var(--color-card)] px-6 text-center
                    text-[var(--color-text-muted)]
                "
            >
                {emptyText}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
                <NewsCard key={item.id} item={item} labels={labels} />
            ))}
        </div>
    );
}