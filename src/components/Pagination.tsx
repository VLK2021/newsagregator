"use client";

import React, { useState, useEffect, useCallback } from "react";

export default function Pagination({
                                       page = 1,
                                       limit,
                                       totalItems = 0,
                                       onPageChange,
                                   }: {
    page?: number;
    limit: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
}) {
    const [currentPage, setCurrentPage] = useState(page);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const handlePageChange = useCallback(
        (nextPage: number) => {
            const numericPage = Number(nextPage);

            if (numericPage >= 1 && numericPage <= totalPages) {
                setCurrentPage(numericPage);
                onPageChange?.(numericPage);
            }
        },
        [totalPages, onPageChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) handlePageChange(value);
    };

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
            onPageChange?.(1);
        }
    }, [currentPage, totalPages, onPageChange]);

    return (
        <div
            className="
                flex flex-wrap items-center justify-center gap-3 rounded-2xl border px-4 py-3
                transition-colors duration-300
            "
            style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
            }}
        >
            <button
                className="px-3 py-2 rounded-md border text-sm transition-all duration-200"
                style={{
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: currentPage === 1 ? "var(--color-text-muted)" : "var(--color-text)",
                    opacity: currentPage === 1 ? 0.5 : 1,
                }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &#60;
            </button>

            <button
                className={`px-3 py-2 rounded-md border text-sm transition-all duration-200 ${
                    currentPage === 1 ? "font-semibold" : ""
                }`}
                style={{
                    backgroundColor: currentPage === 1 ? "var(--color-brand)" : "transparent",
                    borderColor: currentPage === 1 ? "var(--color-brand)" : "var(--color-border)",
                    color: currentPage === 1 ? "#fff" : "var(--color-text)",
                }}
                onClick={() => handlePageChange(1)}
            >
                1
            </button>

            {currentPage > 3 && (
                <span style={{ color: "var(--color-text-muted)" }}>...</span>
            )}

            {currentPage > 2 && (
                <button
                    className="px-3 py-2 rounded-md border text-sm transition-all duration-200"
                    style={{
                        backgroundColor: "transparent",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                    }}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
                <button
                    className="px-3 py-2 rounded-md border text-sm font-semibold transition-all duration-200"
                    style={{
                        backgroundColor: "var(--color-brand)",
                        borderColor: "var(--color-brand)",
                        color: "#fff",
                    }}
                    onClick={() => handlePageChange(currentPage)}
                >
                    {currentPage}
                </button>
            )}

            {currentPage < totalPages - 1 && (
                <button
                    className="px-3 py-2 rounded-md border text-sm transition-all duration-200"
                    style={{
                        backgroundColor: "transparent",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                    }}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            )}

            {currentPage < totalPages - 2 && (
                <span style={{ color: "var(--color-text-muted)" }}>...</span>
            )}

            {totalPages > 1 && (
                <button
                    className={`px-3 py-2 rounded-md border text-sm transition-all duration-200 ${
                        currentPage === totalPages ? "font-semibold" : ""
                    }`}
                    style={{
                        backgroundColor: currentPage === totalPages ? "var(--color-brand)" : "transparent",
                        borderColor: currentPage === totalPages ? "var(--color-brand)" : "var(--color-border)",
                        color: currentPage === totalPages ? "#fff" : "var(--color-text)",
                    }}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            )}

            <button
                className="px-3 py-2 rounded-md border text-sm transition-all duration-200"
                style={{
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color:
                        currentPage === totalPages
                            ? "var(--color-text-muted)"
                            : "var(--color-text)",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &#62;
            </button>

            <div className="flex items-center gap-2 ml-1 sm:ml-4">
                <span
                    className="text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    Go to
                </span>

                <input
                    type="number"
                    value={currentPage}
                    onChange={handleInputChange}
                    min={1}
                    max={totalPages}
                    className="
                        w-16 px-2 py-1 text-sm rounded-md border text-center
                        transition-all duration-200 focus:outline-none focus:ring-2
                    "
                    style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                    }}
                />
            </div>

            <span
                className="text-sm ml-1 sm:ml-4"
                style={{ color: "var(--color-text-muted)" }}
            >
                Total: {totalItems}
            </span>
        </div>
    );
}