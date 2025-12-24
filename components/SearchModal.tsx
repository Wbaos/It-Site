"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function SearchModal({ onClose }: { onClose: () => void }) {
  // Save and restore scroll position for mobile
  const scrollPositionRef = useRef<number>(0);
  useEffect(() => {
    if (window.innerWidth < 900) {
      scrollPositionRef.current = window.scrollY;
    }
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
      if (window.innerWidth < 900) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

  useEffect(() => {
    const cached = localStorage.getItem("popular-searches");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setPopular(parsed);
        }
      } catch {}
    }

    fetch("/api/popular-searches")
      .then((res) => res.json())
      .then((data) => {
        setPopular(data.results || []);
        if (Array.isArray(data.results)) {
          localStorage.setItem("popular-searches", JSON.stringify(data.results));
        }
      })
      .catch(() => {
        if (!cached) setPopular([]);
      });
  }, []);

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
      <div className="overlay" onClick={onClose} />

      <div className="search-modal">
        <div ref={modalRef} className="search-box" onClick={(e) => e.stopPropagation()}>
          
          <h3 className="search-title">Search Services</h3>

          <div className="input-group">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search for a service..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="results">
            {!query && popular.length > 0 && (
              <div className="popular-section">
                <p className="popular-title">Popular Searches</p>

                {popular.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/services/${item.slug}`}
                    className="popular-item"
                    onClick={onClose}
                  >
                    <span className="icon">{item.emoji || "⭐"}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {loading && <p>Searching...</p>}

            {!loading && query && results.length > 0 && (
              <>
                {results.map((r) => {
                    const slug = typeof r.slug === "string" ? r.slug : r.slug?.current;

                    return (
                        <Link
                        key={r._id}
                        href={`/services/${slug}`}
                        className="result-item"
                        onClick={onClose}
                        >
                        <div>
                            <p className="title">{r.title}</p>
                        </div>
                        </Link>
                    );
                    })}
              </>
            )}

            {!loading && query && results.length === 0 && <p>No results found.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
