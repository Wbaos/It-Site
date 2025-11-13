"use client";
import { useEffect } from "react";

export default function BookButtonWatcher() {
  useEffect(() => {
    const target = document.querySelector(".service-card .btn-book");
    const floating = document.getElementById("floating-book-container");

    if (!target || !floating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          floating.classList.add("floating-book-hidden");
        } else {
          floating.classList.remove("floating-book-hidden");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return null;
}
