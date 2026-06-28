"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Layers,
  TrendingUp,
  Search,
  ShieldCheck,
  Calendar,
  FileText,
} from "lucide-react";
import { apiPost, exportPdf } from "@/lib/api";

import DiscoveryTab from "./tabs/Discovery";
import SolutionTab from "./tabs/Solution";
import ResearchTab from "./tabs/Research";
import ValidationTab from "./tabs/Validation";
import ExecutionTab from "./tabs/Execution";
import ReportTab from "./tabs/Report";

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!projectId) {
      router.push("/");
      return;
    }
    const saved = localStorage.getItem(`project_data_${projectId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProject(parsed);
        setActiveStep(parsed.meta.currentStep);
      } catch (e) {
        console.error("Failed to load project details", e);
        setError("Corrupt project file. Please return to dashboard.");
      }
    } else {
      router.push("/");
    }
  }, [projectId, router]);

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const updateProjectState = (updatedFields: Partial<typeof project>) => {
    const nextState = { ...project, ...updatedFields };
    const indexSaved = localStorage.getItem("ai_validator_projects");
    if (indexSaved) {
      try {
        const indexList = JSON.parse(indexSaved);
        const updatedIndex = indexList.map((p: any) =>
          p.id === projectId ? { ...p, currentStep: nextState.meta.currentStep } : p
        );
        localStorage.setItem("ai_validator_projects", JSON.stringify(updatedIndex));
      } catch (e) {
        console.error("Failed to update projects index", e);
      }
    }
    setProject(nextState);
    localStorage.setItem(`project_data_${projectId}`, JSON.stringify(nextState));
  };

  const handleGenerateStep = async (step: number) => {
    setLoading(true);
    setError("");
    try {
      if (step === 2) {
        setLoadingStatus("Formulating potential solutions, alternative approaches, and MVP specs...");
        const res = await apiPost<any>("/api/solution", { discovery_data: project.discovery });
        project.meta.currentStep = 2;
        updateProjectState({ solution: res });
        setActiveStep(2);
      } else if (step === 3) {
        setLoadingStatus("Running competitor web search and extracting pricing structures...");
        const res = await apiPost<any>("/api/research", {
          discovery_data: project.discovery,
          solution_data: project.solution,
        });
        project.meta.currentStep = 3;
        updateProjectState({ research: res });
        setActiveStep(3);
      } else if (step === 4) {
        setLoadingStatus("Evaluating models against Lean Canvas, SWOT, Porter's, JTBD, and VPC...");
        const res = await apiPost<any>("/api/validate", {
          discovery_data: project.discovery,
          solution_data: project.solution,
          research_data: project.research,
        });
        project.meta.currentStep = 4;
        updateProjectState({ validation: res });
        setActiveStep(4);
      } else if (step === 5) {
        setLoadingStatus("Drafting operational roadmap (30-60-90 days) and cost breakdowns...");
        const res = await apiPost<any>("/api/execution", {
          discovery_data: project.discovery,
          solution_data: project.solution,
          research_data: project.research,
          validation_data: project.validation,
        });
        project.meta.currentStep = 5;
        updateProjectState({ execution: res });
        setActiveStep(5);
      } else if (step === 6) {
        setLoadingStatus("Assembling Executive Summary and synthesizing Markdown brief...");
        const res = await apiPost<any>("/api/report", {
          project_name: project.meta.name,
          discovery_data: project.discovery,
          solution_data: project.solution,
          research_data: project.research,
          validation_data: project.validation,
          execution_data: project.execution,
        });
        project.meta.currentStep = 6;
        updateProjectState({ report: res });
        setActiveStep(6);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Operation failed. Ensure your Gemini connection is active.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!project.report?.json_report) return;
    try {
      setLoading(true);
      setLoadingStatus("Compiling ReportLab PDF document in backend...");
      const blob = await exportPdf(project.report.json_report);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.meta.name.replace(/\s+/g, "_")}_Validation_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to download PDF report.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!project.report?.markdown_report) return;
    const blob = new Blob([project.report.markdown_report], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.meta.name.replace(/\s+/g, "_")}_Validation_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!project.report?.json_report) return;
    const blob = new Blob([JSON.stringify(project.report.json_report, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.meta.name.replace(/\s+/g, "_")}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const steps = [
    { num: 1, name: "Problem Discovery", icon: Layers },
    { num: 2, name: "Solution Builder", icon: TrendingUp },
    { num: 3, name: "Research Engine", icon: Search },
    { num: 4, name: "Framework Validation", icon: ShieldCheck },
    { num: 5, name: "Execution Planner", icon: Calendar },
    { num: 6, name: "Final Report", icon: FileText },
  ];

  const getStepStatus = (stepNum: number) => {
    if (stepNum === 1) return "completed";
    if (stepNum <= project.meta.currentStep) return "completed";
    if (stepNum === project.meta.currentStep + 1) return "active";
    return "locked";
  };

  return (
    <div className="workspace-shell">
      {/* Header */}
      <header className="site-header">
        <div className="container-xl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" className="btn-ghost" style={{ padding: "6px 12px" }} id="workspace-back-btn">
              <ArrowLeft size={13} />
              Dashboard
            </Link>
            <div>
              <span className="logo-text" style={{ fontSize: "13px" }}>{project.meta.name}</span>
              <span className="tag" style={{ marginLeft: "8px", verticalAlign: "middle" }}>{project.meta.domain}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>STATUS:</span>
            <span className="tag-acid">STEP {project.meta.currentStep} OF 6 READY</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="workspace-body">
        {/* Navigation Sidebar */}
        <aside className="workspace-sidebar">
          {steps.map((s) => {
            const status = getStepStatus(s.num);
            const isActive = activeStep === s.num;
            const Icon = s.icon;
            return (
              <button
                key={s.num}
                onClick={() => status !== "locked" && setActiveStep(s.num)}
                disabled={status === "locked"}
                className={`step-nav-item ${isActive ? "active" : ""} ${status === "completed" ? "completed" : ""} ${status === "locked" ? "locked" : ""}`}
                id={`step-nav-${s.num}`}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span className="truncate" style={{ flex: 1 }}>{s.name}</span>
                {status === "completed" && !isActive && <span style={{ color: "var(--ok)", fontSize: "10px" }}>✓</span>}
              </button>
            );
          })}
        </aside>

        {/* Content Display Area */}
        <main className="workspace-main">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
                  SolutionForge Model Execution
                </p>
                <p className="animate-blink" style={{ fontSize: "11px", color: "var(--text-3)" }}>
                  {loadingStatus}
                </p>
              </div>
            </div>
          )}

          {error && <div className="error-banner" style={{ marginBottom: "20px" }}>{error}</div>}

          {/* Active step display */}
          <div className="animate-fade-in">
            {activeStep === 1 && <DiscoveryTab project={project} />}
            {activeStep === 2 && <SolutionTab project={project} onGenerate={() => handleGenerateStep(2)} />}
            {activeStep === 3 && <ResearchTab project={project} onGenerate={() => handleGenerateStep(3)} />}
            {activeStep === 4 && <ValidationTab project={project} onGenerate={() => handleGenerateStep(4)} />}
            {activeStep === 5 && <ExecutionTab project={project} onGenerate={() => handleGenerateStep(5)} />}
            {activeStep === 6 && (
              <ReportTab
                project={project}
                onGenerate={() => handleGenerateStep(6)}
                onExportPDF={handleExportPDF}
                onExportMarkdown={handleExportMarkdown}
                onExportJSON={handleExportJSON}
              />
            )}
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "20px", marginTop: "40px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
              {activeStep === 1 && "Discovery stage is prepared."}
              {activeStep > 1 && !project[activeStep === 2 ? 'solution' : activeStep === 3 ? 'research' : activeStep === 4 ? 'validation' : activeStep === 5 ? 'execution' : 'report'] && "Pending generation. Use the action button above."}
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              {activeStep > 1 && (
                <button className="btn-ghost" onClick={() => setActiveStep(activeStep - 1)} id="workspace-prev-btn">
                  Previous Step
                </button>
              )}
              {activeStep < 6 && getStepStatus(activeStep + 1) !== "locked" && (
                <button className="btn-primary" onClick={() => setActiveStep(activeStep + 1)} id="workspace-next-btn">
                  Next Step
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="loading-spinner" /></div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
