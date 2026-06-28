from app.services.gemini import GeminiService
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult
from app.models.validation import ValidationResult

class ValidationService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def validate_solution(
        self,
        discovery: DiscoveryResult,
        solution: SolutionResult,
        research: ResearchResult
    ) -> ValidationResult:
        """
        Validates the proposed solution using five core business frameworks.
        Provides a structured evaluation based on frameworks, not personal opinion.
        """
        system_instruction = (
            "You are an Elite Business Strategist and Management Consultant. "
            "Your role is to critically validate the proposed solution against the identified problem "
            "and market research using established business frameworks: "
            "1. Lean Canvas\n"
            "2. SWOT Analysis\n"
            "3. Porter's Five Forces\n"
            "4. Jobs To Be Done (JTBD)\n"
            "5. Value Proposition Canvas (VPC)\n\n"
            "CRITICAL: Do NOT validate based on your own opinion. Use concrete framework criteria. "
            "For EACH framework, you must evaluate and populate the 'framework_meta' field with: "
            "- 'reasoning': Why this framework is suitable and what it reveals about this venture/solution.\n"
            "- 'gaps': Concrete gaps or vulnerabilities identified by applying this framework.\n"
            "- 'assumptions': Crucial unverified assumptions that need validation.\n"
            "- 'recommendations': Specific, actionable steps to address gaps and test assumptions.\n"
            "Ensure the customer profile in VPC matches the JTBD tasks, pains, and gains, and that "
            "the Value Map shows how the solutions alleviate those pains and create those gains."
        )

        prompt = (
            f"Please run framework validation based on the following:\n\n"
            f"--- PROBLEM DISCOVERY DATA ---\n"
            f"Refined Problem: {discovery.refined_problem}\n"
            f"Success Criteria: {', '.join([c.metric + ' (Target: ' + c.target + ')' for c in discovery.success_criteria])}\n\n"
            f"--- PROPOSED SOLUTION DATA ---\n"
            f"Solutions: {', '.join([s.title for s in solution.potential_solutions])}\n"
            f"MVP: {', '.join([m.feature for m in solution.mvp_recommendations])}\n\n"
            f"--- MARKET RESEARCH DATA ---\n"
            f"Competitors: {', '.join([c.name for c in research.competitor_analysis])}\n"
            f"Market Observations: {', '.join([o.observation for o in research.market_observations])}\n"
            f"Risks: {', '.join([r.risk for r in research.risks])}\n\n"
            f"Perform the analysis and fill the Lean Canvas, SWOT, Porter's Five Forces, JTBD, VPC, "
            f"and framework_meta models. Be highly analytical, rigorous, and objective."
        )

        result = self.gemini_service.generate_structured(
            prompt=prompt,
            response_schema=ValidationResult,
            system_instruction=system_instruction,
            enable_search=False
        )

        return result
