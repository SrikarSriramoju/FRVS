import { CheckCircle, Info, XCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

const icons = {
  success: <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
};

const borders = {
  success: "border-l-4 border-emerald-400",
  error: "border-l-4 border-red-400",
  info: "border-l-4 border-blue-400",
};

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-black/50 px-4 py-3 min-w-64 max-w-sm pointer-events-auto ${borders[t.type]} animate-slide-up transition-colors`}
        >
          {icons[t.type]}
          <span className="text-sm text-gray-800 dark:text-white font-medium transition-colors">
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}
