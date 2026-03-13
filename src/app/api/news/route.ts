import { NextRequest, NextResponse } from "next/server";
import { getAggregatedNews, getSourcesMeta } from "../_server/news/aggregate";
import { NewsQueryParams, SortMode } from "../_server/news/types";

function parseNumber(value: string | null, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSort(value: string | null): SortMode {
    return value === "oldest" ? "oldest" : "latest";
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("mode") || "feed";

    if (mode === "sources") {
        return NextResponse.json(getSourcesMeta());
    }

    const params: NewsQueryParams = {
        page: parseNumber(searchParams.get("page"), 1),
        limit: Math.min(parseNumber(searchParams.get("limit"), 20), 100),
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "all",
        language: searchParams.get("language") || "all",
        source: searchParams.get("source") || "all",
        sourceType: searchParams.get("sourceType") || "all",
        sort: parseSort(searchParams.get("sort")),
    };

    const result = await getAggregatedNews(params);

    return NextResponse.json(result);
}