import { useEffect } from "react";
import { X } from "lucide-react";

const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" };

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 w-full ${sizes[size]} max-h-[90vh] flex flex-col transition-colors`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
