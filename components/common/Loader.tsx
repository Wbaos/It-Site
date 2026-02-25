"use client";
import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({
    message = "Loading...",
    variant = "overlay",
}: {
    message?: string;
    variant?: "overlay" | "inline";
}) {
    return (
        <div className={variant === "overlay" ? "global-loader" : "inline-loader"}>
            <Loader2 className="spinner" size={40} />
            <p>{message}</p>
        </div>
    );
}
