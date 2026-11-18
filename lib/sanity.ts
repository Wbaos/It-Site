import { createClient } from "@sanity/client";

export const sanity = createClient({
    projectId: "celkrwoq",
    dataset: "production",
    apiVersion: "2025-10-14",
    useCdn: true,
    // Data Cache (1h): without this, Next 15 treats every Sanity fetch
    // as no-store, so every page render waits on a Sanity round trip
    // (~490ms TTFB) and every response ships Cache-Control: no-store.
    // With it, the data is cached server-side for up to 1h and repeat
    // renders skip the network. Pages still render per request (the
    // root layout reads headers() for <html lang>), so this does NOT
    // make pages static and does NOT change Cache-Control — it only
    // cuts TTFB. Freshness stays bounded: the Sanity revalidate webhook
    // purges on content change, and 1h is the worst case. Mutations
    // (sync-reviews writes) and browser-side fetches are unaffected.
    fetch: { next: { revalidate: 3600 } },
    token: process.env.SANITY_WRITE_TOKEN,
});
