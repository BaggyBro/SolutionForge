"use client";
import React from "react";

function RiskTag({ level }: { level: string }) {
  const map: Record<string, string> = { High: "tag-danger", Medium: "tag-warn", Low: "tag-info" };
  return <span className={map[level] ?? "tag"}>{level} Risk</span>;
}

export default function DiscoveryTab({ project }: { project: any }) {
  const d = project.discovery;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>01 — PROBLEM DISCOVERY</div>
        <p className="mono-body">Refined scope mapping, core assumptions, and validation criteria.</p>
      </div>

      <div className="card-inset">
        <div className="section-label" style={{ marginBottom: "10px" }}>REFINED PROBLEM STATEMENT</div>
        <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.8 }}>{d.refined_problem}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="card-inset">
          <div className="section-label" style={{ marginBottom: "10px" }}>SUCCESS CRITERIA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {d.success_criteria.map((c: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>{c.metric}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>{c.timeline}</div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "var(--font-mono)" }}>{c.target}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-inset">
          <div className="section-label" style={{ marginBottom: "10px" }}>KEY ASSUMPTIONS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {d.key_assumptions.map((a: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.08em", marginBottom: "2px" }}>{a.category}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-2)" }}>{a.assumption}</div>
                </div>
                <div style={{ flexShrink: 0 }}><RiskTag level={a.risk_level} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-inset">
        <div className="section-label" style={{ marginBottom: "10px" }}>STAKEHOLDER MAP</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Stakeholder</th><th>Role</th><th>Impact</th><th>Needs</th>
            </tr>
          </thead>
          <tbody>
            {d.stakeholder_map.map((s: any, i: number) => (
              <tr key={i}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</td>
                <td>{s.role}</td>
                <td><span className={s.impact === "High" ? "tag-acid" : "tag"}>{s.impact}</span></td>
                <td style={{ color: "var(--text-3)" }}>{s.needs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
