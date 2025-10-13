"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import { redirect } from "next/navigation";

type Order = {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    contact?: { name?: string; email?: string; phone?: string };
    address?: { street?: string; city?: string; state?: string; zip?: string };
    schedule?: { date?: string; time?: string };
    items: {
        title: string;
        price: number;
        basePrice?: number;
        options?: { name: string; price: number }[];
    }[];
};

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"overview" | "orders" | "profile">("overview");

    useEffect(() => {
        if (status !== "authenticated") return;

        (async () => {
            try {
                const res = await fetch("/api/orders", { credentials: "include" });
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [status]);

    if (status === "loading") {
        return (
            <section className="account-loading">
                <p>Loading your account...</p>
            </section>
        );
    }

    if (status === "unauthenticated") {
        redirect("/");
    }


    const user = session?.user;
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const tabs: Array<"overview" | "orders" | "profile"> = [
        "overview",
        "orders",
        "profile",
    ];

    return (
        <section className="account-page">
            <div className="site-container">
                <div className="account-header">
                    <h1>
                        Welcome, {user?.name?.split(" ")[0] || "User"} <span>👋</span>
                    </h1>
                    <button onClick={() => signOut({ callbackUrl: "/" })}
                        className="logout-btn">
                        Log Out
                    </button>
                </div>

                <div className="account-tabs">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={clsx("tab-btn", tab === t && "active")}
                        >
                            {t[0].toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {tab === "overview" && (
                    <OverviewTab
                        user={user}
                        orders={orders}
                        totalSpent={totalSpent}
                        loading={loading}
                    />
                )}
                {tab === "orders" && <OrdersTab orders={orders} loading={loading} />}
                {tab === "profile" && <ProfileTab user={user} />}
            </div>
        </section>
    );
}

/* -------------------------------------------
   OVERVIEW TAB
------------------------------------------- */
function OverviewTab({
    user,
    orders,
    totalSpent,
    loading,
}: {
    user: any;
    orders: Order[];
    totalSpent: number;
    loading: boolean;
}) {
    const recent = orders[0];

    return (
        <div className="overview-tab">
            <div className="account-card-grid">
                <Card title="Total Orders" value={loading ? "..." : orders.length} />
                <Card
                    title="Total Spent"
                    value={loading ? "..." : `$${totalSpent.toFixed(2)}`}
                />
                <Card
                    title="Last Booking"
                    value={
                        loading
                            ? "..."
                            : recent
                                ? new Date(recent.createdAt).toLocaleDateString()
                                : "None yet"
                    }
                />
            </div>

            {recent && (
                <div className="recent-order">
                    <h3>Most Recent Order</h3>
                    <p>
                        Placed on {new Date(recent.createdAt).toLocaleDateString()} —{" "}
                        <strong>{recent.status}</strong>
                    </p>
                    <ul>
                        {recent.items.map((item, i) => (
                            <li key={i}>
                                {item.title} (${item.basePrice ?? item.price})
                                {item.options?.length ? (
                                    <ul>
                                        {item.options.map((opt, j) => (
                                            <li key={j}>
                                                {opt.name} (+${opt.price})
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------
   ORDERS TAB
------------------------------------------- */
export function OrdersTab({
    orders,
    loading,
}: {
    orders: Order[];
    loading: boolean;
}) {
    const [openOrderId, setOpenOrderId] = useState<string | null>(null);

    if (loading) return <p>Loading your orders...</p>;
    if (orders.length === 0)
        return <p className="text-gray-500">You have no orders yet.</p>;

    const toggleOrder = (id: string) => {
        setOpenOrderId((prev) => (prev === id ? null : id));
    };

    return (
        <ul className="orders-list">
            {orders.map((order: Order) => (
                <li
                    key={order._id}
                    className={`order-card ${openOrderId === order._id ? "open" : ""
                        }`}
                >
                    <div
                        className="order-header cursor-pointer"
                        onClick={() => toggleOrder(order._id)}
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                Order #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()} —{" "}
                                <span className="capitalize">{order.status}</span>
                            </p>
                        </div>
                        <p className="font-medium text-blue-600">${order.total.toFixed(2)}</p>
                    </div>

                    {openOrderId === order._id && (
                        <div className="order-details">
                            <div className="order-section">
                                <h4>Items</h4>
                                <ul>
                                    {order.items.map(
                                        (item: Order["items"][number], idx: number) => (
                                            <li key={idx}>
                                                {item.title} (${item.basePrice ?? item.price})
                                                {item.options?.length ? (
                                                    <ul>
                                                        {item.options.map(
                                                            (opt: { name: string; price: number }, j: number) => (
                                                                <li key={j}>
                                                                    {opt.name} (+${opt.price})
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                ) : null}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {order.contact && (
                                <div className="order-section">
                                    <h4>Contact Information</h4>
                                    <p>
                                        <strong>Name:</strong> {order.contact.name || "N/A"}
                                        <br />
                                        <strong>Email:</strong> {order.contact.email || "N/A"}
                                        <br />
                                        <strong>Phone:</strong> {order.contact.phone || "N/A"}
                                    </p>
                                </div>
                            )}

                            {order.address && (
                                <div className="order-section">
                                    <h4>Service Address</h4>
                                    <p>
                                        {order.address.street}, {order.address.city},{" "}
                                        {order.address.state} {order.address.zip}
                                    </p>
                                </div>
                            )}

                            {order.schedule && (
                                <div className="order-section">
                                    <h4>Scheduled Availability</h4>
                                    <p>
                                        {order.schedule.date} at {order.schedule.time}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

/* -------------------------------------------
   PROFILE TAB
------------------------------------------- */
function ProfileTab({ user }: { user: any }) {
    return (
        <div className="profile-card">
            <h2>Profile Information</h2>
            <p>
                <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
                <strong>Email:</strong> {user?.email}
            </p>
            <small>(In the future, you can make this editable)</small>
        </div>
    );
}

/* -------------------------------------------
   Reusable Card Component
------------------------------------------- */
function Card({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="account-card">
            <p className="title">{title}</p>
            <p className="value">{value}</p>
        </div>
    );
}
