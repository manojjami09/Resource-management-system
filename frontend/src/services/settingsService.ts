import axios from 'axios';

const API_URL = "http://localhost:8080/api/settings";

export interface UserSettings {
  rolloffAlerts: boolean;
  benchThresholdAlerts: boolean;
  skillGapWarnings: boolean;
  allocationRequests: boolean;
  projectDelayAlerts: boolean;
  weeklySummaryEmail: boolean;
}

export async function getSettings(): Promise<UserSettings> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching settings", error);
    // Return safe defaults
    return {
      rolloffAlerts: true,
      benchThresholdAlerts: true,
      skillGapWarnings: true,
      allocationRequests: true,
      projectDelayAlerts: false,
      weeklySummaryEmail: true
    };
  }
}

export async function saveSettings(settings: UserSettings): Promise<UserSettings> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(API_URL, settings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving settings", error);
    throw error;
  }
}
