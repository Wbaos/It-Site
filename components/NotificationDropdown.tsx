"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNav } from "@/lib/NavContext";

type Notification = {
  _id: string;
  title?: string;
  message: string;
  type: "success" | "info" | "error";
  createdAt: string;
  read?: boolean;
};

export default function NotificationDropdown({
  userId,
  onOpen,
}: {
  userId: string;
  onOpen?: () => void;
}) {
  const { notifOpen, setNotifOpen, closeAll } = useNav();

  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);


  function formatTimeAgo(dateString: string) {
    const past = new Date(dateString);
    const now = new Date();
    const pastUTC = past.getTime();
    const nowUTC = now.getTime();

    const diff = Math.floor((nowUTC - pastUTC) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  const getTitle = (n: Notification) => {
    if (n.title && n.title.trim()) return n.title;
    if (n.type === "success") return "Success";
    if (n.type === "error") return "Error";
    return "Update";
  };

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId || userId === "guest") {
        setNotifs([]);
        return;
      }

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await res.json().catch(() => null) : null;

      if (!res.ok) {
        // Avoid throwing JSON parse errors when the server returns plain text.
        if (res.status === 401 || res.status === 403) {
          setNotifs([]);
          return;
        }

        const text = isJson ? "" : await res.text().catch(() => "");
        console.warn("Fetch notifications failed:", res.status, data || text);
        return;
      }

      if (data?.ok) setNotifs(data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    }
  }, [userId]);


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  useEffect(() => {
    const interval = setInterval(() => {
      setNotifs((prev) => [...prev]); 
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const toggleDropdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notifOpen) {
      setNotifOpen(false);
      return;
    }

    onOpen?.();
    closeAll();
    setNotifOpen(true);

    await fetchNotifications();

    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

    if (userId && userId !== "guest") {
      fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(console.error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeAll();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, closeAll]);

  return (
    <div
      className="notification-wrapper"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="icon-btn relative"
        aria-label="Notifications"
        onClick={toggleDropdown}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="cart-count">{unreadCount}</span>}
      </button>

      {notifOpen && (
        <div className="notification-dropdown">
          <h3 className="notif-header">Notifications</h3>

          <div className="notification-list">
            {notifs.length === 0 && <p className="empty">No notifications</p>}

            {notifs.slice(0, visibleCount).map((n) => (
              <div key={n._id} className="notification-row">
                <div className="notification-dot"></div>

                <div>
                  <p className="notification-title">{getTitle(n)}</p>
                  <p className="notification-desc">{n.message}</p>
                  <p className="notification-time">{formatTimeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < notifs.length && (
            <button
              className="show-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setVisibleCount((prev) => prev + 5);
              }}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
