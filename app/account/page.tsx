"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";
import { redirect } from "next/navigation";
import Loader from "@/components/common/Loader";
import { Dialog } from "@headlessui/react";
import { Calendar, Eye, MapPin, Tv, User, Wrench, StickyNote, CreditCard, ShieldCheck, X, Mail, Phone, LogOut } from "lucide-react";
import { isTimeSlotAvailableForDate } from "@/lib/time-slots";
type SessionUser = {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
};

type Order = {
    _id: string;
    orderNumber?: string;
    total: number;
    status: string;
    refunded?: boolean;
    deleted?: boolean
    createdAt: string;

    completedAt?: string;

    contact?: { name?: string; email?: string; phone?: string };
    address?: { street?: string; city?: string; state?: string; zip?: string };
    schedule?: { date?: string; time?: string };

    technicianName?: string;
    technicianPhone?: string;

    serviceDescription?: string;
    notes?: string;
    paymentLast4?: string;
    warrantyText?: string;

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

type AccountTab = "orders" | "profile";

function normalizeStatus(status: string | undefined): string {
    return (status || "").trim().toLowerCase().replace(/[_-]+/g, " ");
}

function formatShortDate(date: string | undefined): string {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatISODateOnly(date: string | undefined): string {
    if (!date) return "—";
    // Accept already formatted YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toISOString().slice(0, 10);
}

function formatTimeDisplay(time: string | undefined): string {
    if (!time) return "—";
    const t = String(time).trim();
    if (!t) return "—";

    // Already formatted like "2:00 PM" or "02:00 PM"
    const ampmMatch = t.match(/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i);
    if (ampmMatch) {
        const hour = Number(ampmMatch[1]);
        const minute = ampmMatch[2];
        const ampm = ampmMatch[3].toUpperCase();
        const hour12 = ((hour + 11) % 12) + 1;
        return `${hour12}:${minute} ${ampm}`;
    }

    // 24h format "14:00"
    const hhmmMatch = t.match(/^\s*(\d{1,2}):(\d{2})\s*$/);
    if (hhmmMatch) {
        const hour24 = Number(hhmmMatch[1]);
        const minute = hhmmMatch[2];
        if (!Number.isFinite(hour24) || hour24 < 0 || hour24 > 23) return t;
        const ampm = hour24 >= 12 ? "PM" : "AM";
        const hour12 = ((hour24 + 11) % 12) + 1;
        return `${hour12}:${minute} ${ampm}`;
    }

    return t;
}

function getLocalISODate(date: Date = new Date()): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function isISODateInPast(dateIso: string | undefined): boolean {
    if (!dateIso || !/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) return false;
    const selected = new Date(`${dateIso}T00:00:00`);
    if (Number.isNaN(selected.getTime())) return false;
    const todayIso = getLocalISODate();
    const today = new Date(`${todayIso}T00:00:00`);
    return selected.getTime() < today.getTime();
}

function statusPillClasses(order: Order): string {
    if (order.refunded) return "accountStatusPillRose";
    const s = normalizeStatus(order.status);
    if (s.includes("complete") || s.includes("paid")) {
        return "accountStatusPillEmerald";
    }
    if (s.includes("schedule")) return "accountStatusPillSky";
    if (s.includes("progress") || s.includes("in progress") || s.includes("processing")) {
        return "accountStatusPillAmber";
    }
    if (s.includes("cancel")) return "accountStatusPillSlate";
    return "accountStatusPillSlate";
}

function statusLabel(order: Order): string {
    if (order.refunded) return "Refunded";
    const s = normalizeStatus(order.status);
    if (!s) return "—";
    if (s === "paid") return "Completed";
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
}


export default function AccountPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(true);
    const [tab, setTab] = useState<AccountTab>("orders");

    const stats = useMemo(() => {
        const visible = orders.filter((o) => !o.deleted);
        const counts = {
            total: visible.length,
            completed: 0,
            scheduled: 0,
            inProgress: 0,
        };

        for (const order of visible) {
            const s = normalizeStatus(order.status);
            if (s.includes("complete") || s.includes("paid")) counts.completed += 1;
            else if (s.includes("schedule")) counts.scheduled += 1;
            else if (s.includes("progress") || s.includes("processing") || s.includes("in progress")) {
                counts.inProgress += 1;
            }
        }

        return counts;
    }, [orders]);

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

    const user: SessionUser | undefined = session?.user as SessionUser | undefined;
    const userName = user?.name?.trim() || "";

    // 3. Render account only when ready
    return (
        <section className="accountPage">
            <div className="accountContainer">
                <div className="accountHeader">
                    <div>
                        <h1 className="accountTitle">My Account</h1>
                        <p className="accountSubtitle">
                            Welcome back{userName ? `, ${userName}` : ""}.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="accountLogoutButton"
                    >
                        <LogOut className="accountLogoutIcon" aria-hidden="true" />
                        Logout
                    </button>
                </div>

                <div className="accountTabBar">
                    <button
                        type="button"
                        onClick={() => setTab("orders")}
                        className={clsx(
                            "accountTabButton",
                            tab === "orders" && "accountTabButtonActive"
                        )}
                    >
                        My Orders
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("profile")}
                        className={clsx(
                            "accountTabButton",
                            tab === "profile" && "accountTabButtonActive"
                        )}
                    >
                        Profile
                    </button>
                </div>

                {tab === "orders" && (
                    <OrdersTab
                        orders={orders}
                        loading={loading}
                        stats={stats}
                        onOrderUpdated={(updated) =>
                            setOrders((prev) =>
                                prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
                            )
                        }
                    />
                )}
                {tab === "profile" && <ProfileTab user={user} />}
            </div>
        </section>
    );
}

/* -------------------------------------------
   ORDERS TAB
------------------------------------------- */
function OrdersTab({
    orders,
    loading,
    stats,
    onOrderUpdated,
}: {
    orders: Order[];
    loading: boolean;
    stats: { total: number; completed: number; scheduled: number; inProgress: number };
    onOrderUpdated: (updated: Order) => void;
}) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [rescheduleSaving, setRescheduleSaving] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const scheduleCardRef = useRef<HTMLDivElement | null>(null);

    if (loading) return <Loader message="Loading your orders..." />;
    const visibleOrders = orders.filter((o) => !o.deleted);
    if (visibleOrders.length === 0) return <p className="accountEmptyState">You have no orders yet.</p>;

    const closeModal = () => setSelectedOrder(null);

    const openModal = (order: Order) => {
        setSelectedOrder(order);
        setIsRescheduling(false);
        setRescheduleSaving(false);
        const initialDate = order.schedule?.date || "";
        setRescheduleDate(isISODateInPast(initialDate) ? getLocalISODate() : initialDate);
        setRescheduleTime(order.schedule?.time || "");
    };

    const timeSlots = useMemo(() => {
        const formatHourLabel = (hour24: number) => {
            const ampm = hour24 >= 12 ? "PM" : "AM";
            const hour12 = ((hour24 + 11) % 12) + 1;
            return `${String(hour12).padStart(2, "0")}:00 ${ampm}`;
        };

        const slots: { label: string; value: string; startHour: number }[] = [];
        for (let hour = 8; hour <= 19; hour++) {
            slots.push({
                label: formatHourLabel(hour),
                value: `${String(hour).padStart(2, "0")}:00`,
                startHour: hour,
            });
        }
        return slots;
    }, []);

    const isTimeSlotAvailable = (startHour: number): boolean => {
        // For rescheduling, allow selecting times more freely; backend can enforce stricter rules later if needed.
        return isTimeSlotAvailableForDate({ dateIso: rescheduleDate, startHour, minimumHoursAhead: 0 });
    };

    const StatCard = ({
        label,
        value,
        tone,
    }: {
        label: string;
        value: number;
        tone?: "emerald" | "sky" | "amber";
    }) => (
        <div className="accountStatCard">
            <p
                className={clsx(
                    "accountStatValue",
                    tone === "emerald" && "accountStatValueEmerald",
                    tone === "sky" && "accountStatValueSky",
                    tone === "amber" && "accountStatValueAmber"
                )}
            >
                {value}
            </p>
            <p className="accountStatLabel">{label}</p>
        </div>
    );

    return (
        <div className="accountOrders">
            <div className="accountStatsGrid">
                <StatCard label="Total Orders" value={stats.total} />
                <StatCard label="Completed" value={stats.completed} tone="emerald" />
                <StatCard label="Scheduled" value={stats.scheduled} tone="sky" />
                <StatCard label="In Progress" value={stats.inProgress} tone="amber" />
            </div>

            <ul className="accountOrderList">
                {visibleOrders.map((order) => {
                    const primaryTitle = order.items?.[0]?.title || order.serviceDescription || "—";

                    const orderNumber = order.orderNumber || "—";

                    const dateLabel = order.schedule?.date
                        ? formatISODateOnly(order.schedule.date)
                        : formatShortDate(order.createdAt);
                    const timeLabel = order.schedule?.time ? formatTimeDisplay(order.schedule.time) : "";
                    const dateTimeLabel = `${dateLabel}${timeLabel ? ` at ${timeLabel}` : ""}`;

                    const addressLabel =
                        [
                            order.address?.street,
                            [order.address?.city, order.address?.state].filter(Boolean).join(", "),
                        ]
                            .filter(Boolean)
                            .join(", ") ||
                        [order.address?.city, order.address?.state].filter(Boolean).join(", ") ||
                        "—";

                    return (
                        <li key={order._id} className="accountOrderCard">
                            <div className="accountOrderCardInner">
                                <div className="accountOrderLeft">
                                    <div className="accountOrderIconBox">
                                        <Tv className="accountOrderMainIcon" aria-hidden="true" />
                                    </div>

                                    <div className="accountOrderContent">
                                        <div className="accountOrderTitleRow">
                                            <p className="accountOrderTitle">{primaryTitle}</p>
                                            <span
                                                className={clsx(
                                                    "accountStatusPill",
                                                    statusPillClasses(order)
                                                )}
                                            >
                                                {statusLabel(order)}
                                            </span>
                                        </div>

                                        <p className="accountOrderNumber">Order #{orderNumber}</p>

                                        <div className="accountOrderMeta">
                                            <div className="accountOrderMetaRow">
                                                <Calendar className="accountMetaIcon" aria-hidden="true" />
                                                <span className="truncate">{dateTimeLabel}</span>
                                            </div>
                                            <div className="accountOrderMetaRow">
                                                <MapPin className="accountMetaIcon" aria-hidden="true" />
                                                <span className="truncate">{addressLabel}</span>
                                            </div>
                                            {order.technicianName ? (
                                                <div className="accountOrderMetaRow">
                                                    <User className="accountMetaIcon" aria-hidden="true" />
                                                    <span className="truncate">Technician: {order.technicianName}</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="accountOrderRight">
                                    <div className="accountOrderTotal">
                                        <p className="accountOrderTotalAmount">${order.total.toFixed(2)}</p>
                                        <p className="accountOrderTotalLabel">Total Paid</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openModal(order)}
                                        className={clsx("accountBtn", "accountBtnSm", "accountBtnSecondary")}
                                    >
                                        <Eye className="accountBtnIcon" aria-hidden="true" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <Dialog open={selectedOrder !== null} onClose={closeModal} className="accountModalRoot">
                <div className="accountModalBackdrop" aria-hidden="true" />

                <div className="accountModalScroll">
                    <div className="accountModalCenter">
                        {selectedOrder ? (
                            <Dialog.Panel className="accountModalPanel">
                                <div className="accountModalHeader">
                                    <div className="accountModalHeaderLeft">
                                        <div className="accountOrderIconBox">
                                            <Tv className="accountOrderMainIcon" aria-hidden="true" />
                                        </div>

                                        <div className="accountModalTitleWrap">
                                            <Dialog.Title className="accountModalTitle">
                                                {selectedOrder.items?.[0]?.title || selectedOrder.serviceDescription || "—"}
                                            </Dialog.Title>
                                            <p className="accountModalSubtitle">
                                                Order #{selectedOrder.orderNumber || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="accountModalClose"
                                        aria-label="Close"
                                    >
                                        <X className="accountIconXs" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="accountModalBody">
                                    <div className="accountRowBetween">
                                        <p className="accountFieldLabel">Status</p>
                                        <span className={clsx("accountStatusPill", statusPillClasses(selectedOrder))}>
                                            {normalizeStatus(selectedOrder.status).includes("schedule") ? (
                                                <Calendar className="accountPillIcon" aria-hidden="true" />
                                            ) : null}
                                            {statusLabel(selectedOrder)}
                                        </span>
                                    </div>

                                    <div className="accountCard">
                                        <div className="accountCardHeader">
                                            <Wrench className="accountMetaIcon" aria-hidden="true" />
                                            <p className="accountCardTitle">Service Details</p>
                                        </div>
                                        <p className={clsx("accountBodyText", "accountBodyTextSpaced")}>{selectedOrder.serviceDescription || "—"}</p>
                                    </div>

                                    <div className="accountTwoColGrid">
                                        <div ref={scheduleCardRef} className="accountCard">
                                            <div className="accountCardHeader">
                                                <Calendar className="accountMetaIcon" aria-hidden="true" />
                                                <p className="accountCardTitle">Schedule</p>
                                            </div>

                                            <dl className="accountDl">
                                                <div className="accountDlRow">
                                                    <dt className="accountDlKey">Date</dt>
                                                    <dd className="accountDlValue">
                                                        {formatISODateOnly(selectedOrder.schedule?.date) !== "—"
                                                            ? formatISODateOnly(selectedOrder.schedule?.date)
                                                            : formatISODateOnly(selectedOrder.createdAt)}
                                                    </dd>
                                                </div>
                                                <div className="accountDlRow">
                                                    <dt className="accountDlKey">Time</dt>
                                                    <dd className="accountDlValue">{formatTimeDisplay(selectedOrder.schedule?.time)}</dd>
                                                </div>
                                                <div className="accountDlRow">
                                                    <dt className="accountDlKey">Order Created</dt>
                                                    <dd className="accountDlValue">{formatISODateOnly(selectedOrder.createdAt)}</dd>
                                                </div>
                                                {formatISODateOnly(selectedOrder.completedAt) !== "—" ? (
                                                    <div className="accountDlRow">
                                                        <dt className="accountDlKey">Completed</dt>
                                                        <dd className="accountDlValueAccent">
                                                            {formatISODateOnly(selectedOrder.completedAt)}
                                                        </dd>
                                                    </div>
                                                ) : null}
                                            </dl>

                                            {isRescheduling ? (
                                                <div className="accountReschedule">
                                                    <div>
                                                        <label className="accountInputLabel">New Date</label>
                                                        <input
                                                            type="date"
                                                            value={rescheduleDate}
                                                            min={getLocalISODate()}
                                                            onPointerDown={(e) => {
                                                                const el = e.currentTarget as HTMLInputElement & {
                                                                    showPicker?: () => void;
                                                                };
                                                                const nativeEvent = (e as unknown as { nativeEvent?: Event }).nativeEvent;
                                                                if (!el.showPicker) return;
                                                                if (nativeEvent && "isTrusted" in nativeEvent && !(nativeEvent as any).isTrusted) return;
                                                                try {
                                                                    el.showPicker();
                                                                } catch {
                                                                    // Ignore browsers that require stricter user-gesture rules.
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                setRescheduleDate(e.target.value);
                                                                setRescheduleTime("");
                                                            }}
                                                            className="accountDateInput"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="accountInputLabel">New Time</p>
                                                        <div className="accountTimeGrid">
                                                            {timeSlots.map((slot) => {
                                                                const available = isTimeSlotAvailable(slot.startHour);
                                                                const selected = rescheduleTime === slot.value;

                                                                return (
                                                                    <button
                                                                        key={slot.value}
                                                                        type="button"
                                                                        disabled={!available}
                                                                        onClick={() => setRescheduleTime(slot.value)}
                                                                        className={clsx(
                                                                            "accountTimeSlot",
                                                                            selected ? "accountTimeSlotSelected" : "accountTimeSlotDefault",
                                                                            !available && "accountTimeSlotDisabled"
                                                                        )}
                                                                    >
                                                                        {slot.label}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={!rescheduleDate || !rescheduleTime || rescheduleSaving}
                                                        className={clsx(
                                                            "accountBtn",
                                                            "accountBtnMd",
                                                            "accountBtnPrimary",
                                                            "accountBtnFull",
                                                            "accountBtnDisabled"
                                                        )}
                                                        onClick={async () => {
                                                            if (!selectedOrder) return;
                                                            if (!rescheduleDate || !rescheduleTime) return;

                                                            try {
                                                                setRescheduleSaving(true);
                                                                const res = await fetch(`/api/orders/${selectedOrder._id}`,
                                                                    {
                                                                        method: "PATCH",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime }),
                                                                        credentials: "include",
                                                                    }
                                                                );
                                                                const data = await res.json();
                                                                if (!res.ok) {
                                                                    alert(data?.error || "Could not reschedule this order.");
                                                                    setRescheduleSaving(false);
                                                                    return;
                                                                }

                                                                const updated = (data?.order || null) as Order | null;
                                                                if (updated) {
                                                                    onOrderUpdated(updated);
                                                                    setSelectedOrder(updated);
                                                                }

                                                                setIsRescheduling(false);
                                                                setRescheduleSaving(false);
                                                            } catch (err) {
                                                                console.error("Reschedule failed", err);
                                                                alert("Something went wrong while rescheduling.");
                                                                setRescheduleSaving(false);
                                                            }
                                                        }}
                                                    >
                                                        {rescheduleSaving ? "Saving..." : "Save New Schedule"}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="accountCard">
                                            <div className="accountCardHeader">
                                                <MapPin className="accountMetaIcon" aria-hidden="true" />
                                                <p className="accountCardTitle">Location</p>
                                            </div>
                                            <p className={clsx("accountBodyText", "accountBodyTextSpaced")}>
                                                {[selectedOrder.address?.street, selectedOrder.address?.city, selectedOrder.address?.state]
                                                    .filter(Boolean)
                                                    .join(", ") || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="accountCard">
                                        <div className="accountCardHeader">
                                            <User className="accountMetaIcon" aria-hidden="true" />
                                            <p className="accountCardTitle">Assigned Technician</p>
                                        </div>
                                        <div className="accountTechRow">
                                            <div>
                                                <p className="accountTechName">
                                                    {selectedOrder.technicianName || "—"}
                                                </p>
                                                <p className="accountTechPhone">
                                                    {selectedOrder.technicianPhone || ""}
                                                </p>
                                            </div>

                                            {selectedOrder.technicianPhone ? (
                                                <a
                                                    href={`tel:${selectedOrder.technicianPhone}`}
                                                    className={clsx("accountBtn", "accountBtnSm", "accountBtnSecondary")}
                                                >
                                                    <Phone className="accountBtnIcon" aria-hidden="true" />
                                                    Call
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="accountCard">
                                        <div className="accountCardHeader">
                                            <StickyNote className="accountMetaIcon" aria-hidden="true" />
                                            <p className="accountCardTitle">Notes</p>
                                        </div>
                                        <p className={clsx("accountBodyText", "accountBodyTextSpaced")}>{selectedOrder.notes || "—"}</p>
                                    </div>

                                    <div className="accountTwoColGrid">
                                        <div className="accountCard">
                                            <div className="accountCardHeader">
                                                <CreditCard className="accountMetaIcon" aria-hidden="true" />
                                                <p className="accountCardTitle">Payment</p>
                                            </div>
                                            <div className="accountPaymentRow">
                                                <p className="accountBodyText">
                                                    Credit Card {selectedOrder.paymentLast4 ? `****${selectedOrder.paymentLast4}` : ""}
                                                </p>
                                                <p className="accountPaymentAmount">${selectedOrder.total.toFixed(0)}</p>
                                            </div>
                                        </div>

                                        <div className="accountCard">
                                            <div className="accountCardHeader">
                                                <ShieldCheck className="accountMetaIcon" aria-hidden="true" />
                                                <p className="accountCardTitle">Warranty</p>
                                            </div>
                                            <p className={clsx("accountBodyText", "accountBodyTextSpaced")}>{selectedOrder.warrantyText || "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="accountModalFooter">
                                    {normalizeStatus(selectedOrder.status).includes("schedule") ? (
                                        <div className="accountFooterGrid">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsRescheduling((v) => {
                                                        const next = !v;
                                                        if (!v && next) {
                                                            requestAnimationFrame(() => {
                                                                scheduleCardRef.current?.scrollIntoView({
                                                                    behavior: "smooth",
                                                                    block: "start",
                                                                });
                                                            });
                                                        }
                                                        return next;
                                                    });
                                                }}
                                                className={clsx(
                                                    "accountBtn",
                                                    "accountBtnMd",
                                                    "accountBtnFull",
                                                    isRescheduling ? "accountBtnSecondary" : "accountBtnWarning"
                                                )}
                                            >
                                                {isRescheduling ? "Cancel" : "Reschedule"}
                                            </button>

                                            <a
                                                href="/contact"
                                                className={clsx("accountBtn", "accountBtnMd", "accountBtnFull", "accountBtnSecondary")}
                                            >
                                                <Mail className="accountBtnIcon" aria-hidden="true" />
                                                Contact Support
                                            </a>
                                        </div>
                                    ) : (
                                        <a
                                            href="/contact"
                                            className={clsx("accountBtn", "accountBtnMd", "accountBtnFull", "accountBtnSecondary")}
                                        >
                                            <Mail className="accountBtnIcon" aria-hidden="true" />
                                            Contact Support
                                        </a>
                                    )}
                                </div>
                            </Dialog.Panel>
                        ) : null}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}



/* -------------------------------------------
   PROFILE TAB
------------------------------------------- */
function ProfileTab({ user }: { user: SessionUser | undefined }) {
    const { update } = useSession();
    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    function handleCancel() {
        setName(user?.name || "");
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
        <form
            className="accountProfileForm"
            onSubmit={handleSave}
        >
            <h2 className="accountProfileTitle">Profile</h2>
            <p className="accountProfileSubtitle">Update your contact information.</p>

            <div className="accountProfileGrid">
                <div>
                    <label htmlFor="name" className="accountFieldLabel">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        disabled={!editing}
                        onChange={(e) => setName(e.target.value)}
                        className={clsx(
                            "accountInputBase",
                            editing ? "accountInputEditable" : "accountInputReadOnly"
                        )}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="accountFieldLabel">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className={clsx("accountInputBase", "accountInputReadOnly")}
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="accountFieldLabel">
                        Phone
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        disabled={!editing}
                        onChange={(e) => setPhone(e.target.value)}
                        className={clsx(
                            "accountInputBase",
                            editing ? "accountInputEditable" : "accountInputReadOnly"
                        )}
                    />
                </div>
            </div>

            <div className="accountActionsRow">
                {!editing ? (
                    <button
                        type="button"
                        className={clsx("accountBtn", "accountBtnMd", "accountBtnSecondary")}
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className={clsx("accountBtn", "accountBtnMd", "accountBtnSecondary", "accountBtnDisabled")}
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={clsx("accountBtn", "accountBtnMd", "accountBtnPrimary", "accountBtnDisabled")}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </>
                )}
            </div>

            {saved && <p className="accountSavedMsg">Profile updated successfully.</p>}
        </form>
    );
}
