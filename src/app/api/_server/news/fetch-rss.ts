import Parser from "rss-parser";
import { NewsItem, SourceConfig } from "./types";
import {
    createNewsId,
    fetchWithTimeout,
    mapCategoryFromText,
    safeText,
    toIsoDate,
} from "./utils";

type ParserItem = {
    title?: string;
    link?: string;
    pubDate?: string;
    isoDate?: string;
    contentSnippet?: string;
    content?: string;
    creator?: string;
    author?: string;
    enclosure?: {
        url?: string;
    };
    categories?: string[];
};

const parser = new Parser<Record<string, unknown>, ParserItem>({
    customFields: {
        item: [
            ["media:content", "mediaContent", { keepArray: true }],
            ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
            ["description", "description"],
        ],
    },
});

function extractImage(item: any): string {
    if (item?.enclosure?.url) return item.enclosure.url;

    const mediaContent = item?.mediaContent;
    if (Array.isArray(mediaContent) && mediaContent[0]?.$?.url) {
        return mediaContent[0].$?.url;
    }

    const mediaThumbnail = item?.mediaThumbnail;
    if (Array.isArray(mediaThumbnail) && mediaThumbnail[0]?.$?.url) {
        return mediaThumbnail[0].$?.url;
    }

    return "";
}

export async function fetchRssSource(source: SourceConfig): Promise<NewsItem[]> {
    try {
        const response = await fetchWithTimeout(source.url, undefined, 9000);

        if (!response.ok) {
            return [];
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);

        const items = (feed.items || []).slice(0, source.maxItems || 20);

        return items
            .map((item) => {
                const title = safeText(item.title);
                const url = safeText(item.link);
                const description = safeText(item.contentSnippet || item.content || "");
                const publishedAt = toIsoDate(item.isoDate || item.pubDate);
                const author = safeText(item.creator || item.author);
                const image = extractImage(item);

                if (!title || !url) return null;

                return {
                    id: createNewsId(source.id, url, title),
                    title,
                    url,
                    source: source.name,
                    sourceId: source.id,
                    sourceType: source.sourceType,
                    category: source.category || mapCategoryFromText(`${title} ${description}`),
                    language: source.language || "en",
                    publishedAt,
                    description,
                    image,
                    author,
                    country: source.country,
                    tags: source.tags || item.categories || [],
                } satisfies NewsItem;
            })
            .filter(Boolean) as NewsItem[];
    } catch {
        return [];
    }
}