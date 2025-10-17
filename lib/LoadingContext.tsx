"use client";
import React, { createContext, useContext, useState } from "react";
import Loader from "@/components/common/Loader";

type LoadingContextType = {
    loading: boolean;
    setLoading: (v: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && <Loader />}
        </LoadingContext.Provider>
    );
}
