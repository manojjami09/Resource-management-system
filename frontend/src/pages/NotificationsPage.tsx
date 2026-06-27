import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, CheckCheck, Filter, Clock, ChevronRight } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "../services/notificationService";
import { Notification, NotificationType } from "../types";
import { NOTIFICATION_TYPE_LABELS } from "../constants";
import { timeAgo } from "../utils/format";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const typeColors: Record<NotificationType, string> = {
  rolloff: "bg-amber-50 text-amber-700 border-amber-200",
  bench_alert: "bg-red-50 text-red-700 border-red-200",
  skill_alert: "bg-blue-50 text-blue-700 border-blue-200",
  request: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delay: "bg-orange-50 text-orange-700 border-orange-200",
};

const typeIconColors: Record<NotificationType, string> = {
  rolloff: "bg-amber-100 text-amber-600",
  bench_alert: "bg-red-100 text-red-600",
  skill_alert: "bg-blue-100 text-blue-600",
  request: "bg-indigo-100 text-indigo-600",
  delay: "bg-orange-100 text-orange-600",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");
  const [, setLocation] = useLocation();

  useEffect(() => {
    getNotifications().then((data) => { setNotifications(data); setLoading(false); });
  }, []);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return (
    <div className="p-6 space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500">{filtered.length} notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            data-testid="btn-mark-all-read"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: `Unread (${unreadCount})` },
          ...Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => ({ key, label })),
        ].map(({ key, label }) => (
          <button
            key={key}
            data-testid={`filter-notif-${key}`}
            onClick={() => setFilter(key as typeof filter)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              filter === key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <BellOff className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No notifications</h3>
            <p className="text-xs text-slate-400">You're all caught up!</p>
          </div>
        ) : filtered.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            data-testid={`notification-${notif.id}`}
            onClick={() => { handleMarkRead(notif.id); if (notif.actionUrl) setLocation(notif.actionUrl); }}
            className={cn(
              "flex items-start gap-4 bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm",
              !notif.read ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200",
            )}
          >
            {/* Type icon */}
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg", typeIconColors[notif.type])}>
              <Bell className="h-4.5 w-4.5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-slate-800 truncate">{notif.title}</p>
                {!notif.read && (
                  <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-snug mb-2">{notif.message}</p>
              <div className="flex items-center gap-3">
                <span className={cn("text-xs px-2 py-0.5 rounded-full border", typeColors[notif.type])}>
                  {NOTIFICATION_TYPE_LABELS[notif.type]}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {timeAgo(notif.timestamp)}
                </span>
                <span className={cn("text-xs font-medium capitalize ml-auto",
                  notif.priority === "high" ? "text-red-500" : notif.priority === "medium" ? "text-amber-500" : "text-slate-400"
                )}>
                  {notif.priority} priority
                </span>
              </div>
            </div>

            {notif.actionUrl && (
              <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0 mt-1" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
