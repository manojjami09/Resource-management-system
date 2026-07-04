import axios from 'axios';
import { Notification } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/notifications`;

export async function getNotifications(): Promise<Notification[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    return [];
  }
}

export async function markAsRead(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`${API_URL}/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Error marking notification as read", error);
  }
}

export async function markAllAsRead(): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`${API_URL}/read-all`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Error marking all as read", error);
  }
}

export async function getUnreadCount(): Promise<number> {
  const notifs = await getNotifications();
  return notifs.filter(n => !n.read).length;
}
