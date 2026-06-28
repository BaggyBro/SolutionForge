from pydantic import BaseModel, Field
from typing import List
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult

class Competitor(BaseModel):
    name: str = Field(..., description="Name of competitor or competing organization")
    market_share: str = Field(..., description="Estimated market share or category presence")
    strengths: List[str] = Field(..., description="Key competitive strengths")
    weaknesses: List[str] = Field(..., description="Key vulnerabilities or gaps")

class AlternativeSolution(BaseModel):
    description: str = Field(..., description="Non-competitor alternative users currently resort to (e.g. spreadsheets)")
    viability: str = Field(..., description="How viable it is compared to our solution")

class PricingBenchmark(BaseModel):
    tier: str = Field(..., description="Pricing tier name (e.g. Basic, Pro)")
    price: str = Field(..., description="Estimated price range or rate")
    model: str = Field(..., description="Pricing model, e.g. SaaS Subscription, Pay-as-you-go")

class Vendor(BaseModel):
    name: str = Field(..., description="Recommended vendor or software platform")
    service: str = Field(..., description="Offered service or capability")
    estimate: str = Field(..., description="Estimated costs or starting price")
    contact_or_link: str = Field(..., description="Vendor website, details or contact info")

class ServiceProvider(BaseModel):
    name: str = Field(..., description="Offshore, agency, or expert provider name")
    services: List[str] = Field(..., description="Offered services")
    rating: float = Field(..., description="Quality/rating (out of 5.0)")

class MarketObservation(BaseModel):
    observation: str = Field(..., description="Key market insight or shift")
    trend: str = Field(..., description="Trend direction, e.g. Growth, Decline, Stable")

class CostEstimate(BaseModel):
    item: str = Field(..., description="Budget category/item")
    low_range: float = Field(..., description="Low end cost estimate in USD")
    high_range: float = Field(..., description="High end cost estimate in USD")
    recurrency: str = Field(..., description="One-time / Monthly / Annual")

class ResearchRisk(BaseModel):
    risk: str = Field(..., description="Research-identified risk")
    severity: str = Field(..., description="High/Medium/Low severity")
    mitigation: str = Field(..., description="How to mitigate this risk")

class Opportunity(BaseModel):
    opportunity: str = Field(..., description="Market gap or timing opportunity")
    potential_impact: str = Field(..., description="Potential impact (e.g. High/Medium/Low)")

class ResearchInput(BaseModel):
    discovery_data: DiscoveryResult = Field(..., description="Problem discovery output")
    solution_data: SolutionResult = Field(..., description="Solution builder output")

class ResearchResult(BaseModel):
    competitor_analysis: List[Competitor]
    existing_alternatives: List[AlternativeSolution]
    pricing_benchmarks: List[PricingBenchmark]
    vendor_recommendations: List[Vendor]
    service_providers: List[ServiceProvider]
    market_observations: List[MarketObservation]
    cost_estimates: List[CostEstimate]
    risks: List[ResearchRisk]
    opportunities: List[Opportunity]
