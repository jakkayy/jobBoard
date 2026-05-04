"use client";

import { useEffect, useState } from "react";

import { getStoredToken } from "@/lib/auth-token";
import { getNotifications, markNotificationsRead } from "@/lib/notification-api";
import type { Notification } from "@/types/notification";

export function NotificationsPanel() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    const token = getStoredToken();
    if (!token) {
      setError("Please sign in first.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await getNotifications(token);
      setItems(data.items);
      setUnreadCount(data.unread_count);
    } catch {
      setError("Could not load notifications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead() {
    const token = getStoredToken();
    if (!token) return;

    try {
      await markNotificationsRead(token);
      setItems((currentItems) => currentItems.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
    } catch {
      setError("Could not mark notifications as read.");
    }
  }

  if (isLoading) return <p className="text-slate-600">Loading notifications...</p>;

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-semibold text-slate-700">Unread notifications: {unreadCount}</p>
        <button type="button" onClick={handleMarkRead} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white">
          Mark all as read
        </button>
      </div>

      {items.map((notification) => (
        <article key={notification.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{notification.type}</div>
              <h2 className="mt-2 text-xl font-black text-slate-950">{notification.title}</h2>
              <p className="mt-2 text-slate-600">{notification.message}</p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${notification.is_read ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-700"}`}>
              {notification.is_read ? "Read" : "Unread"}
            </span>
          </div>
        </article>
      ))}

      {items.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No notifications yet.</p> : null}
    </div>
  );
}
