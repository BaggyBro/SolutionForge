"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { apiPost, DiscoveryResult } from "../../lib/api";

const FIELDS = [
  {
    id: "name", label: "Project / Solution Name", required: true, type: "input",
    placeholder: "e.g. Smart Crop Drone Scanner",
    hint: "A short identifier for this workspace",
  },
  {
    id: "domain", label: "Domain / Industry", required: true, type: "input",
    placeholder: "e.g. Agriculture Technology, SaaS, Logistics",
    hint: "Primary market or vertical",
  },
  {
    id: "target_users", label: "Target Users / Customer Audience", required: false, type: "input",
    placeholder: "e.g. Organic family farms, industrial farm supervisors",
    hint: "Who are you solving this for?",
  },
  {
    id: "problem_statement", label: "Core Problem Statement", required: true, type: "textarea", rows: 5,
    placeholder: "What is the pain point? Who suffers from it? Why do existing workarounds fail?\n\nBe specific — the AI model uses this as the primary seed for all downstream analysis.",
    hint: "The more context, the higher-quality the output",
  },
  {
    id: "constraints", label: "Constraints or Limitations", required: false, type: "textarea", rows: 3,
    placeholder: "e.g. Budget caps, regulations, hardware limitations, legal constraints...",
    hint: "Optional — leave blank if none",
  },
  {
    id: "goals", label: "Core Project Goals", required: false, type: "textarea", rows: 3,
    placeholder: "e.g. Reduce crop waste by 15%, reach break-even in 12 months, launch in 3 months...",
    hint: "Optional — defaults to 'establish a validated launch-ready roadmap'",
  },
];

const LOADING_STEPS = [
  "Connecting to SolutionForge AI layer...",
  "Parsing problem scope and domain context...",
  "Extracting root causes and stakeholder map...",
  "Refining assumptions and success criteria...",
  "Initializing workspace environment...",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "", domain: "", target_users: "",
    problem_statement: "", constraints: "", goals: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain || !formData.problem_statement) {
      setError("Project name, domain, and problem statement are required.");
      return;
    }

    setLoading(true);
    setError("");

    // Cycle through loading messages
    let msgIdx = 0;
    setLoadingMsg(LOADING_STEPS[0]);
    const cycler = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, LOADING_STEPS.length - 1);
      setLoadingMsg(LOADING_STEPS[msgIdx]);
      setLoadingIdx(msgIdx);
    }, 1800);

    try {
      const discoveryResult = await apiPost<DiscoveryResult>("/api/discovery", {
        problem_statement: formData.problem_statement,
        domain: formData.domain,
        target_users: formData.target_users || "General Public / Target Demographics",
        constraints: formData.constraints || "No strict technological constraints",
        goals: formData.goals || "Establish a validated, launch-ready roadmap",
      });

      const projectId = "proj_" + Math.random().toString(36).substr(2, 9);
      const newProjectMeta = {
        id: projectId, name: formData.name, domain: formData.domain,
        createdAt: new Date().toISOString(), currentStep: 1,
      };

      const savedProjects = localStorage.getItem("ai_validator_projects");
      const projectsList = savedProjects ? JSON.parse(savedProjects) : [];
      projectsList.push(newProjectMeta);
      localStorage.setItem("ai_validator_projects", JSON.stringify(projectsList));

      const projectDetails = {
        meta: newProjectMeta, input: formData,
        discovery: discoveryResult, solution: null,
        research: null, validation: null, execution: null, report: null,
      };
      localStorage.setItem(`project_data_${projectId}`, JSON.stringify(projectDetails));

      router.push(`/workspace?id=${projectId}`);
    } catch (err: any) {
      clearInterval(cycler);
      setError(err.message || "Failed to analyze problem statement. Ensure the API server is running and the Gemini API key is configured.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="site-header">
        <div className="container-md" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <Link href="/" className="btn-ghost" style={{ padding: "6px 12px" }} id="back-to-dashboard-btn">
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="logo-mark" style={{ width: "24px", height: "24px", fontSize: "9px" }}>SF</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.08em" }}>
              WORKSPACE BUILDER
            </span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: loading ? "center" : "flex-start" }}>
        <div className="container-md" style={{ width: "100%", padding: "clamp(32px, 6vw, 64px) clamp(1rem, 4vw, 2.5rem)" }}>

          {loading ? (
            /* ── Loading State ── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "28px",
                textAlign: "center",
                padding: "48px 24px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                maxWidth: "480px",
                margin: "0 auto",
              }}
              className="animate-fade-in"
            >
              <div style={{ position: "relative" }}>
                <div className="loading-spinner" />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--acid)",
                  }}
                >
                  AI
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "var(--text)",
                    marginBottom: "8px",
                    letterSpacing: "0.02em",
                  }}
                >
                  Analyzing Problem Scope
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.02em" }}>
                  {loadingMsg}
                  <span className="animate-blink" style={{ color: "var(--acid)", marginLeft: "2px" }}>▌</span>
                </div>
              </div>

              {/* Step indicators */}
              <div style={{ display: "flex", gap: "6px" }}>
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "24px", height: "2px",
                      background: i <= loadingIdx ? "var(--acid)" : "var(--border-2)",
                      transition: "background 0.4s",
                    }}
                  />
                ))}
              </div>

              <div style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                THIS MAY TAKE 15–30 SECONDS
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <div>
              <div className="animate-fade-up delay-0" style={{ marginBottom: "32px" }}>
                <div className="section-label" style={{ marginBottom: "10px" }}>INITIALIZE WORKSPACE</div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: "12px",
                  }}
                >
                  Describe your problem.
                </h1>
                <p style={{ fontSize: "12px", color: "var(--text-3)", maxWidth: "460px", lineHeight: 1.7 }}>
                  The AI consultant layer structures and validates your idea step-by-step.
                  Provide the raw dimensions of your challenge below.
                </p>
              </div>

              {error && (
                <div className="error-banner animate-fade-up delay-0" style={{ marginBottom: "24px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Name + Domain in a row */}
                <div className="animate-fade-up delay-75" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {FIELDS.slice(0, 2).map((field) => (
                    <div key={field.id}>
                      <label className="field-label" htmlFor={field.id}>
                        {field.label} {field.required && <span>*</span>}
                      </label>
                      <input
                        type="text"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="field-input"
                        required={field.required}
                      />
                      <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                        {field.hint}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Target Users */}
                <div className="animate-fade-up delay-150">
                  <label className="field-label" htmlFor="target_users">
                    {FIELDS[2].label}
                  </label>
                  <input
                    type="text"
                    id="target_users"
                    name="target_users"
                    value={formData.target_users}
                    onChange={handleChange}
                    placeholder={FIELDS[2].placeholder}
                    className="field-input"
                  />
                  <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "5px" }}>{FIELDS[2].hint}</div>
                </div>

                {/* Problem Statement */}
                <div className="animate-fade-up delay-225">
                  <label className="field-label" htmlFor="problem_statement">
                    {FIELDS[3].label} <span>*</span>
                  </label>
                  <textarea
                    id="problem_statement"
                    name="problem_statement"
                    value={formData.problem_statement}
                    onChange={handleChange}
                    rows={5}
                    placeholder={FIELDS[3].placeholder}
                    className="field-input"
                    required
                  />
                  <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "5px" }}>{FIELDS[3].hint}</div>
                </div>

                {/* Constraints + Goals */}
                <div className="animate-fade-up delay-300" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {FIELDS.slice(4).map((field) => (
                    <div key={field.id}>
                      <label className="field-label" htmlFor={field.id}>
                        {field.label}
                      </label>
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        rows={field.rows}
                        placeholder={field.placeholder}
                        className="field-input"
                      />
                      <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "5px" }}>{field.hint}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="animate-fade-up delay-375" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                  <Link href="/" className="btn-ghost" id="cancel-new-project-btn">
                    Cancel
                  </Link>
                  <button type="submit" className="btn-primary" id="submit-new-project-btn">
                    Initiate Project
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
