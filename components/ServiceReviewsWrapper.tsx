"use client";

import dynamic from "next/dynamic";

const ServiceReviews = dynamic(() => import("./ServiceReviews"), {
    ssr: false,
});

export default function ServiceReviewsWrapper({ slug }: { slug: string }) {
    return <ServiceReviews slug={slug} />;
}
