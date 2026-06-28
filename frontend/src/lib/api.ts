const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Stakeholder {
  name: string;
  role: string;
  impact: string;
  needs: string;
}

export interface Assumption {
  assumption: string;
  category: string;
  risk_level: string;
}

export interface RootCause {
  cause: string;
  explanation: string;
  evidence: string;
}

export interface SuccessCriterion {
  metric: string;
  target: string;
  timeline: string;
}

export interface DiscoveryInput {
  problem_statement: string;
  domain: string;
  target_users: string;
  constraints: string;
  goals: string;
}

export interface DiscoveryResult {
  refined_problem: string;
  stakeholder_map: Stakeholder[];
  key_assumptions: Assumption[];
  root_causes: RootCause[];
  success_criteria: SuccessCriterion[];
}

export interface SolutionOption {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface AlternativeApproach {
  title: string;
  description: string;
  rationale: string;
}

export interface FeatureSuggestion {
  feature: string;
  description: string;
  complexity: string;
  value: string;
}

export interface ResourceRequirements {
  people: string[];
  tools: string[];
  infrastructure: string[];
}

export interface MVPRecommendation {
  feature: string;
  rationale: string;
}

export interface RoadmapMilestone {
  phase: string;
  duration: string;
  deliverables: string[];
}

export interface SolutionResult {
  potential_solutions: SolutionOption[];
  alternative_approaches: AlternativeApproach[];
  feature_suggestions: FeatureSuggestion[];
  resource_requirements: ResourceRequirements;
  mvp_recommendations: MVPRecommendation[];
  implementation_roadmap: RoadmapMilestone[];
}

export interface Competitor {
  name: string;
  market_share: string;
  strengths: string[];
  weaknesses: string[];
}

export interface AlternativeSolution {
  description: string;
  viability: string;
}

export interface PricingBenchmark {
  tier: string;
  price: string;
  model: string;
}

export interface Vendor {
  name: string;
  service: string;
  estimate: string;
  contact_or_link: string;
}

export interface ServiceProvider {
  name: string;
  services: string[];
  rating: number;
}

export interface MarketObservation {
  observation: string;
  trend: string;
}

export interface CostEstimate {
  item: string;
  low_range: number;
  high_range: number;
  recurrency: string;
}

export interface ResearchRisk {
  risk: string;
  severity: string;
  mitigation: string;
}

export interface Opportunity {
  opportunity: string;
  potential_impact: string;
}

export interface ResearchResult {
  competitor_analysis: Competitor[];
  existing_alternatives: AlternativeSolution[];
  pricing_benchmarks: PricingBenchmark[];
  vendor_recommendations: Vendor[];
  service_providers: ServiceProvider[];
  market_observations: MarketObservation[];
  cost_estimates: CostEstimate[];
  risks: ResearchRisk[];
  opportunities: Opportunity[];
}

export interface LeanCanvas {
  problem: string[];
  customer_segments: string[];
  uvp: string;
  channels: string[];
  revenue_streams: string[];
  cost_structure: string[];
  key_metrics: string[];
  unfair_advantage: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PortersFiveForces {
  rivalry: string;
  supplier_power: string;
  buyer_power: string;
  substitution_threat: string;
  new_entrants_threat: string;
}

export interface JobsToBeDone {
  jobs: string[];
  pains: string[];
  gains: string[];
}

export interface CustomerProfile {
  jobs: string[];
  pains: string[];
  gains: string[];
}

export interface ValueMap {
  products_and_services: string[];
  pain_relievers: string[];
  gain_creators: string[];
}

export interface ValuePropositionCanvas {
  customer_profile: CustomerProfile;
  value_map: ValueMap;
  fit_analysis: string;
}

export interface FrameworkMeta {
  reasoning: string;
  gaps: string[];
  assumptions: string[];
  recommendations: string[];
}

export interface ValidationResult {
  lean_canvas: LeanCanvas;
  swot: SWOTAnalysis;
  porters_five_forces: PortersFiveForces;
  jtbd: JobsToBeDone;
  value_proposition_canvas: ValuePropositionCanvas;
  framework_meta: Record<string, FrameworkMeta>;
}

export interface PlanPhase {
  goals: string[];
  tasks: string[];
  milestones: string[];
}

export interface BudgetBreakdown {
  category: string;
  item: string;
  cost: number;
}

export interface BudgetDetails {
  breakdown: BudgetBreakdown[];
  total_low: number;
  total_high: number;
}

export interface ExecutionRisk {
  description: string;
  severity: string;
  plan_b: string;
}

export interface KPI {
  indicator: string;
  target: string;
}

export interface SuccessMetric {
  metric: string;
  description: string;
}

export interface ExecutionResult {
  plan_30_day: PlanPhase;
  plan_60_day: PlanPhase;
  plan_90_day: PlanPhase;
  estimated_budget: BudgetDetails;
  risks: ExecutionRisk[];
  kpis: KPI[];
  success_metrics: SuccessMetric[];
}

export interface FullReportData {
  project_name: string;
  discovery: DiscoveryResult;
  solution: SolutionResult;
  research: ResearchResult;
  validation: ValidationResult;
  execution: ExecutionResult;
}

export interface ReportResult {
  executive_summary: string;
  markdown_report: string;
  json_report: FullReportData;
}

// API methods
export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }

  return response.json();
}

export async function exportPdf(reportData: FullReportData): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/export/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to export PDF");
  }

  return response.blob();
}
