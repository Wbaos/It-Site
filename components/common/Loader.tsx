"use client";
import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="global-loader">
            <Loader2 className="spinner" size={40} />
            <p>{message}</p>
        </div>
    );
}
