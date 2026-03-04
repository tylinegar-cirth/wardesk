// ── Types ──

export interface StudioProject {
  id: string;
  title: string;
  type: string;
  status: "in_progress" | "review" | "delivered" | "production" | "briefing";
  progress: number;
  dueDate: string;
  description: string;
  assignedTo: string;
  thumbnail: string;
  lastUpdate: string;
  deliverables: { name: string; complete: boolean }[];
}

export interface StudioAsset {
  id: string;
  name: string;
  type: "Video" | "Image" | "Document";
  size: string;
  project: string;
  projectId: string;
  date: string;
  thumbnail: string;
}

export interface StudioInvoice {
  id: string;
  number: string;
  period: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

export interface StudioActivity {
  id: number;
  type: string;
  text: string;
  project: string | null;
  time: string;
}

export interface StudioMilestone {
  id: string;
  projectId: string;
  project: string;
  name: string;
  date: string;
  status: "complete" | "current" | "upcoming";
}

// ── Mock Client ──

export const mockClient = {
  companyName: "Saronic",
  plan: "Studio Retainer",
  planPrice: 25000,
  billingCycle: "monthly" as const,
  nextBilling: "Apr 1, 2026",
  since: "Oct 2025",
  primaryContact: "Alex Chen",
  email: "alex@saronic.com",
};

// ── Mock Projects ──

export const mockProjects: StudioProject[] = [
  {
    id: "p1",
    title: "AUSA 2026 Booth",
    type: "Booth",
    status: "in_progress",
    progress: 65,
    dueDate: "Oct 10, 2026",
    description:
      "20x30 island booth with video wall, demo stations, and meeting space. Full design, fabrication, and on-site support.",
    assignedTo: "Ty Linegar",
    thumbnail: "\uD83C\uDFAA",
    lastUpdate: "2 days ago",
    deliverables: [
      { name: "Booth concept designs", complete: true },
      { name: "3D renders", complete: true },
      { name: "Video wall content", complete: false },
      { name: "Fabrication", complete: false },
      { name: "On-site installation", complete: false },
    ],
  },
  {
    id: "p2",
    title: "Recruitment Film",
    type: "Film",
    status: "review",
    progress: 90,
    dueDate: "Mar 15, 2026",
    description:
      "3-minute recruitment film targeting engineering talent. Interviews with team, facility footage, mission narrative.",
    assignedTo: "Ty Linegar",
    thumbnail: "\uD83C\uDFAC",
    lastUpdate: "5 hours ago",
    deliverables: [
      { name: "Creative brief", complete: true },
      { name: "Script", complete: true },
      { name: "Shoot", complete: true },
      { name: "Rough cut", complete: true },
      { name: "Final delivery", complete: false },
    ],
  },
  {
    id: "p3",
    title: "Series C Investor Deck Video",
    type: "Film",
    status: "delivered",
    progress: 100,
    dueDate: "Jan 5, 2026",
    description:
      "90-second sizzle reel for investor meetings. Product footage, market opportunity, team credibility.",
    assignedTo: "Ty Linegar",
    thumbnail: "\uD83D\uDCFD\uFE0F",
    lastUpdate: "Jan 5, 2026",
    deliverables: [
      { name: "Storyboard", complete: true },
      { name: "Voiceover recording", complete: true },
      { name: "Motion graphics", complete: true },
      { name: "Final delivery", complete: true },
    ],
  },
  {
    id: "p4",
    title: "Q1 Social Content Pack",
    type: "Campaign",
    status: "production",
    progress: 40,
    dueDate: "Mar 31, 2026",
    description:
      "12 pieces of short-form content for LinkedIn and Twitter. Mix of product clips, team moments, and thought leadership.",
    assignedTo: "GRITCULT",
    thumbnail: "\uD83D\uDCF1",
    lastUpdate: "1 day ago",
    deliverables: [
      { name: "Content calendar", complete: true },
      { name: "4x product clips", complete: true },
      { name: "4x team clips", complete: false },
      { name: "4x thought leadership", complete: false },
    ],
  },
  {
    id: "p5",
    title: "Space Symposium Booth",
    type: "Booth",
    status: "briefing",
    progress: 10,
    dueDate: "Apr 8, 2026",
    description:
      "10x20 inline booth for Space Symposium. Video wall, demo integration, and meeting space.",
    assignedTo: "Ty Linegar",
    thumbnail: "\uD83D\uDE80",
    lastUpdate: "3 days ago",
    deliverables: [
      { name: "Initial brief", complete: true },
      { name: "Concept designs", complete: false },
      { name: "3D renders", complete: false },
      { name: "Fabrication", complete: false },
    ],
  },
];

// ── Mock Assets ──

export const mockAssets: StudioAsset[] = [
  {
    id: "a1",
    name: "AUSA_Booth_Render_v3.png",
    type: "Image",
    size: "4.2 MB",
    project: "AUSA 2026 Booth",
    projectId: "p1",
    date: "Jan 28, 2026",
    thumbnail: "\uD83D\uDDBC\uFE0F",
  },
  {
    id: "a2",
    name: "AUSA_Booth_FloorPlan.pdf",
    type: "Document",
    size: "1.1 MB",
    project: "AUSA 2026 Booth",
    projectId: "p1",
    date: "Jan 20, 2026",
    thumbnail: "\uD83D\uDCC4",
  },
  {
    id: "a3",
    name: "Recruitment_Film_RoughCut_v2.mp4",
    type: "Video",
    size: "890 MB",
    project: "Recruitment Film",
    projectId: "p2",
    date: "Jan 30, 2026",
    thumbnail: "\uD83C\uDFAC",
  },
  {
    id: "a4",
    name: "Recruitment_Film_Script_FINAL.pdf",
    type: "Document",
    size: "245 KB",
    project: "Recruitment Film",
    projectId: "p2",
    date: "Jan 12, 2026",
    thumbnail: "\uD83D\uDCC4",
  },
  {
    id: "a5",
    name: "Investor_Sizzle_FINAL.mp4",
    type: "Video",
    size: "156 MB",
    project: "Series C Investor Deck Video",
    projectId: "p3",
    date: "Jan 5, 2026",
    thumbnail: "\uD83C\uDFAC",
  },
  {
    id: "a6",
    name: "Q1_Content_Calendar.xlsx",
    type: "Document",
    size: "89 KB",
    project: "Q1 Social Content Pack",
    projectId: "p4",
    date: "Jan 15, 2026",
    thumbnail: "\uD83D\uDCCA",
  },
  {
    id: "a7",
    name: "Product_Clip_01.mp4",
    type: "Video",
    size: "45 MB",
    project: "Q1 Social Content Pack",
    projectId: "p4",
    date: "Jan 25, 2026",
    thumbnail: "\uD83C\uDFAC",
  },
  {
    id: "a8",
    name: "Product_Clip_02.mp4",
    type: "Video",
    size: "52 MB",
    project: "Q1 Social Content Pack",
    projectId: "p4",
    date: "Jan 27, 2026",
    thumbnail: "\uD83C\uDFAC",
  },
];

// ── Mock Invoices ──

export const mockInvoices: StudioInvoice[] = [
  {
    id: "inv1",
    number: "INV-1042",
    period: "Jan 2026",
    amount: 25000,
    status: "paid",
    date: "Jan 1, 2026",
  },
  {
    id: "inv2",
    number: "INV-1031",
    period: "Dec 2025",
    amount: 25000,
    status: "paid",
    date: "Dec 1, 2025",
  },
  {
    id: "inv3",
    number: "INV-1019",
    period: "Nov 2025",
    amount: 25000,
    status: "paid",
    date: "Nov 1, 2025",
  },
  {
    id: "inv4",
    number: "INV-1008",
    period: "Oct 2025",
    amount: 25000,
    status: "paid",
    date: "Oct 1, 2025",
  },
];

// ── Mock Activity ──

export const mockActivity: StudioActivity[] = [
  {
    id: 1,
    type: "asset_upload",
    text: "New asset uploaded: AUSA_Booth_Render_v3.png",
    project: "AUSA 2026 Booth",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "feedback_request",
    text: "Feedback requested on Recruitment Film rough cut",
    project: "Recruitment Film",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "invoice_paid",
    text: "Invoice #1042 marked as paid",
    project: null,
    time: "1 day ago",
  },
  {
    id: 4,
    type: "milestone_complete",
    text: "Milestone completed: Booth design approved",
    project: "AUSA 2026 Booth",
    time: "2 days ago",
  },
  {
    id: 5,
    type: "project_created",
    text: "New project created: Space Symposium Booth",
    project: "Space Symposium Booth",
    time: "3 days ago",
  },
  {
    id: 6,
    type: "delivery",
    text: "Final delivery: Series C Investor Deck Video",
    project: "Series C Investor Deck Video",
    time: "Jan 5, 2026",
  },
];

// ── Mock Milestones ──

export const mockMilestones: StudioMilestone[] = [
  {
    id: "m1",
    projectId: "p1",
    project: "AUSA 2026 Booth",
    name: "Concept approval",
    date: "2026-01-15",
    status: "complete",
  },
  {
    id: "m2",
    projectId: "p1",
    project: "AUSA 2026 Booth",
    name: "3D renders delivered",
    date: "2026-01-28",
    status: "complete",
  },
  {
    id: "m3",
    projectId: "p1",
    project: "AUSA 2026 Booth",
    name: "Video wall content draft",
    date: "2026-03-15",
    status: "upcoming",
  },
  {
    id: "m4",
    projectId: "p1",
    project: "AUSA 2026 Booth",
    name: "Fabrication complete",
    date: "2026-09-15",
    status: "upcoming",
  },
  {
    id: "m5",
    projectId: "p2",
    project: "Recruitment Film",
    name: "Rough cut review",
    date: "2026-03-01",
    status: "current",
  },
  {
    id: "m6",
    projectId: "p2",
    project: "Recruitment Film",
    name: "Final delivery",
    date: "2026-03-15",
    status: "upcoming",
  },
  {
    id: "m7",
    projectId: "p4",
    project: "Q1 Social Content Pack",
    name: "First 4 clips delivered",
    date: "2026-03-10",
    status: "upcoming",
  },
  {
    id: "m8",
    projectId: "p5",
    project: "Space Symposium Booth",
    name: "Concept presentation",
    date: "2026-03-20",
    status: "upcoming",
  },
];

// ── Status display config ──

export const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  briefing: { label: "BRIEFING", color: "text-wd-sub bg-wd-overlay/[0.06] border-wd-border" },
  production: { label: "PRODUCTION", color: "text-wd-gold bg-wd-gold-glow border-wd-gold/20" },
  in_progress: { label: "IN PROGRESS", color: "text-wd-gold bg-wd-gold-glow border-wd-gold/20" },
  review: { label: "IN REVIEW", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  delivered: { label: "DELIVERED", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  complete: { label: "COMPLETE", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  paid: { label: "PAID", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pending: { label: "PENDING", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  overdue: { label: "OVERDUE", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};
