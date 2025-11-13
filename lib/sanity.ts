import { createClient } from "@sanity/client";

export const sanity = createClient({
    projectId: "celkrwoq",
    dataset: "production",
    apiVersion: "2025-10-14",
    useCdn: true,
    token: process.env.SANITY_WRITE_TOKEN,
});
