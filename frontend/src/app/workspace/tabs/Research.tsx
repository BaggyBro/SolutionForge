"use client";
import React from "react";

export default function ResearchTab({ project, onGenerate }: { project: any; onGenerate: () => void }) {
  const r = project.research;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>03 — RESEARCH ENGINE</div>
        <p className="mono-body">Live competitor search, pricing benchmarks, and vendor suggestions.</p>
      </div>
      {!r ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: "18px" }}>⌕</span></div>
          <div>
            <div className="mono-heading" style={{ marginBottom: "6px" }}>Research workspace not initialized</div>
            <p className="mono-body" style={{ fontSize: "11px", maxWidth: "300px" }}>Analyze real-world competitor landscape and pull pricing benchmarks.</p>
          </div>
          <button className="btn-primary" onClick={onGenerate} id="generate-research-btn">Run Research</button>
        </div>
      ) : (
        <>
          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "12px" }}>COMPETITOR LANDSCAPE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {r.competitor_analysis.map((c: any, i: number) => (
                <div key={i} style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontWeight: 500, fontSize: "12px", color: "var(--text)" }}>{c.name}</span>
                    <span className="tag-acid" style={{ fontSize: "9px" }}>{c.market_share}</span>
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <div style={{ fontSize: "10px", color: "var(--ok)", letterSpacing: "0.06em", marginBottom: "3px" }}>STRENGTHS</div>
                    <p style={{ fontSize: "10px", color: "var(--text-2)" }}>{c.strengths.join(", ")}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--danger)", letterSpacing: "0.06em", marginBottom: "3px" }}>WEAKNESSES</div>
                    <p style={{ fontSize: "10px", color: "var(--text-2)" }}>{c.weaknesses.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="card-inset">
              <div className="section-label" style={{ marginBottom: "10px" }}>PRICING BENCHMARKS</div>
              {r.pricing_benchmarks.map((p: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>{p.tier}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-3)" }}>{p.model}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "var(--font-mono)" }}>{p.price}</div>
                </div>
              ))}
            </div>

            <div className="card-inset">
              <div className="section-label" style={{ marginBottom: "10px" }}>VENDOR RECOMMENDATIONS</div>
              {r.vendor_recommendations.map((v: any, i: number) => (
                <div key={i} style={{ paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>{v.name}</span>
                    <span style={{ fontSize: "12px", color: "var(--ok)", fontFamily: "var(--font-mono)" }}>{v.estimate}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "2px" }}>{v.service}</div>
                  {v.contact_or_link && <div style={{ fontSize: "10px", color: "var(--info)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>{v.contact_or_link}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "12px" }}>ESTIMATED BUDGET ITEMS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {r.cost_estimates.map((c: any, i: number) => (
                <div key={i} style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text)", fontWeight: 500, marginBottom: "4px" }}>{c.item}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)", marginBottom: "8px", textTransform: "capitalize" }}>{c.recurrency}</div>
                  <div style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "var(--font-mono)" }}>
                    ${c.low_range.toLocaleString()} – ${c.high_range.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
