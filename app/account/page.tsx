"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
    loading,
}: {
    user: any;
    orders: Order[];
    loading: boolean;
}) {
    const recent = orders[0];

    return (
        <div className="overview-tab">
            <div className="account-card-grid">
                <Card title="Total Orders" value={loading ? "..." : orders.length} />

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
function OrdersTab({
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
            {orders.map((order, index) => (
                <li
                    key={order._id}
                    className={`order-card ${openOrderId === order._id ? "open" : ""}`}
                    onClick={() => toggleOrder(order._id)}
                >
                    {/* HEADER */}
                    <div className="order-header">
                        <div>
                            <p className="order-number">Order #{index + 1}</p>
                            <p className="order-date">
                                {new Date(order.createdAt).toLocaleDateString()} —{" "}
                                <span className={`status ${order.status}`}>{order.status}</span>
                            </p>
                        </div>
                        <p className="order-total">${order.total.toFixed(2)}</p>
                    </div>

                    {/* DETAILS */}
                    {openOrderId === order._id && (
                        <div className="order-details">
                            <div className="order-section">
                                <h4>Items</h4>
                                <ul>
                                    {order.items.map((item, i) => (
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

                            {order.schedule?.date && (
                                <div className="order-section">
                                    <h4>Scheduled</h4>
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
    const { update } = useSession();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    function handleCancel() {
        // revert to original values
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
        setEditing(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone }),
        });

        setSaving(false);

        if (res.ok) {
            await update();

            setSaved(true);
            setEditing(false);

            setTimeout(() => setSaved(false), 2000);
        } else {
            alert("Failed to save profile");
        }
    }

    return (
        <form className="profile-card" onSubmit={handleSave}>
            <h2>Profile Information</h2>

            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    disabled={!editing}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} disabled />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    disabled={!editing}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            {/* --- BUTTON SECTION --- */}
            {!editing ? (
                <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setEditing(true)}
                >
                    Edit Profile
                </button>
            ) : (
                <div className="edit-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}

            {saved && <p className="success-msg">✅ Profile updated successfully</p>}
        </form>
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
