import { NewsCategory, NewsLanguage, NewsSort, NewsSourceType } from "@/interfaces/news";

export const DEFAULT_NEWS_LIMIT = 20;

export const DEFAULT_NEWS_FILTERS = {
    page: 1,
    limit: DEFAULT_NEWS_LIMIT,
    search: "",
    category: "all",
    language: "all",
    source: "all",
    sourceType: "all",
    sort: "latest",
} as const;

export const CATEGORY_OPTIONS: Array<{
    value: NewsCategory;
    label: {
        uk: string;
        en: string;
    };
}> = [
    { value: "all", label: { uk: "Усі", en: "All" } },
    { value: "ukraine", label: { uk: "Україна", en: "Ukraine" } },
    { value: "world", label: { uk: "Світ", en: "World" } },
    { value: "war", label: { uk: "Війна", en: "War" } },
    { value: "politics", label: { uk: "Політика", en: "Politics" } },
    { value: "economy", label: { uk: "Економіка", en: "Economy" } },
    { value: "finance", label: { uk: "Фінанси", en: "Finance" } },
    { value: "crypto", label: { uk: "Крипта", en: "Crypto" } },
    { value: "technology", label: { uk: "Технології", en: "Technology" } },
    { value: "business", label: { uk: "Бізнес", en: "Business" } },
    { value: "markets", label: { uk: "Ринки", en: "Markets" } },
];

export const LANGUAGE_OPTIONS: Array<{
    value: NewsLanguage;
    label: {
        uk: string;
        en: string;
    };
}> = [
    { value: "all", label: { uk: "Усі мови", en: "All languages" } },
    { value: "uk", label: { uk: "Українська", en: "Ukrainian" } },
    { value: "en", label: { uk: "Англійська", en: "English" } },
    { value: "ru", label: { uk: "Російська", en: "Russian" } },
];

export const SOURCE_TYPE_OPTIONS: Array<{
    value: NewsSourceType;
    label: {
        uk: string;
        en: string;
    };
}> = [
    { value: "all", label: { uk: "Усі типи", en: "All types" } },
    { value: "rss", label: { uk: "Прямі RSS", en: "Direct RSS" } },
    { value: "google-news", label: { uk: "Google News", en: "Google News" } },
];

export const SORT_OPTIONS: Array<{
    value: NewsSort;
    label: {
        uk: string;
        en: string;
    };
}> = [
    { value: "latest", label: { uk: "Нові спочатку", en: "Newest first" } },
    { value: "oldest", label: { uk: "Старі спочатку", en: "Oldest first" } },
];

export const NEWS_UI_TEXT = {
    uk: {
        pageTitle: "Агрегатор новин",
        pageSubtitle: "Усі новини в одному місці — з фільтрами, пошуком і швидкою навігацією.",
        searchPlaceholder: "Пошук новин, джерел або тем...",
        sourceLabel: "Джерело",
        sourcePlaceholder: "Усі джерела",
        sortLabel: "Сортування",
        languageLabel: "Мова",
        sourceTypeLabel: "Тип джерела",
        resetFilters: "Скинути",
        found: "Знайдено",
        sources: "джерел",
        results: "новин",
        open: "Читати",
        noImage: "Без зображення",
        noResults: "Нічого не знайдено за поточними фільтрами.",
        loading: "Завантаження новин...",
        error: "Не вдалося завантажити новини.",
        retry: "Спробувати ще раз",
        pageInfo: "Сторінка",
        of: "з",
        published: "Опубліковано",
    },
    en: {
        pageTitle: "News Aggregator",
        pageSubtitle: "All news in one place with filters, search, and fast navigation.",
        searchPlaceholder: "Search news, sources, or topics...",
        sourceLabel: "Source",
        sourcePlaceholder: "All sources",
        sortLabel: "Sort",
        languageLabel: "Language",
        sourceTypeLabel: "Source type",
        resetFilters: "Reset",
        found: "Found",
        sources: "sources",
        results: "news",
        open: "Read",
        noImage: "No image",
        noResults: "Nothing found for the current filters.",
        loading: "Loading news...",
        error: "Failed to load news.",
        retry: "Try again",
        pageInfo: "Page",
        of: "of",
        published: "Published",
    },
} as const;