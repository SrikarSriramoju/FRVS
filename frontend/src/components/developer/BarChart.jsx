import { useState } from "react";

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default function BarChart({ data, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const ranked = [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const maxVal = Math.max(...ranked.map((d) => d.total), 1);
  const active = ranked[activeIndex] || ranked[0];

  const statusTone = (status) => {
    switch (status) {
      case "OPEN":
        return "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-900/30";
      case "TODO":
        return "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30";
      case "IN_PROGRESS":
        return "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30";
      case "COMPLETED":
        return "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30";
      default:
        return "text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-base mb-1 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 dark:text-slate-500 text-xs mb-4 transition-colors">
        Ranked vote activity by AI cluster. Hover or click any row for details.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4">
          <div className="space-y-3">
            {ranked.map((d, i) => {
              const totalWidth = (d.total / maxVal) * 100;
              const upPart = d.total ? (d.upvotes / d.total) * 100 : 0;
              const downPart = d.total ? (d.downvotes / d.total) * 100 : 0;
              const isActive = i === activeIndex;

              return (
                <button
                  key={`${d.label}-${i}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${
                    isActive
                      ? "border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold truncate">
                        #{d.rank} {d.label}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                        {d.requests ?? 0} requests
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {d.total}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${totalWidth * (upPart / 100)}%` }}
                    />
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${totalWidth * (downPart / 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          {active ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-slate-800 dark:text-slate-200 font-semibold text-sm truncate">
                  {active.label}
                </h4>
                <span
                  className={`text-[11px] px-2 py-1 rounded-md font-semibold ${statusTone(active.status)}`}
                >
                  {formatStatus(active.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-3">
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    Upvotes
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-xl font-bold">
                    {active.upvotes}
                  </p>
                </div>
                <div className="rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/40 p-3">
                  <p className="text-rose-600 dark:text-rose-400 text-xs">
                    Downvotes
                  </p>
                  <p className="text-rose-700 dark:text-rose-300 text-xl font-bold">
                    {active.downvotes}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Total Votes
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 text-xl font-bold">
                    {active.total}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Requests
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 text-xl font-bold">
                    {active.requests ?? 0}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Vote ratio:{" "}
                {active.total
                  ? Math.round((active.upvotes / active.total) * 100)
                  : 0}
                % upvote,{" "}
                {active.total
                  ? Math.round((active.downvotes / active.total) * 100)
                  : 0}
                % downvote.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No cluster data available.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-blue-500" /> Upvotes
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-rose-500" /> Downvotes
        </span>
      </div>
    </div>
  );
}
