import ServiceReviews from "./ServiceReviews";
import { getGoogleReviews, getGoogleReviewsUrl } from "@/lib/google-reviews";

export default async function ServiceReviewsWrapper({ slug }: { slug: string }) {
    let initialReviews;
    const googleReviewsUrl = getGoogleReviewsUrl() ?? undefined;

    try {
        initialReviews = await getGoogleReviews();
    } catch {
        initialReviews = undefined;
    }

    return (
        <ServiceReviews
            slug={slug}
            initialReviews={initialReviews}
            googleReviewsUrl={googleReviewsUrl}
        />
    );
}
