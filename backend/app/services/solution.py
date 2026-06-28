from app.services.gemini import GeminiService
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult

class SolutionService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def build_solution(self, discovery: DiscoveryResult) -> SolutionResult:
        """
        Generates potential solution concepts, feature ideas, resource needs, and MVP scope.
        """
        system_instruction = (
            "You are a Product Manager, Business Consultant, and Domain Expert. "
            "Your role is to formulate viable solutions, features, and roadmaps based on the refined problem "
            "discovery. Think critically about what constitutes a viable MVP and prioritize features "
            "for high customer value and manageable complexity."
        )

        prompt = (
            f"Formulate solution designs based on the following Problem Discovery details:\n\n"
            f"Refined Problem: {discovery.refined_problem}\n"
            f"Success Metrics: {', '.join([c.metric + ' (Target: ' + c.target + ')' for c in discovery.success_criteria])}\n"
            f"Assumptions: {', '.join([a.assumption for a in discovery.key_assumptions])}\n"
            f"Root Causes: {', '.join([r.cause for r in discovery.root_causes])}\n\n"
            f"Generate a structured JSON response matching the SolutionResult schema, containing potential solutions, "
            f"alternative approaches, specific feature lists, resource requirements, MVP recommendations, and roadmap milestones."
        )

        result = self.gemini_service.generate_structured(
            prompt=prompt,
            response_schema=SolutionResult,
            system_instruction=system_instruction,
            enable_search=False
        )

        return result
