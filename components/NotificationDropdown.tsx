"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNav } from "@/lib/NavContext";

type Notification = {
  _id: string;
  message: string;
  type: "success" | "info" | "error";
  createdAt: string;
  read?: boolean;
};

export default function NotificationDropdown({ userId }: { userId: string }) {
  const { notifOpen, setNotifOpen, setOpen } = useNav(); // ✅ added setOpen
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [newNotifIds, setNewNotifIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        const freshIds = data.notifications
          .filter((n: Notification) => !n.read)
          .map((n: Notification) => n._id);
        setNewNotifIds(new Set(freshIds));
      }
    }
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const toggleDropdown = async () => {
    const newOpen = !notifOpen;
    setNotifOpen(newOpen);

    if (newOpen) {
      setOpen(false);

      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(console.error);
    } else {
      setNewNotifIds(new Set());
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
        setNewNotifIds(new Set());
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen, setNotifOpen]);

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
          <div className="notification-list">
            {notifs.length === 0 && <p className="empty">No notifications</p>}
            {notifs.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${n.type} ${
                  newNotifIds.has(n._id) ? "new-notification" : ""
                }`}
              >
                <p>{n.message}</p>
                <small>
                  {new Date(n.createdAt).toLocaleDateString()}{" "}
                  {new Date(n.createdAt).toLocaleTimeString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
