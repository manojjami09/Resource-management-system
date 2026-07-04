import { Report, ReportFormat } from "../types";
import { apiClient } from "../lib/apiClient";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getMonthlyUtilizationReport(): Promise<Report> {
  const response = await apiClient.get('/reports/utilization');
  return response.data;
}

export async function getProjectSummaryReport(): Promise<Report> {
  const response = await apiClient.get('/reports/project-summary');
  return response.data;
}

export async function getBenchReport(): Promise<Report> {
  const response = await apiClient.get('/reports/bench');
  return response.data;
}

export async function getForecastReport(): Promise<Report> {
  const response = await apiClient.get('/reports/forecast');
  return response.data;
}

export async function exportReport(type: string, format: ReportFormat): Promise<void> {
  await delay(800 + Math.random() * 400);
  console.info(`Exporting ${type} as ${format}`);
}

export async function scheduleReport(type: string, schedule: string): Promise<void> {
  await delay(500);
  console.info(`Scheduled ${type} report: ${schedule}`);
}
