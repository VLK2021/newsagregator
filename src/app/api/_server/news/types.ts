export type SourceKind = "rss";
export type SourceType = "rss" | "google-news";

export type SortMode = "latest" | "oldest";

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

export interface NewsItem {
    id: string;
    title: string;
    url: string;
    source: string;
    sourceId: string;
    sourceType: SourceType;
    category: NewsCategory;
    language: string;
    publishedAt: string;
    description?: string;
    image?: string;
    author?: string;
    country?: string;
    tags?: string[];
}

export interface SourceConfig {
    id: string;
    name: string;
    kind: SourceKind;
    sourceType: SourceType;
    url: string;
    language: string;
    category: NewsCategory;
    country?: string;
    enabled?: boolean;
    priority?: number;
    maxItems?: number;
    tags?: string[];
}

export interface NewsQueryParams {
    page: number;
    limit: number;
    search: string;
    category: string;
    language: string;
    source: string;
    sourceType: string;
    sort: SortMode;
}