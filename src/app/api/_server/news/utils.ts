import { NewsCategory, NewsItem, SortMode } from "./types";

export function safeLower(value?: string | null) {
    return (value || "").trim().toLowerCase();
}

export function safeText(value?: string | null) {
    return (value || "").trim();
}

export function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/https?:\/\//g, "")
        .replace(/www\./g, "")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 180);
}

export function createNewsId(sourceId: string, url: string, title: string) {
    return `${sourceId}::${slugify(url || title)}`;
}

export function normalizeUrl(value: string) {
    try {
        const url = new URL(value);
        url.hash = "";
        if (url.pathname.endsWith("/")) {
            url.pathname = url.pathname.slice(0, -1);
        }
        return url.toString();
    } catch {
        return value.trim();
    }
}

export function normalizeTitle(value: string) {
    return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function toIsoDate(value?: string | null) {
    if (!value) return new Date().toISOString();

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString();
    }

    return parsed.toISOString();
}

export function sortNews(items: NewsItem[], sort: SortMode) {
    const copy = [...items];

    copy.sort((a, b) => {
        const aTime = new Date(a.publishedAt).getTime() || 0;
        const bTime = new Date(b.publishedAt).getTime() || 0;
        return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return copy;
}

export function paginate<T>(items: T[], page: number, limit: number) {
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;
    const end = start + limit;

    return {
        page: safePage,
        limit,
        totalItems,
        totalPages,
        items: items.slice(start, end),
    };
}

export function filterNews(
    items: NewsItem[],
    {
        search,
        category,
        language,
        source,
        sourceType,
    }: {
        search: string;
        category: string;
        language: string;
        source: string;
        sourceType: string;
    }
) {
    const q = safeLower(search);
    const categoryValue = safeLower(category);
    const languageValue = safeLower(language);
    const sourceValue = safeLower(source);
    const sourceTypeValue = safeLower(sourceType);

    return items.filter((item) => {
        if (categoryValue && categoryValue !== "all" && safeLower(item.category) !== categoryValue) {
            return false;
        }

        if (languageValue && languageValue !== "all" && safeLower(item.language) !== languageValue) {
            return false;
        }

        if (sourceValue && sourceValue !== "all") {
            const matchesSource =
                safeLower(item.source) === sourceValue || safeLower(item.sourceId) === sourceValue;

            if (!matchesSource) {
                return false;
            }
        }

        if (sourceTypeValue && sourceTypeValue !== "all" && safeLower(item.sourceType) !== sourceTypeValue) {
            return false;
        }

        if (q) {
            const haystack = [
                item.title,
                item.description || "",
                item.source,
                ...(item.tags || []),
            ]
                .join(" ")
                .toLowerCase();

            if (!haystack.includes(q)) {
                return false;
            }
        }

        return true;
    });
}

export function dedupeNews(items: NewsItem[]) {
    const byUrl = new Map<string, NewsItem>();
    const byTitle = new Map<string, NewsItem>();

    for (const item of items) {
        const normalizedUrl = normalizeUrl(item.url);
        const normalizedTitle = normalizeTitle(item.title);

        if (normalizedUrl && byUrl.has(normalizedUrl)) {
            continue;
        }

        if (normalizedTitle && byTitle.has(normalizedTitle)) {
            continue;
        }

        if (normalizedUrl) {
            byUrl.set(normalizedUrl, item);
        }

        if (normalizedTitle) {
            byTitle.set(normalizedTitle, item);
        }
    }

    if (byUrl.size > 0) {
        return Array.from(byUrl.values());
    }

    return Array.from(byTitle.values());
}

export function mapCategoryFromText(text: string): NewsCategory {
    const value = safeLower(text);

    if (!value) return "world";
    if (/(bitcoin|btc|ethereum|eth|solana|crypto|blockchain|token|binance|bybit)/i.test(value)) return "crypto";
    if (/(market|stocks|nasdaq|dow|s&p|bond|fed|bank|trading|investor)/i.test(value)) return "markets";
    if (/(finance|financial|money|banking|loan|inflation|rate|currency|forex)/i.test(value)) return "finance";
    if (/(economy|economic|gdp|recession|industry|manufacturing|trade)/i.test(value)) return "economy";
    if (/(technology|tech|ai|software|apple|google|microsoft|startup|cyber)/i.test(value)) return "technology";
    if (/(business|company|companies|ceo|earnings|revenue)/i.test(value)) return "business";
    if (/(war|attack|missile|drone|front|military|defense|armed forces)/i.test(value)) return "war";
    if (/(politics|president|parliament|election|government|minister|senate|congress)/i.test(value)) return "politics";
    if (/(ukraine|kyiv|lviv|odesa|kharkiv|ukrainian)/i.test(value)) return "ukraine";

    return "world";
}

export async function fetchWithTimeout(
    url: string,
    init?: RequestInit,
    timeoutMs = 9000
) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal,
            cache: "no-store",
            headers: {
                "user-agent": "Mozilla/5.0 News Aggregator",
                ...(init?.headers || {}),
            },
        });
    } finally {
        clearTimeout(timeout);
    }
}

export async function runWithConcurrency<T>(
    tasks: Array<() => Promise<T>>,
    limit = 8
): Promise<T[]> {
    const results: T[] = new Array(tasks.length);
    let index = 0;

    async function worker() {
        while (true) {
            const current = index++;
            if (current >= tasks.length) break;
            results[current] = await tasks[current]();
        }
    }

    const workers = Array.from(
        { length: Math.min(limit, tasks.length) },
        () => worker()
    );

    await Promise.all(workers);

    return results;
}

export function buildGoogleNewsSearchUrl(
    query: string,
    hl: string,
    gl: string,
    ceid: string
) {
    const encoded = encodeURIComponent(query);
    return `https://news.google.com/rss/search?q=${encoded}&hl=${encodeURIComponent(
        hl
    )}&gl=${encodeURIComponent(gl)}&ceid=${encodeURIComponent(ceid)}`;
}