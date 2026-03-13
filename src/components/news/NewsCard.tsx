"use client";

import { NewsItem } from "@/interfaces/news";

type NewsCardProps = {
    item: NewsItem;
    labels: {
        open: string;
        noImage: string;
        published: string;
    };
};

function formatDate(date: string) {
    try {
        return new Intl.DateTimeFormat("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    } catch {
        return date;
    }
}

export default function NewsCard({ item, labels }: NewsCardProps) {
    return (
        <article
            className="
                group overflow-hidden rounded-2xl border
                bg-[var(--color-card)] text-[var(--color-text)]
                border-[var(--color-border)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-lg
            "
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--color-border)]">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div
                        className="
                            flex h-full w-full items-center justify-center
                            bg-[var(--color-background)] text-sm
                            text-[var(--color-text-muted)]
                        "
                    >
                        {labels.noImage}
                    </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                        className="
                            rounded-full border px-2.5 py-1 text-[11px] font-medium
                            border-[var(--color-border)]
                            bg-[var(--color-background)] text-[var(--color-text)]
                            backdrop-blur-sm
                        "
                    >
                        {item.source}
                    </span>

                    <span
                        className="
                            rounded-full px-2.5 py-1 text-[11px] font-medium text-white
                            bg-[var(--color-brand)]
                        "
                    >
                        {item.language.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.sourceType}</span>
                    <span>•</span>
                    <span>
                        {labels.published}: {formatDate(item.publishedAt)}
                    </span>
                </div>

                <h3 className="line-clamp-3 text-base font-semibold leading-6 sm:text-lg">
                    {item.title}
                </h3>

                {item.description ? (
                    <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">
                        {item.description}
                    </p>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        {item.author ? (
                            <p className="truncate text-xs text-[var(--color-text-muted)]">
                                {item.author}
                            </p>
                        ) : (
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {item.country || item.language.toUpperCase()}
                            </p>
                        )}
                    </div>

                    <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                            bg-[var(--color-brand)] text-white
                            transition-all duration-200 hover:opacity-90
                        "
                    >
                        {labels.open}
                    </a>
                </div>
            </div>
        </article>
    );
}