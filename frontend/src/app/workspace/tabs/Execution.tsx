"use client";
import React from "react";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export default function ExecutionTab({ project, onGenerate }: { project: any; onGenerate: () => void }) {
  const e = project.execution;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>05 — EXECUTION PLANNER</div>
        <p className="mono-body">Operational 30-60-90 day roadmap, estimated budget details, and critical performance indicators.</p>
      </div>

      {!e ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: "18px" }}>📅</span></div>
          <div>
            <div className="mono-heading" style={{ marginBottom: "6px" }}>Execution Plan locked</div>
            <p className="mono-body" style={{ fontSize: "11px", maxWidth: "300px" }}>Generate a detailed phase-by-phase roadmap and estimated budget details.</p>
          </div>
          <button className="btn-primary" onClick={onGenerate} id="generate-execution-btn">Generate Launch Roadmap</button>
        </div>
      ) : (
        <>
          {/* 30-60-90 Day Plan */}
          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "16px" }}>30-60-90 DAY LAUNCH PLAN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { title: "First 30 Days: Foundation & Setup", phase: e.plan_30_day, borderLeft: "4px solid var(--info)" },
                { title: "60-Day Horizon: Build & Integrate", phase: e.plan_60_day, borderLeft: "4px solid var(--acid)" },
                { title: "90-Day Target: Launch & Validate", phase: e.plan_90_day, borderLeft: "4px solid var(--ok)" }
              ].map((item, idx) => (
                <div key={idx} style={{ paddingLeft: "16px", borderLeft: item.borderLeft, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>{item.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div style={{ padding: "10px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.06em", marginBottom: "6px" }}>GOALS</div>
                      <BulletList items={item.phase.goals} />
                    </div>
                    <div style={{ padding: "10px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.06em", marginBottom: "6px" }}>KEY TASKS</div>
                      <BulletList items={item.phase.tasks} />
                    </div>
                    <div style={{ padding: "10px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.06em", marginBottom: "6px" }}>MILESTONES</div>
                      <BulletList items={item.phase.milestones} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget & KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
            <div className="card-inset">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div className="section-label">BUDGET DETAILS</div>
                <div className="tag-acid">
                  TOTAL: ${e.estimated_budget.total_low.toLocaleString()} – ${e.estimated_budget.total_high.toLocaleString()}
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th><th>Item</th><th style={{ textAlign: "right" }}>Est. Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {e.estimated_budget.breakdown.map((b: any, i: number) => (
                    <tr key={i}>
                      <td style={{ color: "var(--text)", fontWeight: 500 }}>{b.category}</td>
                      <td>{b.item}</td>
                      <td style={{ textAlign: "right", color: "var(--acid)", fontFamily: "var(--font-mono)" }}>${b.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-inset" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="section-label">KEY PERFORMANCE INDICATORS</div>
              {e.kpis.map((k: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{k.indicator}</span>
                  <span className="tag-acid" style={{ fontSize: "10px" }}>{k.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & Mitigations */}
          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "12px" }}>IMPLEMENTATION RISKS & MITIGATIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {e.risks.map((risk: any, i: number) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500, marginBottom: "4px" }}>{risk.description}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)" }}>
                      <strong style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: "10px" }}>MITIGATION Plan B:</strong> {risk.plan_b}
                    </div>
                  </div>
                  <span className={risk.severity === "High" ? "tag-danger" : risk.severity === "Medium" ? "tag-warn" : "tag-info"}>
                    {risk.severity} Severity
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
