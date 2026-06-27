import { Notification } from "../types";

export const notifications: Notification[] = [
  {
    id: "notif-001", type: "rolloff", title: "Upcoming Roll-off: Arjun Kumar",
    message: "Arjun Kumar (Senior Developer) will roll off Project Atlas on July 15, 2025. Action required to assign to new project or place on bench.",
    timestamp: "2025-06-25T09:15:00Z", read: false, priority: "high", actionUrl: "/employees",
  },
  {
    id: "notif-002", type: "bench_alert", title: "Bench Count Crossed 20%",
    message: "Current bench percentage is 21%, exceeding the threshold of 20%. 25 resources are currently unallocated.",
    timestamp: "2025-06-25T08:30:00Z", read: false, priority: "high", actionUrl: "/employees",
  },
  {
    id: "notif-003", type: "skill_alert", title: "Critical Skill Shortage: Kubernetes",
    message: "Project Quantum Analytics requires 6 Kubernetes engineers but only 2 are available on bench. Immediate sourcing recommended.",
    timestamp: "2025-06-25T07:45:00Z", read: false, priority: "high", actionUrl: "/skill-gap",
  },
  {
    id: "notif-004", type: "request", title: "New Allocation Request: Project Nexus",
    message: "Priya Sharma has requested a Senior Python Developer for Operation Nexus starting July 1, 2025.",
    timestamp: "2025-06-24T16:20:00Z", read: false, priority: "medium", actionUrl: "/allocation",
  },
  {
    id: "notif-005", type: "delay", title: "Project Delay: OpsVision",
    message: "OpsVision (Shell Global) has been placed on-hold due to client budget freeze. 4 resources need reallocation.",
    timestamp: "2025-06-24T14:00:00Z", read: true, priority: "high", actionUrl: "/projects",
  },
  {
    id: "notif-006", type: "rolloff", title: "Upcoming Roll-off: Priya Nair",
    message: "Priya Nair (Tech Lead) rolls off CloudShift Initiative on July 20, 2025.",
    timestamp: "2025-06-24T11:30:00Z", read: true, priority: "medium", actionUrl: "/employees",
  },
  {
    id: "notif-007", type: "bench_alert", title: "5 Engineers Idle for 30+ Days",
    message: "5 senior engineers in the Engineering department have been on bench for over 30 days. Immediate allocation action needed.",
    timestamp: "2025-06-24T09:00:00Z", read: true, priority: "high", actionUrl: "/employees",
  },
  {
    id: "notif-008", type: "skill_alert", title: "Skill Gap: React Native",
    message: "3 upcoming projects require React Native developers. Current available count: 1. Consider training program for 4 Angular developers.",
    timestamp: "2025-06-23T15:45:00Z", read: true, priority: "medium", actionUrl: "/skill-gap",
  },
  {
    id: "notif-009", type: "request", title: "Allocation Request Approved: Project Phoenix",
    message: "Your request for 2 Java architects for Project Phoenix has been approved. Resources start on July 1.",
    timestamp: "2025-06-23T13:20:00Z", read: true, priority: "low", actionUrl: "/allocation",
  },
  {
    id: "notif-010", type: "rolloff", title: "Mass Roll-off: Project RetailPulse Closure",
    message: "Project RetailPulse is 100% complete. 10 resources rolling off on March 31. Please plan reallocation.",
    timestamp: "2025-06-23T10:00:00Z", read: true, priority: "high", actionUrl: "/projects",
  },
  {
    id: "notif-011", type: "request", title: "Urgent: DevOps Engineer Needed",
    message: "DevPipeline Pro requires an additional DevOps engineer with ArgoCD experience immediately.",
    timestamp: "2025-06-22T16:00:00Z", read: true, priority: "high", actionUrl: "/allocation",
  },
  {
    id: "notif-012", type: "bench_alert", title: "Bench Cost Alert: ₹45L This Month",
    message: "Monthly bench cost has reached ₹45 Lakhs. Consider accelerating allocation for 8 senior resources.",
    timestamp: "2025-06-22T09:30:00Z", read: true, priority: "high", actionUrl: "/reports",
  },
  {
    id: "notif-013", type: "skill_alert", title: "Certification Expiry: AWS Solutions Architect",
    message: "12 employees' AWS Solutions Architect certifications expire within 60 days. Schedule renewal training.",
    timestamp: "2025-06-21T14:00:00Z", read: true, priority: "medium", actionUrl: null,
  },
  {
    id: "notif-014", type: "request", title: "New Project Kickoff: Quantum Analytics",
    message: "Quantum Analytics (HSBC) kicks off August 1. 9 positions need to be filled across Data Science and Cloud teams.",
    timestamp: "2025-06-21T11:00:00Z", read: true, priority: "high", actionUrl: "/allocation",
  },
  {
    id: "notif-015", type: "delay", title: "Project Timeline Slippage: BlueSky Migration",
    message: "BlueSky Migration is 2 weeks behind schedule due to delayed client environment access.",
    timestamp: "2025-06-20T15:30:00Z", read: true, priority: "medium", actionUrl: "/projects",
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `notif-${String(16 + i).padStart(3, "0")}`,
    type: (["rolloff", "bench_alert", "skill_alert", "request", "delay"] as Notification["type"][])[i % 5],
    title: ["Rolloff Alert: Team Member", "Bench Threshold Warning", "Skill Gap Identified", "Allocation Request", "Schedule Delay"][i % 5],
    message: `This is notification ${16 + i} with details about the resource management event.`,
    timestamp: `2025-06-${String(19 - Math.floor(i / 2)).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:00:00Z`,
    read: true,
    priority: (["high", "medium", "low", "medium", "high"] as Notification["priority"][])[i % 5],
    actionUrl: ["/employees", null, "/skill-gap", "/allocation", "/projects"][i % 5],
  })),
];
