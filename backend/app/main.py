from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io

from app.config import CORS_ORIGINS
from app.models.discovery import DiscoveryInput, DiscoveryResult
from app.models.solution import SolutionInput, SolutionResult
from app.models.research import ResearchInput, ResearchResult
from app.models.validation import ValidationInput, ValidationResult
from app.models.execution import ExecutionInput, ExecutionResult
from app.models.report import ReportInput, ReportResult, FullReportData

from app.services.gemini import GeminiService
from app.services.discovery import DiscoveryService
from app.services.solution import SolutionService
from app.services.research import ResearchService
from app.services.validation import ValidationService
from app.services.execution import ExecutionService
from app.services.report import ReportService

app = FastAPI(
    title="AI Solution Builder & Framework-Based Validator API",
    description="Backend API for building and validating multi-step execution plans.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate services
gemini_service = GeminiService()
discovery_service = DiscoveryService(gemini_service)
solution_service = SolutionService(gemini_service)
research_service = ResearchService(gemini_service)
validation_service = ValidationService(gemini_service)
execution_service = ExecutionService(gemini_service)
report_service = ReportService(gemini_service)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AI Solution Builder API"}

@app.post("/api/discovery", response_model=DiscoveryResult)
def step1_discovery(input_data: DiscoveryInput):
    try:
        return discovery_service.discover_problem(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Discovery failed: {str(e)}")

@app.post("/api/solution", response_model=SolutionResult)
def step2_solution(input_data: SolutionInput):
    try:
        return solution_service.build_solution(input_data.discovery_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Solution generation failed: {str(e)}")

@app.post("/api/research", response_model=ResearchResult)
def step3_research(input_data: ResearchInput):
    try:
        return research_service.perform_research(
            input_data.discovery_data,
            input_data.solution_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

@app.post("/api/validate", response_model=ValidationResult)
def step4_validation(input_data: ValidationInput):
    try:
        return validation_service.validate_solution(
            input_data.discovery_data,
            input_data.solution_data,
            input_data.research_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@app.post("/api/execution", response_model=ExecutionResult)
def step5_execution(input_data: ExecutionInput):
    try:
        return execution_service.build_execution_plan(
            input_data.discovery_data,
            input_data.solution_data,
            input_data.research_data,
            input_data.validation_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution planning failed: {str(e)}")

@app.post("/api/report", response_model=ReportResult)
def step6_report(input_data: ReportInput):
    try:
        return report_service.generate_report(
            input_data.project_name,
            input_data.discovery_data,
            input_data.solution_data,
            input_data.research_data,
            input_data.validation_data,
            input_data.execution_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

@app.post("/api/export/pdf")
def export_pdf(report_data: FullReportData):
    try:
        pdf_bytes = report_service.compile_pdf(report_data)
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{report_data.project_name.replace(' ', '_')}_report.pdf\""
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")
