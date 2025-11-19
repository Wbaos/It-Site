"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SearchModal({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <>
            <div className="overlay" />

            <div className="search-modal">
                <div ref={modalRef} className="search-box">
                    <div className="input-group">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search for a service..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />

                        <button
                            onClick={onClose}
                            className="close-btn"
                            aria-label="Close search"
                        >
                            <X size={20} />
                        </button>
                        </div>


                    <div className="results">
                        {loading && <p>Searching...</p>}

                        {!loading && results.length > 0 && (
                            <>
                                {results.map((r) => {
                                    const slug = r.slug?.current || r.slug;
                                    return (
                                        <Link
                                            href={`/services/${slug}`}
                                            key={r._id}
                                            className="result-item"
                                            onClick={onClose}
                                        >
                                            {r.image?.asset?.url && (
                                                <Image
                                                    src={r.image.asset.url}
                                                    alt={r.title}
                                                    width={50}
                                                    height={50}
                                                />
                                            )}
                                            <div>
                                                <p className="title">{r.title}</p>
                                                {r.category && <p className="category">{r.category}</p>}
                                            </div>
                                        </Link>
                                    );
                                })}

                            </>
                        )}

                        {!loading && query && results.length === 0 && (
                            <p>No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
