from pydantic import BaseModel, Field
from typing import List, Dict
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult

class LeanCanvas(BaseModel):
    problem: List[str] = Field(..., description="Top 3 problems to address")
    customer_segments: List[str] = Field(..., description="Target customer segments and early adopters")
    uvp: str = Field(..., description="Unique Value Proposition - single clear compelling message")
    channels: List[str] = Field(..., description="Path to customers / marketing channels")
    revenue_streams: List[str] = Field(..., description="Sources of revenue")
    cost_structure: List[str] = Field(..., description="Fixed and variable costs")
    key_metrics: List[str] = Field(..., description="Key activities to measure")
    unfair_advantage: str = Field(..., description="Something that cannot be easily copied or bought")

class SWOTAnalysis(BaseModel):
    strengths: List[str] = Field(..., description="Internal strengths")
    weaknesses: List[str] = Field(..., description="Internal weaknesses")
    opportunities: List[str] = Field(..., description="External opportunities")
    threats: List[str] = Field(..., description="External threats")

class PortersFiveForces(BaseModel):
    rivalry: str = Field(..., description="Intensity of competitive rivalry (High/Medium/Low) + Details")
    supplier_power: str = Field(..., description="Bargaining power of suppliers (High/Medium/Low) + Details")
    buyer_power: str = Field(..., description="Bargaining power of buyers (High/Medium/Low) + Details")
    substitution_threat: str = Field(..., description="Threat of substitute products (High/Medium/Low) + Details")
    new_entrants_threat: str = Field(..., description="Threat of new entrants (High/Medium/Low) + Details")

class JobsToBeDone(BaseModel):
    jobs: List[str] = Field(..., description="What jobs the customer is hiring the solution to perform")
    pains: List[str] = Field(..., description="Pains customers face in getting their jobs done")
    gains: List[str] = Field(..., description="Gains they want or expect")

class CustomerProfile(BaseModel):
    jobs: List[str] = Field(..., description="Functional, emotional, and social customer jobs")
    pains: List[str] = Field(..., description="Obstacles, risks, and frustrations")
    gains: List[str] = Field(..., description="Expected, desired, and unexpected benefits")

class ValueMap(BaseModel):
    products_and_services: List[str] = Field(..., description="List of what the solution offers")
    pain_relievers: List[str] = Field(..., description="How products/services alleviate customer pains")
    gain_creators: List[str] = Field(..., description="How products/services create customer gains")

class ValuePropositionCanvas(BaseModel):
    customer_profile: CustomerProfile
    value_map: ValueMap
    fit_analysis: str = Field(..., description="How well the Value Map aligns with the Customer Profile")

class FrameworkMeta(BaseModel):
    reasoning: str = Field(..., description="Why this framework is suitable and what it reveals")
    gaps: List[str] = Field(..., description="Identified gaps in the validation")
    assumptions: List[str] = Field(..., description="Unverified assumptions highlighted by this framework")
    recommendations: List[str] = Field(..., description="Actionable recommendations derived from the framework")

class ValidationInput(BaseModel):
    discovery_data: DiscoveryResult = Field(..., description="Problem discovery output")
    solution_data: SolutionResult = Field(..., description="Solution builder output")
    research_data: ResearchResult = Field(..., description="Research engine output")

class ValidationResult(BaseModel):
    lean_canvas: LeanCanvas
    swot: SWOTAnalysis
    porters_five_forces: PortersFiveForces
    jtbd: JobsToBeDone
    value_proposition_canvas: ValuePropositionCanvas
    framework_meta: Dict[str, FrameworkMeta] = Field(..., description="Meta notes keyed by framework name: 'lean_canvas', 'swot', 'porters_five_forces', 'jtbd', 'value_proposition_canvas'")

