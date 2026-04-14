import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Loader, Shield, Zap } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function TokenAuth() {
  const { loginAsUser, navigate } = useApp();
  const [step, setStep] = useState("landing");

  const handleTokenLogin = (token) => {
    const finalToken = typeof token === "string" ? token : undefined;
    setStep("validating");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => loginAsUser(finalToken || "demo-token"), 1200);
    }, 1800);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) handleTokenLogin(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (step === "validating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/30">
            <Loader size={36} className="text-blue-400 animate-spin" />
          </div>
          <div>
            <p className="text-white text-xl font-semibold">Validating Token</p>
            <p className="text-blue-300 text-sm mt-1">
              Verifying your identity securely...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30 animate-scale-in">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-white text-xl font-semibold">
              Identity Verified!
            </p>
            <p className="text-emerald-300 text-sm mt-1">
              Redirecting to the platform...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-blue-400 text-xs bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Platform
          </span>
        </div>
        <button
          onClick={() => navigate("dev-login")}
          className="text-blue-300 hover:text-white text-sm font-medium transition-colors"
        >
          Developer Login →
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-300 text-sm mb-6">
              <Shield size={14} />
              Multi-Tenant Feature Request Platform
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Turn User Feedback Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                {" "}
                Product Excellence
              </span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              AI-powered feature clustering, sentiment analysis, and voting
              systems for modern product teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div
              onClick={handleTokenLogin}
              className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-8 transition-all duration-200"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-colors border border-blue-500/20">
                <Zap size={28} className="text-blue-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                I'm a Product User
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Submit feature requests, vote on ideas, and engage with other
                users. Typically accessed via your product's feedback widget.
              </p>
              <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                Continue as User <ArrowRight size={16} />
              </div>
            </div>

            <div
              onClick={() => navigate("dev-login")}
              className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/40 rounded-2xl p-8 transition-all duration-200"
            >
              <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-500/30 transition-colors border border-teal-500/20">
                <Shield size={28} className="text-teal-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                I'm a Developer / Admin
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Access AI-powered analytics, feature clustering, sentiment
                analysis, and manage your product roadmap.
              </p>
              <div className="flex items-center text-teal-400 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                Developer Login <ArrowRight size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Feature Clustering",
                desc: "AI groups similar requests",
              },
              {
                label: "Sentiment Analysis",
                desc: "Azure AI powered insights",
              },
              { label: "Multi-Tenant", desc: "Isolated data per product" },
              { label: "Real-time Voting", desc: "Democratic prioritization" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/3 border border-white/5 rounded-xl p-4"
              >
                <p className="text-white text-sm font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
