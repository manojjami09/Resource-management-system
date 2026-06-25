import { notifications as allNotifications } from "../data/notifications";
import { Notification } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let localNotifications = [...allNotifications];

export async function getNotifications(): Promise<Notification[]> {
  await delay(250);
  return [...localNotifications];
}

export async function markAsRead(id: string): Promise<void> {
  await delay(150);
  localNotifications = localNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllAsRead(): Promise<void> {
  await delay(300);
  localNotifications = localNotifications.map((n) => ({ ...n, read: true }));
}

export async function getUnreadCount(): Promise<number> {
  await delay(100);
  return localNotifications.filter((n) => !n.read).length;
}
