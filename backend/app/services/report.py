import io
from typing import Optional
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.services.gemini import GeminiService
from app.models.report import FullReportData, ReportResult, LLMReportResult

class ReportService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    def generate_report(
        self,
        project_name: str,
        discovery,
        solution,
        research,
        validation,
        execution
    ) -> ReportResult:
        """
        Generates the executive summary, Markdown report, and assembles the JSON data structure.
        """
        system_instruction = (
            "You are a Chief Strategy Officer and Technical Writer. "
            "Your task is to write a comprehensive, cohesive, and deeply detailed "
            "executive summary and a complete Markdown report that compiles all previous phases "
            "into a single, premium-quality executive brief. The Markdown report should include "
            "formatted tables, section headers (H1, H2, H3), and clear bullet points."
        )

        prompt = (
            f"Please compile a professional report for the project: '{project_name}' using the following outputs:\n\n"
            f"--- DISCOVERY ---\nRefined Problem: {discovery.refined_problem}\n"
            f"--- SOLUTIONS ---\nSolutions: {', '.join([s.title + ': ' + s.description for s in solution.potential_solutions])}\n"
            f"--- RESEARCH ---\nCompetitors: {', '.join([c.name for c in research.competitor_analysis])}\n"
            f"--- VALIDATION ---\nFrameworks evaluated: Lean Canvas, SWOT, Porter's Five Forces, JTBD, VPC\n"
            f"--- EXECUTION ---\nTimeline: 30-Day, 60-Day, 90-Day goals and tasks.\n\n"
            f"Please generate the executive_summary (2-3 paragraphs) and the full markdown_report. "
            f"Return it as a structured JSON response matching the schema."
        )

        # We first build the FullReportData model to pass back inside ReportResult
        full_data = FullReportData(
            project_name=project_name,
            discovery=discovery,
            solution=solution,
            research=research,
            validation=validation,
            execution=execution
        )

        # Call Gemini to get the executive summary and markdown report content
        llm_result = self.gemini_service.generate_structured(
            prompt=prompt,
            response_schema=LLMReportResult,
            system_instruction=system_instruction,
            enable_search=False
        )

        # Assemble the final result with the static JSON data
        return ReportResult(
            executive_summary=llm_result.executive_summary,
            markdown_report=llm_result.markdown_report,
            json_report=full_data
        )

    def compile_pdf(self, report_data: FullReportData) -> bytes:
        """
        Uses ReportLab to build a professional, styled PDF of the report data.
        Returns the PDF as raw bytes.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=54,
            leftMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()
        
        # Define clean, professional styling palette
        primary_color = colors.HexColor("#1A365D")  # Deep Navy
        secondary_color = colors.HexColor("#2B6CB0") # Slate Blue
        text_color = colors.HexColor("#2D3748")      # Dark Grey
        light_bg = colors.HexColor("#F7FAFC")        # Off-white

        # Create custom Paragraph styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=26,
            leading=30,
            textColor=primary_color,
            spaceAfter=20
        )
        h1_style = ParagraphStyle(
            'SectionH1',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            textColor=primary_color,
            spaceBefore=18,
            spaceAfter=10,
            keepWithNext=True
        )
        h2_style = ParagraphStyle(
            'SectionH2',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=secondary_color,
            spaceBefore=12,
            spaceAfter=6,
            keepWithNext=True
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=text_color,
            spaceAfter=8
        )
        bullet_style = ParagraphStyle(
            'BulletCustom',
            parent=body_style,
            leftIndent=15,
            firstLineIndent=-10,
            spaceAfter=4
        )

        story = []

        # --- COVER / TITLE PAGE ---
        story.append(Spacer(1, 40))
        story.append(Paragraph("AI Solution Validation Report", title_style))
        story.append(Paragraph(f"Project Name: {report_data.project_name}", h2_style))
        story.append(Spacer(1, 20))
        
        # Add a nice accent bar
        line_table = Table([[""]], colWidths=[500], rowHeights=[3])
        line_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), primary_color),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(line_table)
        story.append(Spacer(1, 30))

        # --- SECTION 1: PROBLEM DISCOVERY ---
        story.append(Paragraph("1. Problem Discovery", h1_style))
        story.append(Paragraph(f"<b>Refined Problem Statement:</b> {report_data.discovery.refined_problem}", body_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph("Stakeholder Map", h2_style))
        sh_data = [["Stakeholder / Role", "Impact", "Core Needs"]]
        for sh in report_data.discovery.stakeholder_map:
            sh_data.append([
                Paragraph(f"<b>{sh.name}</b><br/>{sh.role}", body_style),
                Paragraph(sh.impact, body_style),
                Paragraph(sh.needs, body_style)
            ])
        sh_table = Table(sh_data, colWidths=[150, 70, 280])
        sh_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
        ]))
        # Need to fix textcolor of header
        for i in range(len(sh_data[0])):
            sh_data[0][i] = Paragraph(f"<font color='white'><b>{sh_data[0][i]}</b></font>", body_style)
        story.append(sh_table)
        story.append(Spacer(1, 15))

        # --- SECTION 2: SOLUTION BUILDER ---
        story.append(Paragraph("2. Proposed Solutions", h1_style))
        for sol in report_data.solution.potential_solutions:
            story.append(Paragraph(f"<b>Solution: {sol.title}</b>", h2_style))
            story.append(Paragraph(sol.description, body_style))
            story.append(Paragraph(f"<i>Pros:</i> {', '.join(sol.pros)}", body_style))
            story.append(Paragraph(f"<i>Cons:</i> {', '.join(sol.cons)}", body_style))
            story.append(Spacer(1, 5))
        story.append(Spacer(1, 15))

        # --- SECTION 3: MARKET RESEARCH ---
        story.append(PageBreak())
        story.append(Paragraph("3. Market & Competitor Research", h1_style))
        story.append(Paragraph("Key Competitors:", h2_style))
        for comp in report_data.research.competitor_analysis:
            story.append(Paragraph(f"• <b>{comp.name}</b> (Market Share: {comp.market_share})", bullet_style))
            story.append(Paragraph(f"  <i>Strengths:</i> {', '.join(comp.strengths)}", bullet_style))
            story.append(Paragraph(f"  <i>Weaknesses:</i> {', '.join(comp.weaknesses)}", bullet_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph("Pricing Benchmarks & Vendors", h2_style))
        vendor_data = [["Vendor / Tool", "Service Details", "Cost Estimate"]]
        for v in report_data.research.vendor_recommendations:
            vendor_data.append([
                Paragraph(f"<b>{v.name}</b>", body_style),
                Paragraph(v.service, body_style),
                Paragraph(v.estimate, body_style)
            ])
        # Clean header textcolor
        for i in range(len(vendor_data[0])):
            vendor_data[0][i] = Paragraph(f"<font color='white'><b>{vendor_data[0][i]}</b></font>", body_style)
        
        vendor_table = Table(vendor_data, colWidths=[150, 200, 150])
        vendor_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), secondary_color),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(vendor_table)
        story.append(Spacer(1, 15))

        # --- SECTION 4: FRAMEWORK VALIDATION ---
        story.append(Paragraph("4. Framework Validation", h1_style))
        
        frameworks = [
            ("lean_canvas", report_data.validation.framework_meta.lean_canvas),
            ("swot", report_data.validation.framework_meta.swot),
            ("porters_five_forces", report_data.validation.framework_meta.porters_five_forces),
            ("jtbd", report_data.validation.framework_meta.jtbd),
            ("value_proposition_canvas", report_data.validation.framework_meta.value_proposition_canvas)
        ]
        
        for name, meta in frameworks:
            formatted_name = name.replace("_", " ").title()
            story.append(Paragraph(f"<b>Framework: {formatted_name}</b>", h2_style))
            story.append(Paragraph(f"<b>Reasoning:</b> {meta.reasoning}", body_style))
            story.append(Paragraph(f"<b>Gaps:</b> {', '.join(meta.gaps)}", body_style))
            story.append(Paragraph(f"<b>Assumptions:</b> {', '.join(meta.assumptions)}", body_style))
            story.append(Paragraph(f"<b>Recommendations:</b> {', '.join(meta.recommendations)}", body_style))
            story.append(Spacer(1, 8))
        story.append(Spacer(1, 15))

        # --- SECTION 5: EXECUTION PLAN ---
        story.append(PageBreak())
        story.append(Paragraph("5. 30-60-90 Day Execution Roadmap", h1_style))
        
        phases = [
            ("Days 1 - 30 Plan", report_data.execution.plan_30_day),
            ("Days 31 - 60 Plan", report_data.execution.plan_60_day),
            ("Days 61 - 90 Plan", report_data.execution.plan_90_day)
        ]
        for title, phase in phases:
            story.append(Paragraph(title, h2_style))
            story.append(Paragraph("<b>Goals:</b>", body_style))
            for g in phase.goals:
                story.append(Paragraph(f"• {g}", bullet_style))
            story.append(Paragraph("<b>Tasks:</b>", body_style))
            for t in phase.tasks:
                story.append(Paragraph(f"• {t}", bullet_style))
            story.append(Paragraph("<b>Milestones:</b>", body_style))
            for m in phase.milestones:
                story.append(Paragraph(f"• {m}", bullet_style))
            story.append(Spacer(1, 10))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
