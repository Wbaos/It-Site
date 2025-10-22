"use client";

import { Suspense } from "react";
import WriteReviewInner from "./WriteReviewInner";

export const dynamic = "force-dynamic";

export default function WriteReviewPage() {
    return (
        <Suspense fallback={<div>Loading review form...</div>}>
            <WriteReviewInner />
        </Suspense>
    );
}
