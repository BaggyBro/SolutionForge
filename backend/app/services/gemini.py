import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Type, TypeVar
from app.config import GEMINI_API_KEY

T = TypeVar("T", bound=BaseModel)

class GeminiService:
    def __init__(self):
        # The google-genai Client will automatically pick up GEMINI_API_KEY from environment
        # or we can pass it explicitly. We pass it explicitly to be sure.
        if GEMINI_API_KEY:
            self.client = genai.Client(api_key=GEMINI_API_KEY)
        else:
            self.client = None
        self.model_name = "gemini-2.5-flash"

    def generate_structured(
        self,
        prompt: str,
        response_schema: Type[T],
        system_instruction: str = None,
        enable_search: bool = False
    ) -> T:
        """
        Generates content from Gemini 2.5 Flash and validates/coerces it to match the given Pydantic schema.
        """
        if not self.client:
            raise ValueError("Gemini API key (GEMINI_API_KEY) is not set. Please set the key in your .env file.")

        # Configure search grounding if requested
        tools = []
        if enable_search:
            # Under new google-genai SDK, google search grounding is added as a tool
            tools.append(types.Tool(google_search=types.GoogleSearch()))

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=response_schema,
            system_instruction=system_instruction,
            temperature=0.2,
            tools=tools if tools else None,
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config
        )

        # The SDK returns the parsed JSON automatically or we can load it from text
        # If response.text is returned, we can load it and parse with Pydantic
        content_text = response.text
        if not content_text:
            raise ValueError("Gemini returned empty response")

        try:
            return response_schema.model_validate_json(content_text)
        except Exception as e:
            print(f"Error parsing Gemini response as schema: {e}")
            print(f"Raw response text: {content_text}")
            # Try to clean/recover or re-raise
            raise e

    def generate_text(
        self,
        prompt: str,
        system_instruction: str = None,
        enable_search: bool = False
    ) -> str:
        """
        Generates unstructured text content from Gemini. Useful when tools (like Search Grounding)
        are needed, since structured schemas cannot be combined with tools directly.
        """
        if not self.client:
            raise ValueError("Gemini API key (GEMINI_API_KEY) is not set. Please set the key in your .env file.")

        tools = []
        if enable_search:
            tools.append(types.Tool(google_search=types.GoogleSearch()))

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2,
            tools=tools if tools else None,
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config
        )
        return response.text or ""

