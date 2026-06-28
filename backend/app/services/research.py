from app.services.gemini import GeminiService
from app.models.discovery import DiscoveryResult
from app.models.solution import SolutionResult
from app.models.research import ResearchResult

class ResearchService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def perform_research(
        self,
        discovery: DiscoveryResult,
        solution: SolutionResult
    ) -> ResearchResult:
        """
        Runs research queries using Gemini Search Grounding.
        Synthesizes real-world competitors, pricing, alternatives, and vendors.
        """
        # Pass 1: Run grounded search to gather market context and synthesize into rich text
        search_instruction = (
            "You are a professional Market Researcher, Industry Analyst, and Sourcing Consultant. "
            "Your task is to conduct real-world research on the provided problem and proposed solution. "
            "You MUST use Google Search grounding to find active competitors, real vendor solutions, "
            "pricing benchmarks, and services. Do NOT just invent companies or pricing. Find real details. "
            "Provide cost ranges in USD where possible for cost estimates."
        )

        search_prompt = (
            f"Please conduct market research based on the following:\n\n"
            f"--- PROBLEM DISCOVERY DATA ---\n"
            f"Refined Problem: {discovery.refined_problem}\n"
            f"Target Users: {', '.join([s.name for s in discovery.stakeholder_map])}\n\n"
            f"--- PROPOSED SOLUTION DATA ---\n"
            f"Potential Solutions: {', '.join([s.title + ': ' + s.description for s in solution.potential_solutions])}\n"
            f"Suggested Features: {', '.join([f.feature for f in solution.feature_suggestions])}\n"
            f"Roadmap Phases: {', '.join([r.phase for r in solution.implementation_roadmap])}\n\n"
            f"Find and synthesize:\n"
            f"1. Top direct competitors (with market presence, strengths, weaknesses).\n"
            f"2. Non-competitor alternatives currently in use.\n"
            f"3. Common pricing tiers and structures in this market.\n"
            f"4. Recommended tools, software vendors, and estimated start costs.\n"
            f"5. Professional service agencies or developer rates.\n"
            f"6. General cost estimates and market observations."
        )

        research_synthesis = self.gemini_service.generate_text(
            prompt=search_prompt,
            system_instruction=search_instruction,
            enable_search=True
        )

        # Pass 2: Coerce the grounded text synthesis into a structured ResearchResult schema
        structuring_instruction = (
            "You are a Data Structuring expert. Your job is to read the raw research synthesis "
            "and format it into a structured JSON response matching the schema exactly. "
            "Coerce prices into ranges of numbers where needed (cost_estimates should contain numeric ranges). "
            "Do not invent any information outside the provided research synthesis."
        )

        structuring_prompt = (
            f"Format the following market research synthesis into the requested JSON schema:\n\n"
            f"--- RESEARCH SYNTHESIS ---\n"
            f"{research_synthesis}"
        )

        result = self.gemini_service.generate_structured(
            prompt=structuring_prompt,
            response_schema=ResearchResult,
            system_instruction=structuring_instruction,
            enable_search=False
        )


        return result
