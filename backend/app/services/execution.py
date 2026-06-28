from app.services.gemini import GeminiService
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult
from app.models.validation import ValidationResult
from app.models.execution import ExecutionResult

class ExecutionService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def build_execution_plan(
        self,
        discovery: DiscoveryResult,
        solution: SolutionResult,
        research: ResearchResult,
        validation: ValidationResult
    ) -> ExecutionResult:
        """
        Builds a comprehensive 30-60-90 day execution plan, with a realistic budget and risk mitigation.
        """
        system_instruction = (
            "You are an Operations Director, Program Manager, and Startup Launch Specialist. "
            "Your task is to build a highly tactical, realistic, and actionable 30-60-90 day execution roadmap "
            "for the proposed project/venture. You should detail a budget breakdown (categorized with specific items "
            "and cost ranges matching research data), outline operational risks (with Plan-B contingency plans), "
            "and list clear KPIs and success metrics."
        )

        prompt = (
            f"Please generate the 30-60-90 Day Execution Plan based on the following context:\n\n"
            f"--- PROBLEM & SUCCESS CRITERIA ---\n"
            f"Refined Problem: {discovery.refined_problem}\n"
            f"Success Targets: {', '.join([c.metric + ': ' + c.target for c in discovery.success_criteria])}\n\n"
            f"--- SOLUTION & ROADMAP BASE ---\n"
            f"Potential Solutions: {', '.join([s.title for s in solution.potential_solutions])}\n"
            f"MVP: {', '.join([m.feature for m in solution.mvp_recommendations])}\n"
            f"Resources: People: {', '.join(solution.resource_requirements.people)}, Tools: {', '.join(solution.resource_requirements.tools)}\n\n"
            f"--- RESEARCH COST ESTIMATES ---\n"
            f"Research Cost Benchmarks: {', '.join([c.item + ' ($' + str(c.low_range) + ' - $' + str(c.high_range) + ')' for c in research.cost_estimates])}\n\n"
            f"--- VALIDATION RECOMMENDATIONS ---\n"
            f"Framework Recommendations: {', '.join([rec for meta in [validation.framework_meta.lean_canvas, validation.framework_meta.swot, validation.framework_meta.porters_five_forces, validation.framework_meta.jtbd, validation.framework_meta.value_proposition_canvas] for rec in meta.recommendations])}\n\n"
            f"Provide an actionable phase-by-phase breakdown for Days 1-30, Days 31-60, and Days 61-90, "
            f"a detailed budget (matching the cost estimates/ranges in USD), risks/mitigations, KPIs, and metrics."
        )

        result = self.gemini_service.generate_structured(
            prompt=prompt,
            response_schema=ExecutionResult,
            system_instruction=system_instruction,
            enable_search=False
        )

        return result
