from pydantic import BaseModel, Field
from typing import List
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult
from app.models.validation import ValidationResult

class PlanPhase(BaseModel):
    goals: List[str] = Field(..., description="Goals for this phase")
    tasks: List[str] = Field(..., description="Actionable tasks to complete")
    milestones: List[str] = Field(..., description="Core milestones to achieve")

class BudgetBreakdown(BaseModel):
    category: str = Field(..., description="Category, e.g. Software, People, Marketing")
    item: str = Field(..., description="Specific item description")
    cost: float = Field(..., description="Estimated cost in USD")

class BudgetDetails(BaseModel):
    breakdown: List[BudgetBreakdown] = Field(..., description="Detailed list of items")
    total_low: float = Field(..., description="Low end estimated total budget")
    total_high: float = Field(..., description="High end estimated total budget")

class ExecutionRisk(BaseModel):
    description: str = Field(..., description="Potential execution risk")
    severity: str = Field(..., description="High/Medium/Low severity")
    plan_b: str = Field(..., description="Contingency or backup plan")

class KPI(BaseModel):
    indicator: str = Field(..., description="Key Performance Indicator name")
    target: str = Field(..., description="Target target threshold")

class SuccessMetric(BaseModel):
    metric: str = Field(..., description="Success metric name")
    description: str = Field(..., description="Description of how it is measured")

class ExecutionInput(BaseModel):
    discovery_data: DiscoveryResult = Field(..., description="Discovery phase output")
    solution_data: SolutionResult = Field(..., description="Solution phase output")
    research_data: ResearchResult = Field(..., description="Research phase output")
    validation_data: ValidationResult = Field(..., description="Validation phase output")

class ExecutionResult(BaseModel):
    plan_30_day: PlanPhase
    plan_60_day: PlanPhase
    plan_90_day: PlanPhase
    estimated_budget: BudgetDetails
    risks: List[ExecutionRisk]
    kpis: List[KPI]
    success_metrics: List[SuccessMetric]
