"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    NewsFilters,
    NewsResponse,
    SourcesMetaResponse,
} from "@/interfaces/news";

function buildNewsQuery(filters: NewsFilters) {
    const params = new URLSearchParams();

    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));

    if (filters.search) params.set("search", filters.search);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.language && filters.language !== "all") params.set("language", filters.language);
    if (filters.source && filters.source !== "all") params.set("source", filters.source);
    if (filters.sourceType && filters.sourceType !== "all") params.set("sourceType", filters.sourceType);
    if (filters.sort) params.set("sort", filters.sort);

    return params.toString();
}

export function useNews(filters: NewsFilters) {
    const [news, setNews] = useState<NewsResponse | null>(null);
    const [sources, setSources] = useState<SourcesMetaResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSourcesLoading, setIsSourcesLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const queryString = useMemo(() => buildNewsQuery(filters), [filters]);

    const fetchSources = useCallback(async () => {
        try {
            setIsSourcesLoading(true);

            const response = await fetch("/api/news?mode=sources", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load sources");
            }

            const data: SourcesMetaResponse = await response.json();
            setSources(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSourcesLoading(false);
        }
    }, []);

    const fetchNews = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`/api/news?${queryString}`, {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load news");
            }

            const data: NewsResponse = await response.json();
            setNews(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load news");
        } finally {
            setIsLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    return {
        news,
        sources,
        isLoading,
        isSourcesLoading,
        error,
        refetch: fetchNews,
    };
}