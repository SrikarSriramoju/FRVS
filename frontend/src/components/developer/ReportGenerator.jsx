import { useState } from "react";
import {
  FileText,
  Printer,
  CheckCircle2,
  BarChart2,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import DevLayout from "../layout/DevLayout.jsx";
import api from "../../api.js";
import { useEffect } from "react";

const sentimentColor = (overall) => {
  if (overall === "POSITIVE")
    return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30";
  if (overall === "NEGATIVE")
    return "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30";
  return "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800";
};

export default function ReportGenerator() {
  const { currentUser } = useApp();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sumRes, clusterRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/clusters"),
        ]);
        setAnalytics(sumRes.data);
        const mappedClusters = clusterRes.data.map((c) => ({
          ...c,
          sentimentScore: c.sentimentScore || {
            positive: 0.8,
            neutral: 0.1,
            negative: 0.1,
            overall: "POSITIVE",
          },
          relatedFeatures: c.relatedFeatures || [],
        }));
        setClusters(mappedClusters);
        setSelectedClusters(mappedClusters.map((c) => c.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleCluster = (id) => {
    setSelectedClusters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };

  const handlePrint = async () => {
    try {
      const params = selectedClusters.length
        ? { clusterIds: selectedClusters.join(",") }
        : undefined;
      const res = await api.get("/analytics/report", {
        responseType: "blob",
        params,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Analytics_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  if (loading || !analytics) {
    return (
      <DevLayout>
        <div className="p-8">Loading report configuration...</div>
      </DevLayout>
    );
  }

  const filteredClusters = clusters.filter((c) =>
    selectedClusters.includes(c.id),
  );

  const reportSentiment = (() => {
    const totalWeight = filteredClusters.reduce(
      (sum, c) => sum + Math.max(c.totalRequests, 1),
      0,
    );

    if (!totalWeight) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
        overall: "NEUTRAL",
      };
    }

    const positive =
      filteredClusters.reduce(
        (sum, c) =>
          sum + c.sentimentScore.positive * Math.max(c.totalRequests, 1),
        0,
      ) / totalWeight;
    const neutral =
      filteredClusters.reduce(
        (sum, c) =>
          sum + c.sentimentScore.neutral * Math.max(c.totalRequests, 1),
        0,
      ) / totalWeight;
    const negative =
      filteredClusters.reduce(
        (sum, c) =>
          sum + c.sentimentScore.negative * Math.max(c.totalRequests, 1),
        0,
      ) / totalWeight;

    const top = Math.max(positive, neutral, negative);
    const overall =
      top === positive ? "POSITIVE" : top === negative ? "NEGATIVE" : "NEUTRAL";

    return { positive, neutral, negative, overall };
  })();

  const selectedSummary = {
    totalClusters: filteredClusters.length,
    totalRequests: filteredClusters.reduce(
      (sum, c) => sum + c.totalRequests,
      0,
    ),
    totalUpvotes: filteredClusters.reduce((sum, c) => sum + c.upvotes, 0),
    totalDownvotes: filteredClusters.reduce((sum, c) => sum + c.downvotes, 0),
  };

  return (
    <DevLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Analytics Report
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Generate and export comprehensive product analytics reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm mb-4 flex items-center gap-2 transition-colors">
                <FileText size={16} className="text-blue-500" />
                Report Configuration
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide block mb-2 transition-colors">
                    Include Feature Clusters
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {clusters.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-start gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedClusters.includes(c.id)}
                          onChange={() => toggleCluster(c.id)}
                          className="mt-0.5 rounded border-slate-300 dark:border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                        />
                        <div>
                          <p className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {c.summarizedTitle}
                          </p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5 transition-colors">
                            {c.totalRequests} requests
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 transition-colors">
                    <span>{selectedClusters.length} clusters selected</span>
                    <button
                      onClick={() =>
                        setSelectedClusters(clusters.map((c) => c.id))
                      }
                      className="text-blue-500 hover:underline"
                    >
                      Select all
                    </button>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={generating || selectedClusters.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {generating ? (
                      <>
                        <Clock size={15} className="animate-spin" />
                        Generating...
                      </>
                    ) : generated ? (
                      <>
                        <CheckCircle2 size={15} />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <BarChart2 size={15} />
                        Generate Report
                      </>
                    )}
                  </button>

                  {generated && (
                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
                    >
                      <Printer size={15} />
                      Print / Export PDF
                    </button>
                  )}
                </div>
              </div>
            </div>

            {generated && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 dark:text-emerald-500 transition-colors"
                  />
                  <span className="text-emerald-800 dark:text-emerald-400 text-sm font-semibold transition-colors">
                    Report Ready
                  </span>
                </div>
                <p className="text-emerald-700 dark:text-emerald-500/80 text-xs transition-colors">
                  Use your browser's print dialog to save as PDF. Select "Save
                  as PDF" as destination.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {!generated && !generating && (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center py-24 text-center transition-colors">
                <div>
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <FileText
                      size={28}
                      className="text-slate-400 dark:text-slate-500 transition-colors"
                    />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-1 transition-colors">
                    No report generated yet
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">
                    Configure and generate your analytics report
                  </p>
                </div>
              </div>
            )}

            {generating && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center py-24 text-center transition-colors">
                <div>
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900/30 transition-colors">
                    <BarChart2
                      size={28}
                      className="text-blue-500 animate-pulse transition-colors"
                    />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-2 transition-colors">
                    Generating Report
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">
                    Compiling AI insights and analytics...
                  </p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {generated && !generating && (
              <div
                id="report-content"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <div className="px-8 py-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                        FRVS Analytics Report Preview
                      </p>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 transition-colors">
                        {currentUser?.organization || "FRVS Organization"}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                        Feature request insights grouped by selected AI clusters
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500 dark:text-slate-400 transition-colors">
                      <p>
                        Generated on{" "}
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-1">
                        Product Key: {currentUser?.productKey?.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-7 space-y-7">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 transition-colors">
                      Executive Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        {
                          label: "Selected Clusters",
                          value: selectedSummary.totalClusters,
                        },
                        {
                          label: "Selected Requests",
                          value: selectedSummary.totalRequests,
                        },
                        {
                          label: "Upvotes",
                          value: selectedSummary.totalUpvotes,
                        },
                        {
                          label: "Downvotes",
                          value: selectedSummary.totalDownvotes,
                        },
                        {
                          label: "Weighted Sentiment",
                          value: `${Math.round(reportSentiment.positive * 100)}% positive`,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-colors"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1 transition-colors">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 transition-colors">
                      Cluster Breakdown
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-800/70 transition-colors">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                              Cluster
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                              Status
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                              Requests
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                              Votes
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 transition-colors">
                              Sentiment
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClusters.map((cluster) => (
                            <tr
                              key={cluster.id}
                              className="border-t border-slate-100 dark:border-slate-800 transition-colors"
                            >
                              <td className="px-4 py-3 align-top">
                                <p className="font-medium text-slate-800 dark:text-slate-200 transition-colors">
                                  {cluster.summarizedTitle}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 transition-colors">
                                  {cluster.summarizedDescription}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300 transition-colors">
                                {String(cluster.status || "-").replace(
                                  "_",
                                  " ",
                                )}
                              </td>
                              <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300 transition-colors">
                                {cluster.totalRequests}
                              </td>
                              <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300 transition-colors">
                                {cluster.upvotes} / {cluster.downvotes}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${sentimentColor(cluster.sentimentScore.overall)}`}
                                >
                                  {cluster.sentimentScore.overall}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 transition-colors">
                      Recommendations
                    </h3>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 transition-colors">
                      <p>
                        Prioritize clusters with high request volume and a
                        strong upvote ratio to maximize impact in upcoming
                        roadmap cycles.
                      </p>
                      <p>
                        Review clusters marked negative or neutral in sentiment
                        before final planning to avoid releasing changes that
                        may not meet user expectations.
                      </p>
                      <p>
                        Validate summary wording against the top raw requests in
                        each cluster to ensure grouped themes still reflect
                        actual user intent.
                      </p>
                    </div>
                  </section>
                </div>

                <div className="px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between transition-colors">
                  <span>Preview reflects selected clusters only</span>
                  <span>Generated by FRVS Platform</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DevLayout>
  );
}
