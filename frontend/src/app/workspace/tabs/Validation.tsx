"use client";
import React from "react";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card-inset">
      <div className="section-label" style={{ marginBottom: "12px" }}>{label}</div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export default function ValidationTab({ project, onGenerate }: { project: any; onGenerate: () => void }) {
  const v = project.validation;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>04 — FRAMEWORK VALIDATION</div>
        <p className="mono-body">SWOT · Lean Canvas · Porter's Five Forces · JTBD · Value Proposition Canvas</p>
      </div>
      {!v ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: "18px" }}>✓</span></div>
          <div>
            <div className="mono-heading" style={{ marginBottom: "6px" }}>Validation suite locked</div>
            <p className="mono-body" style={{ fontSize: "11px", maxWidth: "300px" }}>Process problem, solutions, and research through five strategic frameworks.</p>
          </div>
          <button className="btn-primary" onClick={onGenerate} id="generate-validation-btn">Conduct Validation Analysis</button>
        </div>
      ) : (
        <>
          {/* Lean Canvas */}
          <Section label="LEAN CANVAS">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", marginBottom: "1px" }}>
              {[
                { k: "Problem", v: v.lean_canvas.problem },
                { k: "Key Metrics", v: v.lean_canvas.key_metrics },
                { k: "UVP", v: [v.lean_canvas.uvp, v.lean_canvas.unfair_advantage] },
                { k: "Channels", v: v.lean_canvas.channels },
                { k: "Customer Segments", v: v.lean_canvas.customer_segments },
              ].map(({ k, v: items }) => (
                <div key={k} style={{ background: "var(--bg)", padding: "12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--acid)", fontFamily: "var(--font-mono)", marginBottom: "8px", letterSpacing: "0.06em" }}>{k.toUpperCase()}</div>
                  <BulletList items={Array.isArray(items) ? items.filter(Boolean) : [String(items)]} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
              {[
                { k: "Cost Structure", v: v.lean_canvas.cost_structure },
                { k: "Revenue Streams", v: v.lean_canvas.revenue_streams },
              ].map(({ k, v: items }) => (
                <div key={k} style={{ background: "var(--bg)", padding: "12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--acid)", fontFamily: "var(--font-mono)", marginBottom: "8px", letterSpacing: "0.06em" }}>{k.toUpperCase()}</div>
                  <BulletList items={items} />
                </div>
              ))}
            </div>
          </Section>

          {/* SWOT */}
          <Section label="SWOT ANALYSIS">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { k: "Strengths", items: v.swot.strengths, color: "var(--ok)" },
                { k: "Weaknesses", items: v.swot.weaknesses, color: "var(--danger)" },
                { k: "Opportunities", items: v.swot.opportunities, color: "var(--info)" },
                { k: "Threats", items: v.swot.threats, color: "var(--warn)" },
              ].map(({ k, items, color }) => (
                <div key={k} style={{ padding: "14px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "10px", color, letterSpacing: "0.08em", marginBottom: "8px" }}>{k.toUpperCase()}</div>
                  <BulletList items={items} />
                </div>
              ))}
            </div>
          </Section>

          {/* Porter's */}
          <Section label="PORTER'S FIVE FORCES">
            {[
              { k: "Competitive Rivalry", v: v.porters_five_forces.rivalry },
              { k: "Supplier Power", v: v.porters_five_forces.supplier_power },
              { k: "Buyer Power", v: v.porters_five_forces.buyer_power },
              { k: "Threat of Substitutes", v: v.porters_five_forces.substitution_threat },
              { k: "Threat of New Entrants", v: v.porters_five_forces.new_entrants_threat },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", padding: "10px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                <div style={{ width: "160px", flexShrink: 0, fontSize: "11px", color: "var(--text)", fontWeight: 500 }}>{f.k}</div>
                <p style={{ fontSize: "11px", color: "var(--text-2)", lineHeight: 1.7 }}>{f.v}</p>
              </div>
            ))}
          </Section>

          {/* JTBD + VPC */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Section label="CUSTOMER PROFILE (JTBD)">
              {[
                { k: "Jobs", items: v.jtbd.jobs, color: "var(--text)" },
                { k: "Pains", items: v.jtbd.pains, color: "var(--danger)" },
                { k: "Gains", items: v.jtbd.gains, color: "var(--ok)" },
              ].map(({ k, items, color }) => (
                <div key={k} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color, letterSpacing: "0.06em", marginBottom: "6px" }}>{k.toUpperCase()}</div>
                  <BulletList items={items} />
                </div>
              ))}
            </Section>
            <Section label="VALUE MAP">
              {[
                { k: "Products & Services", items: v.value_proposition_canvas.value_map.products_and_services, color: "var(--info)" },
                { k: "Pain Relievers", items: v.value_proposition_canvas.value_map.pain_relievers, color: "var(--danger)" },
                { k: "Gain Creators", items: v.value_proposition_canvas.value_map.gain_creators, color: "var(--ok)" },
              ].map(({ k, items, color }) => (
                <div key={k} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color, letterSpacing: "0.06em", marginBottom: "6px" }}>{k.toUpperCase()}</div>
                  <BulletList items={items} />
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                <div style={{ fontSize: "10px", color: "var(--acid)", letterSpacing: "0.06em", marginBottom: "6px" }}>FIT ANALYSIS</div>
                <p style={{ fontSize: "11px", color: "var(--text-2)", lineHeight: 1.6 }}>{v.value_proposition_canvas.fit_analysis}</p>
              </div>
            </Section>
          </div>

          {/* Framework Meta */}
          <Section label="STRATEGIC RECOMMENDATIONS">
            {Object.entries(v.framework_meta).map(([key, meta]: any) => (
              <div key={key} style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--acid)", fontWeight: 500, marginBottom: "8px", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</div>
                <p style={{ fontSize: "11px", color: "var(--text-2)", marginBottom: "10px", lineHeight: 1.6 }}>{meta.reasoning}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { k: "Gaps", items: meta.gaps, color: "var(--danger)" },
                    { k: "Assumptions", items: meta.assumptions, color: "var(--warn)" },
                    { k: "Recommendations", items: meta.recommendations, color: "var(--info)" },
                  ].map(({ k, items, color }) => (
                    <div key={k} style={{ padding: "10px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "10px", color, letterSpacing: "0.06em", marginBottom: "6px" }}>{k.toUpperCase()}</div>
                      <BulletList items={items} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        </>
      )}
    </div>
  );
}
