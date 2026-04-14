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
import StatusBadge from "../common/StatusBadge.jsx";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
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

  const reportBarData = [...filteredClusters]
    .sort((a, b) => b.totalRequests - a.totalRequests)
    .slice(0, 6)
    .map((c) => ({
      label: c.summarizedTitle,
      upvotes: c.upvotes,
      downvotes: c.downvotes,
      total: c.upvotes + c.downvotes,
      requests: c.totalRequests,
      status: c.status,
    }));

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
                <div className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 px-8 py-8 text-white transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium mb-1">
                        Analytics Report
                      </p>
                      <h2 className="text-2xl font-bold">
                        {currentUser?.organization || "TechCorp Inc."}
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">
                        Feature Request & Voting System
                      </p>
                    </div>
                    <div className="text-right text-slate-400 text-xs">
                      <p>
                        Generated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-0.5">
                        Product Key: {currentUser?.productKey?.slice(0, 16)}...
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {[
                      {
                        label: "Total Clusters",
                        value: analytics.totalClusters,
                      },
                      { label: "Raw Requests", value: analytics.totalFeatures },
                      {
                        label: "Total Votes",
                        value: analytics.totalVotes.toLocaleString(),
                      },
                      {
                        label: "Avg Sentiment",
                        value: `${Math.round(analytics.avgSentimentScore * 100)}%`,
                      },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/10 rounded-xl p-3">
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-blue-200 text-xs mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-6 space-y-8">
                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
                      Cluster Trends & Sentiment Snapshot
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                      <div className="xl:col-span-2">
                        <BarChart
                          data={reportBarData}
                          title="Top Requested Cluster Vote Activity"
                        />
                      </div>
                      <div>
                        <PieChart
                          data={reportSentiment}
                          title="Selected Cluster Sentiment"
                          subtitle="Weighted by request volume"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
                      Summarized Feature Cluster Analysis
                    </h3>
                    <div className="space-y-5">
                      {filteredClusters.map((cluster, idx) => (
                        <div
                          key={cluster.id}
                          className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                        >
                          <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors">
                                  {cluster.summarizedTitle}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <StatusBadge status={cluster.status} />
                                  {cluster.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded transition-colors"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-slate-600 dark:text-slate-400 text-xs transition-colors">
                                {cluster.totalRequests} requests
                              </p>
                              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 transition-colors">
                                {cluster.upvotes + cluster.downvotes} votes
                              </p>
                            </div>
                          </div>
                          <div className="px-5 py-4">
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 transition-colors">
                              {cluster.summarizedDescription}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 transition-colors">
                                  Vote Distribution
                                </p>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                      <div
                                        className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-colors"
                                        style={{
                                          width: `${Math.round((cluster.upvotes / Math.max(cluster.upvotes + cluster.downvotes, 1)) * 100)}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium w-10 text-right transition-colors">
                                      {cluster.upvotes} ↑
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                      <div
                                        className="h-full bg-rose-400 dark:bg-rose-500 rounded-full transition-colors"
                                        style={{
                                          width: `${Math.round((cluster.downvotes / Math.max(cluster.upvotes + cluster.downvotes, 1)) * 100)}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-rose-500 dark:text-rose-400 text-xs font-medium w-10 text-right transition-colors">
                                      {cluster.downvotes} ↓
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 transition-colors">
                                  Sentiment
                                </p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${sentimentColor(cluster.sentimentScore.overall)}`}
                                  >
                                    {cluster.sentimentScore.overall}
                                  </span>
                                  <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                                    {Math.round(
                                      cluster.sentimentScore.positive * 100,
                                    )}
                                    % pos ·{" "}
                                    {Math.round(
                                      cluster.sentimentScore.neutral * 100,
                                    )}
                                    % neu ·{" "}
                                    {Math.round(
                                      cluster.sentimentScore.negative * 100,
                                    )}
                                    % neg
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 transition-colors">
                                Top Raw Requests in this Cluster
                              </p>
                              <div className="space-y-2">
                                {cluster.relatedFeatures
                                  .slice(0, 4)
                                  .map((feature) => (
                                    <div
                                      key={feature.id}
                                      className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2 transition-colors"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium line-clamp-1 transition-colors">
                                          {feature.title}
                                        </p>
                                        <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5 transition-colors">
                                          by {feature.userName}
                                        </p>
                                      </div>
                                      <div className="text-right flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                                        <p>{feature.upvotes} ↑</p>
                                        <p>{feature.commentCount} comments</p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 transition-colors">
                    <h3 className="text-slate-800 dark:text-slate-200 font-bold text-base mb-3 transition-colors">
                      Summary & Recommendations
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 text-sm text-blue-800 dark:text-blue-300 leading-relaxed space-y-2 transition-colors">
                      <p>
                        Based on the analysis of {analytics.totalFeatures} raw
                        feature requests grouped into {analytics.totalClusters}{" "}
                        summarized clusters:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400/90">
                        <li>
                          The report is organized around AI-summarized feature
                          clusters so repeated requests are analyzed as one
                          product theme.
                        </li>
                        <li>
                          Prioritize the highest-vote open clusters first,
                          especially those with high request volume and positive
                          sentiment momentum.
                        </li>
                        <li>
                          Use the raw request samples in each cluster to
                          validate whether the summary still matches the
                          underlying user intent.
                        </li>
                        <li>
                          Overall platform sentiment is{" "}
                          <strong className="dark:text-white">
                            {Math.round(analytics.avgSentimentScore * 100)}%
                            positive
                          </strong>
                          , which suggests the roadmap is still aligned with
                          user needs.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between transition-colors">
                  <span>Generated by FRVS Platform · AI-Powered Analytics</span>
                  <span>
                    {new Date().getFullYear()} {currentUser?.organization}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DevLayout>
  );
}
