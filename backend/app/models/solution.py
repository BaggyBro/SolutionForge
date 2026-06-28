from pydantic import BaseModel, Field
from typing import List
from app.models.discovery import DiscoveryResult

class SolutionOption(BaseModel):
    title: str = Field(..., description="Name of the solution concept")
    description: str = Field(..., description="Detailed description of how it works")
    pros: List[str] = Field(..., description="Key advantages")
    cons: List[str] = Field(..., description="Key disadvantages or risks")

class AlternativeApproach(BaseModel):
    title: str = Field(..., description="Alternative concept name")
    description: str = Field(..., description="How this alternative works")
    rationale: str = Field(..., description="Why this alternative is worth considering")

class FeatureSuggestion(BaseModel):
    feature: str = Field(..., description="Proposed feature name")
    description: str = Field(..., description="What the feature does")
    complexity: str = Field(..., description="High/Medium/Low implementation effort")
    value: str = Field(..., description="High/Medium/Low customer value")

class ResourceRequirements(BaseModel):
    people: List[str] = Field(..., description="Required skills or personnel")
    tools: List[str] = Field(..., description="Required software, SaaS or toolsets")
    infrastructure: List[str] = Field(..., description="Required servers, office space, or other physical/hosting assets")

class MVPRecommendation(BaseModel):
    feature: str = Field(..., description="Feature to include in the MVP")
    rationale: str = Field(..., description="Why this should be part of the MVP rather than later phases")

class RoadmapMilestone(BaseModel):
    phase: str = Field(..., description="Phase identifier, e.g. Phase 1: MVP Setup")
    duration: str = Field(..., description="Estimated timeline duration (e.g. Weeks 1-4)")
    deliverables: List[str] = Field(..., description="List of deliverables for this phase")

class SolutionInput(BaseModel):
    discovery_data: DiscoveryResult = Field(..., description="Output from the Problem Discovery phase")

class SolutionResult(BaseModel):
    potential_solutions: List[SolutionOption]
    alternative_approaches: List[AlternativeApproach]
    feature_suggestions: List[FeatureSuggestion]
    resource_requirements: ResourceRequirements
    mvp_recommendations: List[MVPRecommendation]
    implementation_roadmap: List[RoadmapMilestone]
