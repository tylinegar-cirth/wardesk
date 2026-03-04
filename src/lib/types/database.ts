export interface DbAdvisor {
  id: string;
  name: string;
  title: string;
  branch: string;
  category: string;
  stars: number;
  focus: string[];
  clearance: string;
  rate: number;
  bio: string | null;
  image_url: string | null;
  years_service: number;
  availability_status: "available" | "limited" | "unavailable";
  user_id?: string | null;
  created_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  title: string | null;
  company: string | null;
  role: "user" | "advisor" | "admin";
  focus_areas: string[];
  stripe_customer_id: string | null;
  created_at: string;
}

export interface DbBooking {
  id: string;
  user_id: string;
  advisor_id: string;
  duration_minutes: 30 | 60 | 90;
  scheduled_at: string;
  status: "pending_payment" | "confirmed" | "completed" | "cancelled" | "no-show";
  price: number;
  stripe_payment_id: string | null;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  // Joined fields
  advisor?: DbAdvisor;
  user?: DbUser;
}

export interface DbRetainedSubscription {
  id: string;
  user_id: string;
  advisor_id: string;
  tier: "signal" | "strategy" | "principal";
  hours_per_month: number;
  monthly_price: number;
  stripe_subscription_id: string | null;
  status: "active" | "paused" | "cancelled";
  created_at: string;
  advisor?: DbAdvisor;
}

export interface DbAvailability {
  id: string;
  advisor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
}

export interface DbBlockedDate {
  id: string;
  advisor_id: string;
  date: string;
  reason: string | null;
}
