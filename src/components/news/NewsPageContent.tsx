"use client";

import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import { useLanguage } from "@/context";
import { DEFAULT_NEWS_FILTERS } from "@/constants/news";
import { useDebounce } from "@/hooks/useDebounce";
import { useNews } from "@/hooks/useNews";
import { NewsFilters } from "@/interfaces/news";
import { NEWS_UI_TEXT } from "@/constants/news";
import NewsToolbar from "./NewsToolbar";
import NewsGrid from "./NewsGrid";

export default function NewsPageContent() {
    const { lang } = useLanguage();
    const uiLang = lang === "en" ? "en" : "uk";

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 450);

    const [filters, setFilters] = useState<NewsFilters>({
        ...DEFAULT_NEWS_FILTERS,
    });

    const mergedFilters = useMemo<NewsFilters>(() => {
        return {
            ...filters,
            search: debouncedSearch.trim(),
        };
    }, [filters, debouncedSearch]);

    const { news, sources, isLoading, isSourcesLoading, error, refetch } = useNews(mergedFilters);

    const labels = NEWS_UI_TEXT[uiLang];

    const safeSources = useMemo(() => {
        const items = sources?.items || [];

        const filteredByType =
            filters.sourceType === "all"
                ? items
                : items.filter((item) => item.sourceType === filters.sourceType);

        const unique = new Map<string, typeof filteredByType[number]>();

        filteredByType.forEach((item) => {
            if (!unique.has(item.id)) {
                unique.set(item.id, item);
            }
        });

        return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [sources, filters.sourceType]);

    const setPage = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    };

    const updateFilters = (next: Partial<NewsFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...next,
            page: 1,
        }));
    };

    const resetFilters = () => {
        setSearchInput("");
        setFilters({
            ...DEFAULT_NEWS_FILTERS,
        });
    };

    return (
        <section className="w-full">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                <div
                    className="
                        rounded-2xl border border-[var(--color-border)]
                        bg-[var(--color-card)] p-5 sm:p-6
                    "
                >
                    <div className="flex flex-col gap-3">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {labels.pageTitle}
                        </h1>

                        <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                            {labels.pageSubtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-[var(--color-text-muted)]">
                            <span>
                                {labels.found}:{" "}
                                <span className="font-semibold text-[var(--color-text)]">
                                    {news?.meta.totalItems || 0}
                                </span>{" "}
                                {labels.results}
                            </span>

                            <span>•</span>

                            <span>
                                <span className="font-semibold text-[var(--color-text)]">
                                    {news?.meta.sourcesTotal || 0}
                                </span>{" "}
                                {labels.sources}
                            </span>

                            {news?.meta.totalPages ? (
                                <>
                                    <span>•</span>
                                    <span>
                                        {labels.pageInfo}{" "}
                                        <span className="font-semibold text-[var(--color-text)]">
                                            {news.meta.page}
                                        </span>{" "}
                                        {labels.of}{" "}
                                        <span className="font-semibold text-[var(--color-text)]">
                                            {news.meta.totalPages}
                                        </span>
                                    </span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                <NewsToolbar
                    lang={uiLang}
                    filters={filters}
                    searchValue={searchInput}
                    sources={safeSources}
                    isSourcesLoading={isSourcesLoading}
                    onSearchChange={setSearchInput}
                    onCategoryChange={(value) => updateFilters({ category: value })}
                    onLanguageChange={(value) => updateFilters({ language: value })}
                    onSourceTypeChange={(value) => updateFilters({ sourceType: value, source: "all" })}
                    onSortChange={(value) => updateFilters({ sort: value })}
                    onSourceChange={(value) => updateFilters({ source: value })}
                    onReset={resetFilters}
                    labels={{
                        searchPlaceholder: labels.searchPlaceholder,
                        sourceLabel: labels.sourceLabel,
                        sourcePlaceholder: labels.sourcePlaceholder,
                        sortLabel: labels.sortLabel,
                        languageLabel: labels.languageLabel,
                        sourceTypeLabel: labels.sourceTypeLabel,
                        resetFilters: labels.resetFilters,
                    }}
                />

                {error ? (
                    <div
                        className="
                            flex flex-col items-center justify-center gap-4 rounded-2xl border
                            border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center
                        "
                    >
                        <p className="text-base font-medium text-[var(--color-text)]">
                            {labels.error}
                        </p>

                        <button
                            onClick={refetch}
                            className="
                                rounded-xl bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white
                                transition-opacity duration-200 hover:opacity-90
                            "
                        >
                            {labels.retry}
                        </button>
                    </div>
                ) : (
                    <NewsGrid
                        items={news?.data || []}
                        isLoading={isLoading}
                        emptyText={labels.noResults}
                        labels={{
                            open: labels.open,
                            noImage: labels.noImage,
                            published: labels.published,
                        }}
                    />
                )}

                {!isLoading && (news?.meta.totalItems || 0) > 0 ? (
                    <div className="pb-2">
                        <Pagination
                            page={filters.page}
                            limit={filters.limit}
                            totalItems={news?.meta.totalItems || 0}
                            onPageChange={setPage}
                        />
                    </div>
                ) : null}
            </div>
        </section>
    );
}