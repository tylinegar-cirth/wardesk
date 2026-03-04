// Mock data for demo mode — advisory side of the portal
// Shapes match Supabase query return types so existing JSX renders correctly

function futureDate(daysFromNow: number, hour: number, minute: number = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function pastDate(daysAgo: number, hour: number, minute: number = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const demoProfile = {
  name: "Alex Chen",
  focus_areas: ["Defense AI", "C4ISR", "Autonomous Systems"],
};

const demoAdvisors = {
  garrett: {
    id: "demo-adv-1",
    name: "LTG Michael Garrett",
    title: "Former Commanding General, FORSCOM",
    category: "Army",
    branch: "Army",
    stars: 3,
    focus: ["Force Modernization", "Indo-Pacific", "Ground Maneuver"],
    clearance: "TS/SCI",
    rate: 75000,
    bio: "",
    image_url: "",
    years_service: 37,
    availability_status: "available",
    created_at: "",
  },
  clark: {
    id: "demo-adv-2",
    name: "RADM Sarah Clark",
    title: "Former Director, Naval Intelligence",
    category: "Navy",
    branch: "Navy",
    stars: 2,
    focus: ["Maritime ISR", "Undersea Warfare", "SIGINT"],
    clearance: "TS/SCI",
    rate: 60000,
    bio: "",
    image_url: "",
    years_service: 30,
    availability_status: "available",
    created_at: "",
  },
  powell: {
    id: "demo-adv-3",
    name: "BGen James Powell",
    title: "Former Deputy Director, DIA",
    category: "Intel",
    branch: "Air Force",
    stars: 1,
    focus: ["Defense AI", "C4ISR", "Space Systems"],
    clearance: "TS/SCI",
    rate: 50000,
    bio: "",
    image_url: "",
    years_service: 28,
    availability_status: "limited",
    created_at: "",
  },
};

// --- Dashboard Data ---

export const demoUpcomingSessions = [
  {
    id: "demo-session-1",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    scheduled_at: futureDate(2, 14, 0),
    duration_minutes: 60,
    status: "confirmed",
    price: 75000,
    meeting_link: "#",
    notes: null,
    created_at: pastDate(5, 10),
    advisor: demoAdvisors.garrett,
  },
  {
    id: "demo-session-2",
    user_id: "demo-user",
    advisor_id: demoAdvisors.clark.id,
    scheduled_at: futureDate(5, 10, 30),
    duration_minutes: 30,
    status: "confirmed",
    price: 30000,
    meeting_link: "#",
    notes: null,
    created_at: pastDate(3, 15),
    advisor: demoAdvisors.clark,
  },
  {
    id: "demo-session-3",
    user_id: "demo-user",
    advisor_id: demoAdvisors.powell.id,
    scheduled_at: futureDate(8, 16, 0),
    duration_minutes: 90,
    status: "confirmed",
    price: 75000,
    meeting_link: "#",
    notes: null,
    created_at: pastDate(1, 9),
    advisor: demoAdvisors.powell,
  },
];

export const demoRetainers = [
  {
    id: "demo-retainer-1",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    tier: "strategy",
    hours_per_month: 8,
    monthly_price: 480000,
    status: "active",
    stripe_subscription_id: null,
    created_at: pastDate(45, 10),
    advisor: demoAdvisors.garrett,
  },
  {
    id: "demo-retainer-2",
    user_id: "demo-user",
    advisor_id: demoAdvisors.clark.id,
    tier: "signal",
    hours_per_month: 4,
    monthly_price: 200000,
    status: "active",
    stripe_subscription_id: null,
    created_at: pastDate(30, 14),
    advisor: demoAdvisors.clark,
  },
];

export const demoRecentSessions = [
  {
    id: "demo-past-1",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    scheduled_at: pastDate(3, 14),
    duration_minutes: 60,
    status: "completed",
    price: 75000,
    meeting_link: null,
    notes: "Discussed FORSCOM modernization priorities and acquisition strategy for autonomous ground vehicles.",
    created_at: pastDate(10, 10),
    advisor: demoAdvisors.garrett,
  },
  {
    id: "demo-past-2",
    user_id: "demo-user",
    advisor_id: demoAdvisors.powell.id,
    scheduled_at: pastDate(7, 11),
    duration_minutes: 60,
    status: "completed",
    price: 50000,
    meeting_link: null,
    notes: "Reviewed C4ISR integration roadmap. Follow up on DIA requirements.",
    created_at: pastDate(14, 9),
    advisor: demoAdvisors.powell,
  },
  {
    id: "demo-past-3",
    user_id: "demo-user",
    advisor_id: demoAdvisors.clark.id,
    scheduled_at: pastDate(12, 15, 30),
    duration_minutes: 30,
    status: "completed",
    price: 30000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(20, 12),
    advisor: demoAdvisors.clark,
  },
];

export const demoRecommendedAdvisors = [
  demoAdvisors.garrett,
  demoAdvisors.clark,
  demoAdvisors.powell,
];

// --- Sessions Page Data ---

export const demoAllUpcoming = demoUpcomingSessions;

export const demoAllPast = [
  ...demoRecentSessions,
  {
    id: "demo-past-4",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    scheduled_at: pastDate(18, 10),
    duration_minutes: 90,
    status: "completed",
    price: 112500,
    meeting_link: null,
    notes: "Strategy session — Indo-Pacific threat landscape and force posture recommendations.",
    created_at: pastDate(25, 8),
    advisor: demoAdvisors.garrett,
  },
  {
    id: "demo-past-5",
    user_id: "demo-user",
    advisor_id: demoAdvisors.powell.id,
    scheduled_at: pastDate(24, 14),
    duration_minutes: 60,
    status: "completed",
    price: 50000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(30, 10),
    advisor: demoAdvisors.powell,
  },
];

// --- Billing Page Data ---

export const demoBillingRetainers = demoRetainers;

export const demoPayments = [
  {
    id: "demo-pay-1",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    scheduled_at: pastDate(3, 14),
    duration_minutes: 60,
    status: "completed",
    price: 75000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(10, 10),
    advisor: { name: demoAdvisors.garrett.name, image_url: demoAdvisors.garrett.image_url },
  },
  {
    id: "demo-pay-2",
    user_id: "demo-user",
    advisor_id: demoAdvisors.powell.id,
    scheduled_at: pastDate(7, 11),
    duration_minutes: 60,
    status: "completed",
    price: 50000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(14, 9),
    advisor: { name: demoAdvisors.powell.name, image_url: demoAdvisors.powell.image_url },
  },
  {
    id: "demo-pay-3",
    user_id: "demo-user",
    advisor_id: demoAdvisors.clark.id,
    scheduled_at: pastDate(12, 15, 30),
    duration_minutes: 30,
    status: "completed",
    price: 30000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(20, 12),
    advisor: { name: demoAdvisors.clark.name, image_url: demoAdvisors.clark.image_url },
  },
  {
    id: "demo-pay-4",
    user_id: "demo-user",
    advisor_id: demoAdvisors.garrett.id,
    scheduled_at: pastDate(18, 10),
    duration_minutes: 90,
    status: "confirmed",
    price: 112500,
    meeting_link: null,
    notes: null,
    created_at: pastDate(25, 8),
    advisor: { name: demoAdvisors.garrett.name, image_url: demoAdvisors.garrett.image_url },
  },
  {
    id: "demo-pay-5",
    user_id: "demo-user",
    advisor_id: demoAdvisors.powell.id,
    scheduled_at: pastDate(24, 14),
    duration_minutes: 60,
    status: "completed",
    price: 50000,
    meeting_link: null,
    notes: null,
    created_at: pastDate(30, 10),
    advisor: { name: demoAdvisors.powell.name, image_url: demoAdvisors.powell.image_url },
  },
];
