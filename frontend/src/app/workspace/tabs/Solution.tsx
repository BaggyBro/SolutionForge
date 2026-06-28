"use client";
import React from "react";

export default function SolutionTab({ project, onGenerate }: { project: any; onGenerate: () => void }) {
  const s = project.solution;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>02 — SOLUTION BUILDER</div>
        <p className="mono-body">Viable architectures, core feature suggestions, resources, and roadmap.</p>
      </div>
      {!s ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: "18px" }}>↑</span></div>
          <div>
            <div className="mono-heading" style={{ marginBottom: "6px" }}>No solution concepts yet</div>
            <p className="mono-body" style={{ fontSize: "11px", maxWidth: "300px" }}>Generate product configurations, MVP deliverables, and resource scopes.</p>
          </div>
          <button className="btn-primary" onClick={onGenerate} id="generate-solution-btn">Generate Solutions</button>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {s.potential_solutions.map((sol: any, i: number) => (
              <div key={i} className="card-inset">
                <div style={{ fontWeight: 500, fontSize: "13px", color: "var(--text)", marginBottom: "8px" }}>{sol.title}</div>
                <p style={{ fontSize: "11px", color: "var(--text-3)", lineHeight: 1.7, marginBottom: "12px" }}>{sol.description}</p>
                <div style={{ marginBottom: "6px" }}>
                  <div style={{ fontSize: "10px", color: "var(--ok)", letterSpacing: "0.08em", marginBottom: "4px" }}>PROS</div>
                  <p style={{ fontSize: "11px", color: "var(--text-2)" }}>{sol.pros.join(", ")}</p>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--danger)", letterSpacing: "0.08em", marginBottom: "4px" }}>CONS</div>
                  <p style={{ fontSize: "11px", color: "var(--text-2)" }}>{sol.cons.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
            <div className="card-inset">
              <div className="section-label" style={{ marginBottom: "10px" }}>MVP RECOMMENDATIONS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {s.mvp_recommendations.map((r: any, i: number) => (
                  <div key={i} style={{ paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--acid)", fontWeight: 500, marginBottom: "3px" }}>{r.feature}</div>
                    <p style={{ fontSize: "10px", color: "var(--text-3)", lineHeight: 1.6 }}>{r.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-inset">
              <div className="section-label" style={{ marginBottom: "10px" }}>FEATURE SUGGESTIONS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {s.feature_suggestions.map((f: any, i: number) => (
                  <div key={i} style={{ padding: "10px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text)", fontWeight: 500, marginBottom: "3px" }}>{f.feature}</div>
                      <p style={{ fontSize: "10px", color: "var(--text-3)", lineHeight: 1.5 }}>{f.description}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                      <span className="tag" style={{ fontSize: "9px" }}>V:{f.value}</span>
                      <span className="tag" style={{ fontSize: "9px" }}>C:{f.complexity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
