export interface Goal {
  id: string;
  name: string;
  type: string;
  amount: number;
  durationYears: number;
  currentSavings: number;
  expectedReturn: number;
  monthlySipRequired?: number;
  onTrack?: boolean;
  status: "On Track" | "Needs Attention";
  createdAt: Date;
}

export interface CalculateGoalRequest {
  goal_amount: number;
  duration_years: number;
  current_savings: number;
  expected_return: number;
}

export interface CalculateGoalResponse {
  monthly_sip_required: number;
  total_investment: number;
  total_interest_earned: number;
  on_track: boolean;
}

export interface AdjustGoalRequest {
  goal_amount: number;
  duration_years: number;
  expected_return: number;
  max_affordable_sip: number;
}

export interface AdjustGoalResponse {
  suggestion: string;
  suggested_duration_years: number;
  suggested_down_payment: number;
  new_sip: number;
}

export interface DashboardSummary {
  totalSips: number;
  activeGoals: number;
  projectedCorpus: number;
}
