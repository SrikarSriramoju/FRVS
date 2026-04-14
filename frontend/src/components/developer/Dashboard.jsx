import { useState } from "react";
import {
  BarChart2,
  MessageSquare,
  ThumbsUp,
  Layers,
  TrendingUp,
  CheckCircle2,
  Clock,
  GitPullRequest,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

import DevLayout from "../layout/DevLayout.jsx";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import api from "../../api.js";
import { useEffect } from "react";

const sentimentLabel = (score) => {
  if (score >= 0.65) return { label: "Positive", cls: "text-emerald-600" };
  if (score >= 0.4) return { label: "Neutral", cls: "text-slate-600" };
  return { label: "Negative", cls: "text-rose-600" };
};

function ClusterRow({ cluster, onSelect }) {
  const sent = sentimentLabel(cluster.sentimentScore.positive);
  return (
    <tr
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-t border-slate-100 dark:border-slate-800"
      onClick={onSelect}
    >
      <td className="py-3 px-4">
        <p className="text-slate-800 dark:text-slate-200 text-sm font-medium line-clamp-1 transition-colors">
          {cluster.summarizedTitle}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {cluster.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-sm text-center transition-colors">
        {cluster.totalRequests}
      </td>
      <td className="py-3 px-4 text-sm text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="text-blue-600 dark:text-blue-400 font-medium transition-colors">
            {cluster.upvotes}
          </span>
          <span className="text-slate-300 dark:text-slate-600 transition-colors">
            /
          </span>
          <span className="text-rose-500 dark:text-rose-400 font-medium transition-colors">
            {cluster.downvotes}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <span className={`text-sm font-semibold ${sent.cls}`}>
          {sent.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <StatusBadge status={cluster.status} />
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sumRes, clusterRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/clusters"),
        ]);
        setAnalytics(sumRes.data);
        const mappedConfig = clusterRes.data.map((c) => ({
          ...c,
          sentimentScore: c.sentimentScore || {
            positive: 0.8,
            neutral: 0.1,
            negative: 0.1,
            overall: "POSITIVE",
          },
          relatedFeatures: c.relatedFeatures || [],
        }));
        setClusters(mappedConfig);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading || !analytics) {
    return (
      <DevLayout>
        <div className="p-8">Loading dashboard...</div>
      </DevLayout>
    );
  }

  const barData = clusters.map((c) => ({
    label: c.summarizedTitle,
    upvotes: c.upvotes,
    downvotes: c.downvotes,
    total: c.upvotes + c.downvotes,
    requests: c.totalRequests,
    status: c.status,
  }));

  const aggregateSentiment = {
    positive: (() => {
      const totalWeight = clusters.reduce(
        (s, c) => s + Math.max(c.totalRequests, 1),
        0,
      );
      return totalWeight
        ? clusters.reduce(
            (s, c) =>
              s + c.sentimentScore.positive * Math.max(c.totalRequests, 1),
            0,
          ) / totalWeight
        : 0;
    })(),
    neutral: (() => {
      const totalWeight = clusters.reduce(
        (s, c) => s + Math.max(c.totalRequests, 1),
        0,
      );
      return totalWeight
        ? clusters.reduce(
            (s, c) =>
              s + c.sentimentScore.neutral * Math.max(c.totalRequests, 1),
            0,
          ) / totalWeight
        : 0;
    })(),
    negative: (() => {
      const totalWeight = clusters.reduce(
        (s, c) => s + Math.max(c.totalRequests, 1),
        0,
      );
      return totalWeight
        ? clusters.reduce(
            (s, c) =>
              s + c.sentimentScore.negative * Math.max(c.totalRequests, 1),
            0,
          ) / totalWeight
        : 0;
    })(),
    overall: "POSITIVE",
  };

  const statCards = [
    {
      icon: Layers,
      label: "Feature Clusters",
      value: analytics.totalClusters,
      sub: `${analytics.totalFeatures} raw requests`,
      boxCls: "bg-blue-100 dark:bg-blue-900/30",
      iconCls: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: ThumbsUp,
      label: "Total Votes",
      value: analytics.totalVotes.toLocaleString(),
      sub: "Across all features",
      boxCls: "bg-teal-100 dark:bg-teal-900/30",
      iconCls: "text-teal-600 dark:text-teal-400",
    },
    {
      icon: MessageSquare,
      label: "Comments",
      value: analytics.totalComments,
      sub: "User discussions",
      boxCls: "bg-emerald-100 dark:bg-emerald-900/30",
      iconCls: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: TrendingUp,
      label: "Avg Sentiment",
      value: `${Math.round(analytics.avgSentimentScore * 100)}%`,
      sub: "Positive sentiment",
      boxCls: "bg-amber-100 dark:bg-amber-900/30",
      iconCls: "text-amber-600 dark:text-amber-400",
    },
  ];

  const statusCards = [
    {
      icon: GitPullRequest,
      label: "Open",
      value: analytics.openFeatures,
      bgCls: "bg-sky-50 dark:bg-sky-900/10",
      borderCls: "border-sky-100 dark:border-sky-800/30",
      iconCls: "text-sky-500 dark:text-sky-400",
      valCls: "text-sky-700 dark:text-sky-300",
      lblCls: "text-sky-500 dark:text-sky-400",
    },
    {
      icon: Clock,
      label: "To Do",
      value: analytics.todoFeatures,
      bgCls: "bg-amber-50 dark:bg-amber-900/10",
      borderCls: "border-amber-100 dark:border-amber-800/30",
      iconCls: "text-amber-500 dark:text-amber-400",
      valCls: "text-amber-700 dark:text-amber-300",
      lblCls: "text-amber-500 dark:text-amber-400",
    },
    {
      icon: BarChart2,
      label: "In Progress",
      value: analytics.inProgressFeatures,
      bgCls: "bg-blue-50 dark:bg-blue-900/10",
      borderCls: "border-blue-100 dark:border-blue-800/30",
      iconCls: "text-blue-500 dark:text-blue-400",
      valCls: "text-blue-700 dark:text-blue-300",
      lblCls: "text-blue-500 dark:text-blue-400",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: analytics.completedFeatures,
      bgCls: "bg-emerald-50 dark:bg-emerald-900/10",
      borderCls: "border-emerald-100 dark:border-emerald-800/30",
      iconCls: "text-emerald-500 dark:text-emerald-400",
      valCls: "text-emerald-700 dark:text-emerald-300",
      lblCls: "text-emerald-500 dark:text-emerald-400",
    },
  ];

  return (
    <DevLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            AI-powered insights from user feature requests
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors"
              >
                <div
                  className={`w-10 h-10 ${card.boxCls} rounded-xl flex items-center justify-center mb-3 transition-colors`}
                >
                  <Icon
                    size={20}
                    className={`${card.iconCls} transition-colors`}
                  />
                </div>
                <p className="text-slate-800 dark:text-slate-100 text-2xl font-bold transition-colors">
                  {card.value}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5 transition-colors">
                  {card.label}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 transition-colors">
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${card.bgCls} border ${card.borderCls} rounded-xl p-4 flex items-center gap-3 transition-colors`}
              >
                <Icon
                  size={18}
                  className={`${card.iconCls} flex-shrink-0 transition-colors`}
                />
                <div>
                  <p
                    className={`${card.valCls} text-lg font-bold leading-none transition-colors`}
                  >
                    {card.value}
                  </p>
                  <p
                    className={`${card.lblCls} text-xs mt-0.5 transition-colors`}
                  >
                    {card.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <div className="xl:col-span-2">
            <BarChart data={barData} title="Most Requested Feature Clusters" />
          </div>
          <div>
            <PieChart
              data={aggregateSentiment}
              title="Overall Sentiment"
              subtitle="Weighted across grouped requests"
            />
          </div>
        </div>

        {selectedCluster && (
          <div className="mb-6 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={selectedCluster.status} />
                  {selectedCluster.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg transition-colors">
                  {selectedCluster.summarizedTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors"
              >
                Close
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 transition-colors">
              {selectedCluster.summarizedDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PieChart
                data={selectedCluster.sentimentScore}
                title="Sentiment Distribution"
                subtitle={`Based on ${selectedCluster.totalRequests} grouped requests`}
              />
              <div>
                <h4 className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-3 transition-colors">
                  Raw Feature Requests ({selectedCluster.relatedFeatures.length}
                  )
                </h4>
                <div className="space-y-2">
                  {selectedCluster.relatedFeatures.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium line-clamp-1 transition-colors">
                          {f.title}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 transition-colors">
                          by {f.userName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 transition-colors">
                        <ThumbsUp size={11} /> {f.upvotes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
            <div>
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-base transition-colors">
                AI Feature Clusters
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 transition-colors">
                Click a row to explore sentiment & raw requests
              </p>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full transition-colors">
              {clusters.length} clusters
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 transition-colors">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Feature Cluster
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Requests
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Up / Down
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Sentiment
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {clusters.map((cluster) => (
                  <ClusterRow
                    key={cluster.id}
                    cluster={cluster}
                    onSelect={() => setSelectedCluster(cluster)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DevLayout>
  );
}
