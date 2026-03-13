import { ALL_NEWS_SOURCES } from "./sources";
import { getNewsCache, setNewsCache } from "./cache";
import { NewsItem, NewsQueryParams } from "./types";
import {
    dedupeNews,
    filterNews,
    paginate,
    runWithConcurrency,
    sortNews,
} from "./utils";
import { fetchRssSource } from "./fetch-rss";

export async function getAggregatedNews(params: NewsQueryParams) {
    let items = getNewsCache();

    if (!items) {
        const tasks = ALL_NEWS_SOURCES.map((source) => async () => {
            return fetchRssSource(source);
        });

        const results = await runWithConcurrency(tasks, 8);

        items = dedupeNews(results.flat());
        setNewsCache(items);
    }

    const filtered = filterNews(items, {
        search: params.search,
        category: params.category,
        language: params.language,
        source: params.source,
        sourceType: params.sourceType,
    });

    const sorted = sortNews(filtered, params.sort);
    const paginated = paginate(sorted, params.page, params.limit);

    return {
        meta: {
            page: paginated.page,
            limit: paginated.limit,
            totalItems: paginated.totalItems,
            totalPages: paginated.totalPages,
            sourcesTotal: ALL_NEWS_SOURCES.length,
        },
        data: paginated.items,
    };
}

export function getSourcesMeta() {
    const byType = ALL_NEWS_SOURCES.reduce<Record<string, number>>((acc, source) => {
        acc[source.sourceType] = (acc[source.sourceType] || 0) + 1;
        return acc;
    }, {});

    return {
        total: ALL_NEWS_SOURCES.length,
        byType,
        items: ALL_NEWS_SOURCES.map((source) => ({
            id: source.id,
            name: source.name,
            sourceType: source.sourceType,
            language: source.language,
            category: source.category,
            country: source.country,
        })),
    };
}