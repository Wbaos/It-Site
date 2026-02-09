import BookingCustomizeClient from "@/components/booking/BookingCustomizeClient";

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BookingCustomizeClient slug={slug} />;
}
