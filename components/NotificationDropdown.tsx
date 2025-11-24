"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNav } from "@/lib/NavContext";

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "success" | "info" | "error";
  createdAt: string;
  read?: boolean;
};

export default function NotificationDropdown({ userId }: { userId: string }) {
  const { notifOpen, setNotifOpen, closeAll } = useNav();

  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Show first 5
  const dropdownRef = useRef<HTMLDivElement>(null);

  function formatTimeAgo(dateString: string) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (data.ok) {
        setNotifs(data.notifications);
      }
    }
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const toggleDropdown = async () => {
    if (notifOpen) {
      setNotifOpen(false);
      return;
    }

    closeAll(); 
    setNotifOpen(true);

    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(console.error);
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
    <div className="notification-wrapper" ref={dropdownRef}>
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
                  <p className="notification-title">{n.title}</p>
                  <p className="notification-desc">{n.message}</p>
                  <p className="notification-time">{formatTimeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < notifs.length && (
            <button
              className="show-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 5)}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
