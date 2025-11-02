import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Text,
    Section,
    Heading,
    Link,
} from "@react-email/components";
import * as React from "react";

export default function OrderConfirmationEmail({ order }: { order: any }) {
    return (
        <Html>
            <Head />
            <Preview>Your CallTechCare Order Confirmation</Preview>
            <Body style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", padding: "20px" }}>
                <Container style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
                    <Heading as="h2">
                        Thank you for your order, {order?.contact?.name || "Customer"}!
                    </Heading>
                    <Text>We’ve received your order and are processing it now.</Text>

                    <Section>
                        <Heading as="h3">Order Summary</Heading>
                        <ul>
                            {order.items.map((item: any, i: number) => (
                                <li key={i}>
                                    {item.title} — ${item.price.toFixed(2)}
                                    {item.options?.length ? (
                                        <ul>
                                            {item.options.map((opt: any, j: number) => (
                                                <li key={j}>
                                                    {opt.name} (+${opt.price})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Text>
                        <strong>Total:</strong> ${order.total.toFixed(2)}
                    </Text>
                    <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>

                    <Section>
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/account`}>
                            View your order in your account
                        </Link>
                    </Section>

                    <Text style={{ marginTop: "20px" }}>– The CallTechCare Team 💙</Text>
                </Container>
            </Body>
        </Html>
    );
}
