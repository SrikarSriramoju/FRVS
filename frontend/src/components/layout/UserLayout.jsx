import { Moon, Plus, LayoutGrid, LogOut, Sun, User, Zap } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Avatar from "../common/Avatar";

export default function UserLayout({ children, onNewFeature }) {
  const { currentUser, currentPage, navigate, logout, theme, toggleTheme } =
    useApp();

  const navItems = [
    { name: "user-feed", label: "Feature Feed", icon: LayoutGrid },
    { name: "user-activity", label: "My Activity", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={17} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white text-base tracking-tight transition-colors">
                FRVS
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-600 text-xs">
                |
              </span>
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors">
                {currentUser?.organization || "TechCorp"}
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage.name === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {onNewFeature && (
              <button
                onClick={onNewFeature}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New Request</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div className="flex items-center gap-2.5 ml-2">
              {currentUser && <Avatar name={currentUser.name} size="sm" />}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-none transition-colors">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex gap-1 transition-colors">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage.name === item.name;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 transition-colors">
        <Icon size={28} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-slate-700 dark:text-slate-200 font-semibold text-lg mb-1 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs transition-colors">
        {description}
      </p>
    </div>
  );
}
