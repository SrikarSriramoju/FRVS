import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import DevLayout from "../layout/DevLayout.jsx";
import PieChart from "./PieChart.jsx";
import Avatar from "../common/Avatar.jsx";
import api from "../../api.js";

const STATUS_OPTIONS = [
  {
    value: "OPEN",
    label: "Open",
    color: "sky",
    description: "Visible in intake and ready for triage",
  },
  {
    value: "TODO",
    label: "To Do",
    color: "amber",
    description: "Accepted and queued for upcoming work",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "blue",
    description: "Being implemented by the team",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "emerald",
    description: "Delivered and available to users",
  },
];

const statusTone = {
  OPEN: {
    badge:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  TODO: {
    badge:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    badge:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
};

function StatusDropdown({ featureId, current }) {
  const { updateFeatureStatus } = useApp();
  const [open, setOpen] = useState(false);
  const active =
    STATUS_OPTIONS.find((s) => s.value === current) || STATUS_OPTIONS[0];
  const tone = statusTone[active.value] || statusTone.OPEN;

  return (
    <div className="relative inline-block w-full min-w-[12rem] max-w-[14rem]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={`group flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-all ${tone.badge}`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
          <span className="text-xs font-semibold truncate">{active.label}</span>
        </span>
        <ChevronDown size={14} className="opacity-70 group-hover:opacity-100" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 min-w-[18rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Change feature status
              </p>
            </div>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateFeatureStatus(featureId, opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 transition-colors flex items-start gap-2.5 ${
                  current === opt.value
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${(statusTone[opt.value] || statusTone.OPEN).dot}`}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.description}
                  </span>
                </span>
                {current === opt.value && (
                  <span className="mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Check size={12} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FeatureRow({ feature, cluster }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-t border-slate-100 dark:border-slate-800"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 px-4">
          <p className="text-slate-800 dark:text-slate-200 text-sm font-medium line-clamp-1 transition-colors">
            {feature.title}
          </p>
          {cluster && (
            <p className="text-teal-600 dark:text-teal-400 text-xs mt-0.5 transition-colors">
              Cluster:{" "}
              {cluster.summarizedTitle.split(" ").slice(0, 4).join(" ")}...
            </p>
          )}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Avatar name={feature.userName} size="sm" />
            <span className="text-slate-600 dark:text-slate-400 text-xs transition-colors">
              {feature.userName}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
              <ThumbsUp size={13} /> {feature.upvotes}
            </span>
            <span className="flex items-center gap-1 text-rose-500 text-sm font-medium">
              <ThumbsDown size={13} /> {feature.downvotes}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors">
          <span className="flex items-center justify-center gap-1">
            <MessageSquare size={13} /> {feature.commentCount}
          </span>
        </td>
        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 text-center transition-colors">
          {new Date(feature.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="py-3 px-4 w-44" onClick={(e) => e.stopPropagation()}>
          <StatusDropdown featureId={feature.id} current={feature.status} />
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 transition-colors">
                  Description
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed transition-colors">
                  {feature.description}
                </p>
              </div>
              {cluster && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 transition-colors">
                    Cluster Sentiment
                  </p>
                  <PieChart data={cluster.sentimentScore} title="" />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function FeatureManagement() {
  const { features } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clusterFilter, setClusterFilter] = useState("ALL");
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await api.get("/analytics/clusters");
        const mappedConfig = res.data.map((c) => ({
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
      }
    };
    fetchClusters();
  }, []);

  const filtered = features
    .filter((f) => statusFilter === "ALL" || f.status === statusFilter)
    .filter((f) => clusterFilter === "ALL" || f.clusterId === clusterFilter)
    .filter(
      (f) =>
        !search ||
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.userName.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <DevLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Feature Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Review raw requests and manage feature roadmap status
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-visible transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-56">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search features or users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-lg p-1 transition-colors">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${statusFilter === "ALL" ? "bg-slate-800 dark:bg-slate-700 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
                  >
                    All
                  </button>
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${statusFilter === opt.value ? "bg-slate-800 dark:bg-slate-700 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <select
                  value={clusterFilter}
                  onChange={(e) => setClusterFilter(e.target.value)}
                  className="text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all [&>option]:dark:bg-slate-900"
                >
                  <option value="ALL">All Clusters</option>
                  {clusters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.summarizedTitle.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs ml-auto transition-colors">
                <Filter size={12} />
                <span>
                  {filtered.length} of {features.length} requests
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 transition-colors">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Feature
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Submitter
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Votes
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Comments
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <FeatureRow
                    key={f.id}
                    feature={f}
                    cluster={clusters.find((c) => c.id === f.clusterId)}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm transition-colors"
                    >
                      No features match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DevLayout>
  );
}
