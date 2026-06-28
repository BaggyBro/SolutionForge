"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  TrendingUp,
  Search,
  ShieldCheck,
  Calendar,
  FileText,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";

interface SavedProject {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  currentStep: number;
}

const STEPS = [
  { num: 1, title: "Problem Discovery",    desc: "Refines root causes & maps stakeholders",        icon: Layers,      accent: "#4DA6FF" },
  { num: 2, title: "Solution Builder",     desc: "Specs features, MVP & roadmap",                  icon: TrendingUp,  accent: "#CAFF00" },
  { num: 3, title: "Research Engine",      desc: "Live competitor & price grounding",               icon: Search,      accent: "#00D68F" },
  { num: 4, title: "Framework Validation", desc: "Lean Canvas, SWOT, Porter's, JTBD",              icon: ShieldCheck, accent: "#FF9900" },
  { num: 5, title: "Execution Planner",    desc: "30-60-90 day timeline & budget",                  icon: Calendar,    accent: "#C084FC" },
  { num: 6, title: "Final Report",         desc: "Markdown, PDF & JSON exports",                   icon: FileText,    accent: "#FF6B6B" },
];

export default function HomePage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_validator_projects");
      if (saved) setProjects(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load saved projects", e);
    }
  }, []);

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("ai_validator_projects", JSON.stringify(updated));
    localStorage.removeItem(`project_data_${id}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <header className="site-header">
        <div className="container-xl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="logo-mark">SF</div>
            <div>
              <div className="logo-text">SolutionForge</div>
              <div className="logo-sub">AI STRATEGY PLATFORM</div>
            </div>
          </div>
          <Link href="/new" className="btn-primary" id="header-new-project-btn">
            <Plus size={13} />
            New Project
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* ── Hero ── */}
        <section
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "clamp(48px, 8vw, 96px) 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Accent glow */}
          <div style={{
            position: "absolute",
            top: "-80px", right: "10%",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(202,255,0,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="container-xl">
            <div className="animate-fade-up delay-0">
              <div className="tag-acid" style={{ marginBottom: "20px" }}>AI CONSULTANT & STRATEGIST</div>
            </div>

            <h1 className="display-title animate-fade-up delay-75" style={{ maxWidth: "760px", marginBottom: "24px" }}>
              From raw problems<br />
              to <em>validated</em> execution.
            </h1>

            <p
              className="mono-body animate-fade-up delay-150"
              style={{ maxWidth: "520px", marginBottom: "36px", fontSize: "13px", lineHeight: 1.8 }}
            >
              SolutionForge analyzes problem statements, builds solution architectures,
              synthesizes market benchmarks, validates using established frameworks, and
              compiles ready-to-run 30-60-90 day schedules.
            </p>

            <div className="animate-fade-up delay-225" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/new" className="btn-primary" id="hero-launch-btn">
                Launch Builder
                <ArrowUpRight size={14} />
              </Link>
              <Link href="#workspaces" className="btn-ghost" id="hero-workspaces-btn">
                View Workspaces
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pipeline Steps ── */}
        <section style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="container-xl" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
            <div className="section-label animate-fade-up delay-0" style={{ marginBottom: "20px" }}>
              ANALYSIS PIPELINE
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1px",
                background: "var(--border)",
                border: "1px solid var(--border)",
              }}
            >
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="animate-fade-up"
                    style={{
                      animationDelay: `${idx * 60}ms`,
                      background: "var(--bg)",
                      padding: "20px 16px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "12px", right: "12px",
                        fontSize: "10px",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-3)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      0{step.num}
                    </div>

                    <Icon size={18} style={{ color: step.accent, marginBottom: "12px" }} />
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text)",
                      marginBottom: "6px",
                      letterSpacing: "0.02em",
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)", lineHeight: 1.5 }}>
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Saved Workspaces ── */}
        <section id="workspaces" style={{ paddingTop: "48px", paddingBottom: "64px" }}>
          <div className="container-xl">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <div className="section-label animate-fade-up delay-0" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Clock size={11} />
                  ACTIVE WORKSPACES
                </div>
                <div
                  className="animate-fade-up delay-75"
                  style={{ fontSize: "11px", color: "var(--text-3)" }}
                >
                  Resume a workspace or create a new one.
                </div>
              </div>
              {projects.length > 0 && (
                <div className="tag animate-fade-up delay-0">
                  {projects.length} {projects.length === 1 ? "workspace" : "workspaces"}
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="empty-state animate-fade-up delay-150">
                <div className="empty-state-icon">
                  <Layers size={20} />
                </div>
                <div>
                  <div className="mono-heading" style={{ marginBottom: "6px" }}>No workspaces yet</div>
                  <div className="mono-body" style={{ fontSize: "11px", maxWidth: "320px" }}>
                    Input a problem statement and SolutionForge creates a dedicated
                    workspace to walk you through structured validation.
                  </div>
                </div>
                <Link href="/new" className="btn-primary" id="empty-state-create-btn">
                  <Plus size={13} />
                  Create First Project
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1px",
                  background: "var(--border)",
                  border: "1px solid var(--border)",
                }}
              >
                {projects.map((proj, idx) => (
                  <Link
                    key={proj.id}
                    href={`/workspace?id=${proj.id}`}
                    id={`project-card-${proj.id}`}
                    style={{
                      background: "var(--bg)",
                      padding: "20px",
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background 0.15s",
                      position: "relative",
                    }}
                    className={`animate-fade-up`}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                      <div className="tag">{proj.domain}</div>
                      <button
                        onClick={(e) => deleteProject(proj.id, e)}
                        className="btn-danger"
                        title="Delete workspace"
                        id={`delete-project-${proj.id}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "var(--text)",
                        marginBottom: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {proj.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-3)", marginBottom: "16px" }}>
                      {new Date(proj.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-3)", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                        <span>PROGRESS</span>
                        <span style={{ color: "var(--acid)" }}>{Math.round((proj.currentStep / 6) * 100)}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${(proj.currentStep / 6) * 100}%` }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      RESUME
                      <ArrowUpRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
        <div className="container-xl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            © 2026 SOLUTIONFORGE
          </span>
          <span style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            AI STRATEGY PLATFORM — v1.0
          </span>
        </div>
      </footer>
    </div>
  );
}
