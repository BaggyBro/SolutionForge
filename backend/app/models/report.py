from pydantic import BaseModel, Field
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult
from app.models.validation import ValidationResult
from app.models.execution import ExecutionResult

class FullReportData(BaseModel):
    project_name: str = Field(..., description="Project / Solution Name")
    discovery: DiscoveryResult
    solution: SolutionResult
    research: ResearchResult
    validation: ValidationResult
    execution: ExecutionResult

class ReportInput(BaseModel):
    project_name: str = Field(..., description="Project Name")
    discovery_data: DiscoveryResult
    solution_data: SolutionResult
    research_data: ResearchResult
    validation_data: ValidationResult
    execution_data: ExecutionResult

class LLMReportResult(BaseModel):
    executive_summary: str = Field(..., description="High-level executive summary of the project and execution plan")
    markdown_report: str = Field(..., description="Full, comprehensive compiled Markdown report")

class ReportResult(BaseModel):
    executive_summary: str = Field(..., description="High-level executive summary of the project and execution plan")
    markdown_report: str = Field(..., description="Full, comprehensive compiled Markdown report")
    json_report: FullReportData
