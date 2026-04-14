const configs = {
  OPEN: {
    label: "Open",
    classes:
      "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800",
  },
  TODO: {
    label: "To Do",
    classes:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    classes:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
  },
  COMPLETED: {
    label: "Completed",
    classes:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  },
};

export default function StatusBadge({ status }) {
  const config = (status && configs[status]) || {
    label: status || "Unknown",
    classes:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
