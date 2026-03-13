export type NewsCategory =
    | "all"
    | "ukraine"
    | "world"
    | "war"
    | "politics"
    | "economy"
    | "finance"
    | "crypto"
    | "technology"
    | "business"
    | "markets";

export type NewsLanguage = "all" | "uk" | "en" | "ru";
export type NewsSourceType = "all" | "rss" | "google-news";
export type NewsSort = "latest" | "oldest";

export interface NewsItem {
    id: string;
    title: string;
    url: string;
    source: string;
    sourceId: string;
    sourceType: "rss" | "google-news";
    category: Exclude<NewsCategory, "all">;
    language: "uk" | "en" | "ru" | string;
    publishedAt: string;
    description?: string;
    image?: string;
    author?: string;
    country?: string;
    tags?: string[];
}

export interface NewsMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    sourcesTotal: number;
}

export interface NewsResponse {
    meta: NewsMeta;
    data: NewsItem[];
}

export interface SourceMetaItem {
    id: string;
    name: string;
    sourceType: "rss" | "google-news";
    language: string;
    category: string;
    country?: string;
}

export interface SourcesMetaResponse {
    total: number;
    byType: Record<string, number>;
    items: SourceMetaItem[];
}

export interface NewsFilters {
    page: number;
    limit: number;
    search: string;
    category: NewsCategory;
    language: NewsLanguage;
    source: string;
    sourceType: NewsSourceType;
    sort: NewsSort;
}