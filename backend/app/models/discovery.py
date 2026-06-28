from pydantic import BaseModel, Field
from typing import List

class Stakeholder(BaseModel):
    name: str = Field(..., description="Name or description of stakeholder group")
    role: str = Field(..., description="Role in relation to the problem")
    impact: str = Field(..., description="How they are impacted (High/Medium/Low)")
    needs: str = Field(..., description="Core needs or pain points")

class Assumption(BaseModel):
    assumption: str = Field(..., description="What is being assumed")
    category: str = Field(..., description="Category of assumption (e.g. Technical, User, Market, Resource)")
    risk_level: str = Field(..., description="High/Medium/Low risk if assumption is false")

class RootCause(BaseModel):
    cause: str = Field(..., description="Identified root cause")
    explanation: str = Field(..., description="How this causes the core problem")
    evidence: str = Field(..., description="Observations or logical proof")

class SuccessCriterion(BaseModel):
    metric: str = Field(..., description="Measurable indicator of success")
    target: str = Field(..., description="Specific target threshold")
    timeline: str = Field(..., description="Expected timeframe to reach target")

class DiscoveryInput(BaseModel):
    problem_statement: str = Field(..., description="Initial raw problem statement")
    domain: str = Field(..., description="Domain/industry")
    target_users: str = Field(..., description="Target users / audience")
    constraints: str = Field(..., description="Key constraints or limitations")
    goals: str = Field(..., description="What the user wants to achieve")

class DiscoveryResult(BaseModel):
    refined_problem: str = Field(..., description="Nuanced and expanded problem statement")
    stakeholder_map: List[Stakeholder]
    key_assumptions: List[Assumption]
    root_causes: List[RootCause]
    success_criteria: List[SuccessCriterion]
