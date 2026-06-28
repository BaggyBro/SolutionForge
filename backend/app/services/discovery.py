from app.services.gemini import GeminiService
from app.models.discovery import DiscoveryInput, DiscoveryResult

class DiscoveryService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def discover_problem(self, input_data: DiscoveryInput) -> DiscoveryResult:
        """
        Refines the initial problem statement, creates a stakeholder map, lists assumptions,
        pinpoints root causes, and proposes success criteria.
        """
        system_instruction = (
            "You are an Elite Strategy Consultant, Product Researcher, and Systems Thinker. "
            "Your role is to deeply analyze the user's raw problem description, refine it into a clear, "
            "nuanced problem statement, map key stakeholders, identify core unverified assumptions, "
            "determine root causes, and formulate concrete success criteria."
        )

        prompt = (
            f"Analyze the following problem parameters:\n\n"
            f"Problem Statement: {input_data.problem_statement}\n"
            f"Domain/Industry: {input_data.domain}\n"
            f"Target Users: {input_data.target_users}\n"
            f"Constraints: {input_data.constraints}\n"
            f"Goals: {input_data.goals}\n\n"
            f"Generate a structured JSON response matching the DiscoveryResult schema. "
            f"Ensure the stakeholders, root causes, assumptions, and success metrics are highly detailed, "
            f"relevant, and actionable."
        )

        result = self.gemini_service.generate_structured(
            prompt=prompt,
            response_schema=DiscoveryResult,
            system_instruction=system_instruction,
            enable_search=False
        )

        return result
