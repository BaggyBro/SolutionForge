"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { exportPdf } from "../../lib/api";

function ReportViewerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<any>(null);
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
        if (!parsed.report) {
          router.push(`/workspace?id=${projectId}`);
          return;
        }
        setProject(parsed);
      } catch (e) {
        console.error(e);
        setError("Corrupt project file.");
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="site-header">
        <div className="container-md" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <Link href={`/workspace?id=${projectId}`} className="btn-ghost" style={{ padding: "6px 12px" }} id="report-back-btn">
            <ArrowLeft size={13} />
            Workspace
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="logo-mark" style={{ width: "24px", height: "24px", fontSize: "9px" }}>SF</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.08em" }}>
              REPORT VIEWER
            </span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Exporting Report</p>
              <p className="animate-blink" style={{ fontSize: "11px", color: "var(--text-3)" }}>{loadingStatus}</p>
            </div>
          </div>
        )}

        <div className="container-md" style={{ padding: "clamp(32px, 6vw, 64px) clamp(1rem, 4vw, 2.5rem)", display: "flex", flexDirection: "column", gap: "24px" }}>
          {error && <div className="error-banner">{error}</div>}

          <div className="card-inset">
            <span className="section-label">VALIDATION REPORT FOR</span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                fontWeight: 600,
                color: "var(--text)",
                marginTop: "8px",
                marginBottom: "4px",
              }}
            >
              {project.meta.name}
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-3)" }}>
              Domain: {project.meta.domain} • Created: {new Date(project.meta.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="card-inset">
            <div className="section-label" style={{ marginBottom: "8px" }}>EXECUTIVE SUMMARY</div>
            <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.8 }}>{project.report.executive_summary}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="section-label">EXPORT CHANNELS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <button className="card-hover" onClick={handleExportPDF} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="report-download-pdf">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Download PDF</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>ReportLab formatted layout</div>
                </div>
                <Download size={14} style={{ color: "var(--acid)" }} />
              </button>

              <button className="card-hover" onClick={handleExportMarkdown} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="report-download-md">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Download Markdown</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)" }}>Plaintext with tables & styling</div>
                </div>
                <Download size={14} style={{ color: "var(--acid)" }} />
              </button>

              <button className="card-hover" onClick={handleExportJSON} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} id="report-download-json">
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
              {project.report.markdown_report}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportViewerPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="loading-spinner" /></div>}>
      <ReportViewerContent />
    </Suspense>
  );
}
