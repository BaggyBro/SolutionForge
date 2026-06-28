"use client";
import React from "react";
import { Download } from "lucide-react";

export default function ReportTab({
  project,
  onGenerate,
  onExportPDF,
  onExportMarkdown,
  onExportJSON,
}: {
  project: any;
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
  onExportJSON: () => void;
}) {
  const r = project.report;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "8px" }}>06 — FINAL REPORT</div>
        <p className="mono-body">Synthesized executive summary, fully-formatted brief, and multiple download channels.</p>
      </div>

      {!r ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: "18px" }}>📝</span></div>
          <div>
            <div className="mono-heading" style={{ marginBottom: "6px" }}>Report generation pending</div>
            <p className="mono-body" style={{ fontSize: "11px", maxWidth: "300px" }}>Compile executive summary, validation briefs, and timeline goals.</p>
          </div>
          <button className="btn-primary" onClick={onGenerate} id="generate-report-btn">Compile Final Report</button>
        </div>
      ) : (
        <>
          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "10px" }}>EXECUTIVE SUMMARY</div>
            <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.8 }}>{r.executive_summary}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="section-label">EXPORT CHANNELS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <button className="card-hover" onClick={onExportPDF} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="export-pdf-btn">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Download PDF</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>ReportLab formatted layout</div>
                </div>
                <Download size={14} style={{ color: "var(--acid)" }} />
              </button>

              <button className="card-hover" onClick={onExportMarkdown} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="export-md-btn">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Download Markdown</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>Plaintext with tables & styling</div>
                </div>
                <Download size={14} style={{ color: "var(--acid)" }} />
              </button>

              <button className="card-hover" onClick={onExportJSON} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="export-json-btn">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Download JSON</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>Raw structured data package</div>
                </div>
                <Download size={14} style={{ color: "var(--acid)" }} />
              </button>
            </div>
          </div>

          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "12px" }}>LIVE BRIEF PREVIEW</div>
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                padding: "20px",
                maxHeight: "360px",
                overflowY: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-2)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {r.markdown_report}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
