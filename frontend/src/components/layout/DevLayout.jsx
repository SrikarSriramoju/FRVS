import { useState } from "react";
import {
  Building2,
  ChevronRight,
  FileText,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Moon,
  Sun,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Avatar from "../common/Avatar";

const navItems = [
  { name: "dev-dashboard", label: "Analytics", icon: LayoutDashboard },
  { name: "dev-features", label: "Feature Management", icon: ListTodo },
  { name: "dev-reports", label: "Reports", icon: FileText },
];

export default function DevLayout({ children }) {
  const { currentUser, currentPage, navigate, logout, theme, toggleTheme } =
    useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col
        transform transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">FRVS</p>
            <p className="text-slate-400 text-xs mt-0.5">Developer Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-2 mb-2">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage.name === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.name);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/60 mb-2">
            {currentUser && <Avatar name={currentUser.name} size="sm" />}
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">
                {currentUser?.name}
              </p>
              <p className="text-slate-500 text-xs truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 mb-2">
            <Building2 size={13} className="text-slate-400 flex-shrink-0" />
            <p className="text-slate-400 text-xs truncate">
              {currentUser?.organization || "Organization"}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/30 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <p className="text-slate-500 text-xs font-mono truncate">
              {currentUser?.productKey?.slice(0, 20)}...
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              Theme
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg text-sm transition-colors"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 lg:hidden sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white text-sm transition-colors">
                FRVS Developer
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="ml-auto p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
