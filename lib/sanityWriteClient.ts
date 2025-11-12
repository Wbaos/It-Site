import { createClient } from "@sanity/client";

export const sanityWriteClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-10-14",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});
