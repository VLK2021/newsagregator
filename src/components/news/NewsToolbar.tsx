"use client";

import {
    CATEGORY_OPTIONS,
    LANGUAGE_OPTIONS,
    SORT_OPTIONS,
    SOURCE_TYPE_OPTIONS,
} from "@/constants/news";
import { NewsFilters, SourceMetaItem } from "@/interfaces/news";

type NewsToolbarProps = {
    lang: "uk" | "en";
    filters: NewsFilters;
    searchValue: string;
    sources: SourceMetaItem[];
    isSourcesLoading: boolean;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: NewsFilters["category"]) => void;
    onLanguageChange: (value: NewsFilters["language"]) => void;
    onSourceTypeChange: (value: NewsFilters["sourceType"]) => void;
    onSortChange: (value: NewsFilters["sort"]) => void;
    onSourceChange: (value: string) => void;
    onReset: () => void;
    labels: {
        searchPlaceholder: string;
        sourceLabel: string;
        sourcePlaceholder: string;
        sortLabel: string;
        languageLabel: string;
        sourceTypeLabel: string;
        resetFilters: string;
    };
};

function SegmentButton({
                           isActive,
                           children,
                           onClick,
                       }: {
    isActive: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium
                transition-all duration-200
                ${
                isActive
                    ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                    : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-background)]"
            }
            `}
        >
            {children}
        </button>
    );
}

export default function NewsToolbar({
                                        lang,
                                        filters,
                                        searchValue,
                                        sources,
                                        isSourcesLoading,
                                        onSearchChange,
                                        onCategoryChange,
                                        onLanguageChange,
                                        onSourceTypeChange,
                                        onSortChange,
                                        onSourceChange,
                                        onReset,
                                        labels,
                                    }: NewsToolbarProps) {
    return (
        <section
            className="
                rounded-2xl border border-[var(--color-border)]
                bg-[var(--color-card)] p-4 sm:p-5
            "
        >
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="w-full">
                        <input
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={labels.searchPlaceholder}
                            className="
                                h-12 w-full rounded-2xl border px-4 text-sm outline-none
                                transition-all duration-200
                                border-[var(--color-border)]
                                bg-[var(--color-background)] text-[var(--color-text)]
                                placeholder:text-[var(--color-text-muted)]
                                focus:border-[var(--color-brand)]
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onReset}
                        className="
                            h-12 shrink-0 rounded-2xl border px-4 text-sm font-medium
                            border-[var(--color-border)]
                            bg-[var(--color-background)] text-[var(--color-text)]
                            transition-all duration-200 hover:bg-[var(--color-card)]
                        "
                    >
                        {labels.resetFilters}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">
                        Categories
                    </p>

                    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                        {CATEGORY_OPTIONS.map((option) => (
                            <SegmentButton
                                key={option.value}
                                isActive={filters.category === option.value}
                                onClick={() => onCategoryChange(option.value)}
                            >
                                {option.label[lang]}
                            </SegmentButton>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            {labels.languageLabel}
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {LANGUAGE_OPTIONS.map((option) => (
                                <SegmentButton
                                    key={option.value}
                                    isActive={filters.language === option.value}
                                    onClick={() => onLanguageChange(option.value)}
                                >
                                    {option.label[lang]}
                                </SegmentButton>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            {labels.sourceTypeLabel}
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {SOURCE_TYPE_OPTIONS.map((option) => (
                                <SegmentButton
                                    key={option.value}
                                    isActive={filters.sourceType === option.value}
                                    onClick={() => onSourceTypeChange(option.value)}
                                >
                                    {option.label[lang]}
                                </SegmentButton>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            {labels.sortLabel}
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {SORT_OPTIONS.map((option) => (
                                <SegmentButton
                                    key={option.value}
                                    isActive={filters.sort === option.value}
                                    onClick={() => onSortChange(option.value)}
                                >
                                    {option.label[lang]}
                                </SegmentButton>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            {labels.sourceLabel}
                        </label>

                        <select
                            value={filters.source}
                            onChange={(e) => onSourceChange(e.target.value)}
                            className="
                                h-12 rounded-2xl border px-4 text-sm outline-none
                                transition-all duration-200
                                border-[var(--color-border)]
                                bg-[var(--color-background)] text-[var(--color-text)]
                                focus:border-[var(--color-brand)]
                            "
                        >
                            <option value="all">
                                {isSourcesLoading ? "Loading..." : labels.sourcePlaceholder}
                            </option>

                            {sources.map((source) => (
                                <option key={source.id} value={source.id}>
                                    {source.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
}