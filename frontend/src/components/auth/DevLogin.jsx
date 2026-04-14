import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function DevLogin() {
  const { loginAsDeveloper, registerDeveloper, navigate, showToast } = useApp();
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    organization: "",
    password: "",
    confirm: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = loginAsDeveloper(loginForm.email, loginForm.password);
      if (!ok) showToast("Invalid credentials", "error");
      setLoading(false);
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      !regForm.name ||
      !regForm.email ||
      !regForm.organization ||
      !regForm.password
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (regForm.password !== regForm.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (
      !regForm.email.includes("@") ||
      !regForm.email.split("@")[1]?.includes(".")
    ) {
      showToast("Please use a valid organization email", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      registerDeveloper(
        regForm.name,
        regForm.email,
        regForm.organization,
        regForm.password,
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            FRVS
          </span>
        </div>
        <button
          onClick={() => navigate("token-auth")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
              <Building2 size={32} className="text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Developer Portal</h1>
            <p className="text-slate-400 text-sm mt-1">
              Access your product analytics and insights
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3.5 text-sm font-medium transition-all ${
                    tab === t
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <div className="p-7">
              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Organization Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-1 text-xs text-slate-500 bg-white/3 rounded-lg p-3 border border-white/5">
                    Demo:{" "}
                    <span className="text-blue-400">dev@techcorp.com</span> /
                    password
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors text-sm mt-2"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={regForm.name}
                        onChange={(e) =>
                          setRegForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Organization Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={regForm.email}
                        onChange={(e) =>
                          setRegForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Organization Name
                    </label>
                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="TechCorp Inc."
                        value={regForm.organization}
                        onChange={(e) =>
                          setRegForm((p) => ({
                            ...p,
                            organization: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={regForm.password}
                        onChange={(e) =>
                          setRegForm((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Repeat password"
                        value={regForm.confirm}
                        onChange={(e) =>
                          setRegForm((p) => ({ ...p, confirm: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors text-sm mt-2"
                  >
                    {loading
                      ? "Creating account..."
                      : "Create Developer Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
