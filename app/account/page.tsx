"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { redirect } from "next/navigation";
import Loader from "@/components/common/Loader";

type Order = {
    _id: string;
    total: number;
    status: string;
    refunded?: boolean;
    deleted?: boolean
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

    planName?: string | null;
    planPrice?: string | null;
    planInterval?: string | null;
    nextPayment?: string | null;

    subscription?: {
        planName?: string;
        interval?: string;
        nextPayment?: string;
    };
};


export default function AccountPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(true);
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
            } finally {
                setLoading(false);
                setGlobalLoading(false);
            }
        })();
    }, [status]);

    // 1. Full-page loader until everything is truly ready
    if (status === "loading" || globalLoading || loading) {
        return <Loader message="Loading your account..." />;
    }

    // 2. Redirect unauthenticated users
    if (status === "unauthenticated") {
        redirect("/");
    }

    const user = session?.user;
    const tabs: Array<"overview" | "orders" | "profile"> = [
        "overview",
        "orders",
        "profile",
    ];

    // 3. Render account only when ready
    return (
        <section className="account-page">
            <div className="site-container fade-in">
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
                    <OverviewTab user={user} orders={orders} loading={loading} />
                )}
                {tab === "orders" && <OrdersTab orders={orders} loading={loading} />}
                {tab === "profile" && <ProfileTab user={user} />}
            </div>
        </section>
    );
}

/* */
/* -------------------------------------------
   OVERVIEW TAB (with Manage Subscription)
------------------------------------------- */
function OverviewTab({
    orders,
    loading,
}: {
    orders: Order[];
    loading: boolean;
}) {
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const recent = orders[0];

    useEffect(() => {
        const cachedStatus = sessionStorage.getItem("hasSubscription");
        if (cachedStatus !== null) {
            // Use cached status immediately
            setHasSubscription(cachedStatus === "true");
        }

        // Then update in the background (non-blocking)
        (async () => {
            try {
                const res = await fetch("/api/check-subscription");
                const data = await res.json();
                setHasSubscription(data.hasSubscription || false);
                sessionStorage.setItem(
                    "hasSubscription",
                    String(data.hasSubscription || false)
                );
            } catch (err) {
                console.error("Error checking subscription:", err);
                setHasSubscription(false);
                sessionStorage.setItem("hasSubscription", "false");
            }
        })();
    }, []);


    async function handleManage() {
        try {
            setLoadingPortal(true);

            const res = await fetch("/api/manage-subscription", { method: "POST" });
            const data = await res.json();

            if (res.ok && data.url) {
                window.location.assign(data.url);
                return;
            }

            alert(data.error || "Could not open billing portal.");
            setLoadingPortal(false);
        } catch (err) {
            console.error("Error managing subscription:", err);
            alert("Something went wrong. Please try again later.");
            setLoadingPortal(false);
        }
    }

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

            <div className="subscription-section">
                <h3>Manage Your Subscription</h3>
                <p>You can update your payment method or cancel your plan anytime.</p>

                <div
                    className="tooltip-wrapper"
                    title={
                        hasSubscription === false
                            ? "You don’t have an active subscription yet."
                            : ""
                    }
                >
                    <button
                        onClick={handleManage}
                        disabled={!hasSubscription || loadingPortal}
                        className={`btn ${!hasSubscription ? "btn-disabled" : "btn btn-primary wide"
                            }`}
                    >
                        {loadingPortal ? "Loading..." : "Manage / Cancel Subscription"}
                    </button>
                </div>
            </div>
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
    const [loadingPortal, setLoadingPortal] = useState(false);

    if (loading) return <Loader message="Loading your orders..." />;
    if (orders.length === 0)
        return <p className="text-gray-500">You have no orders yet.</p>;

    const toggleOrder = (id: string) => {
        setOpenOrderId((prev) => (prev === id ? null : id));
    };

    return (
        <ul className="orders-list">
            {orders.map((order, index) => {
                // Detect real subscriptions
                const isSubscription =
                    !!order.planName || !!order.planInterval || !!order.nextPayment;

                return (
                    <li
                        key={order._id}
                        className={`order-card ${openOrderId === order._id ? "open" : ""
                            }`}
                        onClick={() => toggleOrder(order._id)}
                    >
                        <div className="order-header">
                            <div>
                                <p className="order-number">Order #{index + 1}</p>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()} —{" "}
                                    <span className={`status ${order.status}`}>
                                        {order.refunded ? "Refunded" : order.status}
                                    </span>
                                </p>
                            </div>
                            <p className="order-total">${order.total.toFixed(2)}</p>
                        </div>

                        {openOrderId === order._id && (
                            <div className="order-details">
                                {isSubscription ? (
                                    <>
                                        <div className="order-section">
                                            <h4>Subscription Details</h4>
                                            <ul>
                                                <li>
                                                    <strong>Plan:</strong>{" "}
                                                    {order.planName || "—"}
                                                </li>
                                                <li>
                                                    <strong>Billing Cycle:</strong>{" "}
                                                    {order.planInterval || "—"}
                                                </li>
                                                <li>
                                                    <strong>Next Payment:</strong>{" "}
                                                    {order.nextPayment && order.nextPayment !== "pending" ? (
                                                        <>
                                                            <u>{new Date(order.nextPayment).toLocaleDateString()}</u>
                                                            {order.status === "canceled" && (
                                                                <span style={{ color: "#df3c52", marginLeft: "6px" }}>
                                                                    (will remain active until this date)
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </li>


                                            </ul>
                                        </div>

                                        <div className="order-section">
                                            <h4>Payment Summary</h4>
                                            <ul>
                                                <li>
                                                    <strong>Status:</strong> {order.status}
                                                </li>
                                                <li>
                                                    <strong>Paid on:</strong>{" "}
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </li>
                                                <li>
                                                    <strong>Total:</strong> $
                                                    {order.total.toFixed(2)}
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="order-section">
                                            <button
                                                className="btn btn-secondary small"
                                                disabled={loadingPortal}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    setLoadingPortal(true);
                                                    const res = await fetch("/api/manage-subscription", {
                                                        method: "POST",
                                                    });
                                                    const data = await res.json();

                                                    if (res.ok && data.url) {
                                                        window.location.href = data.url;
                                                    } else {
                                                        alert(data.error || "Could not open billing portal.");
                                                        setLoadingPortal(false);
                                                    }
                                                }}
                                            >
                                                {loadingPortal ? "Loading..." : "Manage Subscription"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="order-section">
                                        <div className="order-section-header">
                                            <h4>Items</h4>
                                            <a
                                                href="#"
                                                className={`delete-order-link ${order.refunded ? "disabled" : ""}`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    if (order.refunded) {
                                                        alert("This order has already been refunded.");
                                                        return;
                                                    }

                                                    const confirmed = confirm("Are you sure you want to refund this order?");
                                                    if (!confirmed) return;

                                                    try {
                                                        const res = await fetch(`/api/orders/${order._id}`, { method: "DELETE" });
                                                        const data = await res.json();

                                                        if (res.ok) {
                                                            alert("Order refunded successfully!");
                                                            window.location.reload();
                                                        } else {
                                                            alert(data.error || "Failed to refund order");
                                                        }
                                                    } catch (err) {
                                                        console.error("Error refunding order:", err);
                                                        alert("Something went wrong while refunding the order.");
                                                    }
                                                }}
                                            >
                                                {order.refunded ? "Refunded" : "Refund Order"}
                                            </a>

                                        </div>

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
                                )}

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
                );
            })}
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
