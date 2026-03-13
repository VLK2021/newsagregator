import { NewsItem } from "./types";

type NewsCacheState = {
    items: NewsItem[];
    updatedAt: number;
};

const TTL_MS = 5 * 60 * 1000;

let state: NewsCacheState | null = null;

export function getNewsCache() {
    if (!state) return null;

    const isExpired = Date.now() - state.updatedAt > TTL_MS;

    if (isExpired) {
        state = null;
        return null;
    }

    return state.items;
}

export function setNewsCache(items: NewsItem[]) {
    state = {
        items,
        updatedAt: Date.now(),
    };
}

export function clearNewsCache() {
    state = null;
}