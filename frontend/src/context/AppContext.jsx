import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState({ name: "token-auth" });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("frvs_theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });
  const [features, setFeatures] = useState([]);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState({
    requests: [],
    comments: [],
    votedFeatures: [],
    votedComments: [],
  });
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  const navigate = useCallback((name, params) => {
    setCurrentPage({ name, params });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const fetchFeatures = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await api.get("/features");
      setFeatures(res.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load features", "error");
    }
  }, [currentUser, showToast]);

  const fetchComments = useCallback(
    async (featureId) => {
      try {
        const res = await api.get(`/comments?featureId=${featureId}`);
        setComments(res.data);
      } catch (e) {
        console.error(e);
        showToast("Failed to load comments", "error");
      }
    },
    [showToast],
  );

  const fetchActivity = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await api.get("/activity/me");
      setActivity({
        requests: res.data.requests || [],
        comments: res.data.comments || [],
        votedFeatures: res.data.votedFeatures || [],
        votedComments: res.data.votedComments || [],
      });
    } catch (e) {
      console.error(e);
      showToast("Failed to load activity", "error");
    }
  }, [currentUser, showToast]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("frvs_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      fetchFeatures();
      fetchActivity();
    }
  }, [currentUser, fetchActivity, fetchFeatures]);

  const loginAsUser = useCallback(
    async (token) => {
      try {
        const res = await api.post(
          `/auth/token?token=${token || "demo-token"}`,
        );
        localStorage.setItem("token", res.data.token);
        setCurrentUser(res.data.user);
        navigate("user-feed");
        showToast("Authenticated successfully");
      } catch (e) {
        showToast("Failed to authenticate with token", "error");
      }
    },
    [navigate, showToast],
  );

  const loginAsDeveloper = useCallback(
    async (email, password) => {
      try {
        const res = await api.post("/auth/dev/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setCurrentUser(res.data.user);
        navigate("dev-dashboard");
        showToast("Welcome back, Developer!");
        return true;
      } catch (e) {
        showToast("Invalid credentials", "error");
        return false;
      }
    },
    [navigate, showToast],
  );

  const registerDeveloper = useCallback(
    async (name, email, organization, password) => {
      try {
        const res = await api.post("/auth/dev/register", {
          name,
          email,
          organization,
          password,
        });
        localStorage.setItem("token", res.data.token);
        setCurrentUser(res.data.user);
        navigate("dev-dashboard");
        showToast("Developer account created!");
        return true;
      } catch (e) {
        showToast("Registration failed. Email might exist.", "error");
        return false;
      }
    },
    [navigate, showToast],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setFeatures([]);
    setComments([]);
    setActivity({
      requests: [],
      comments: [],
      votedFeatures: [],
      votedComments: [],
    });
    navigate("token-auth");
  }, [navigate]);

  const submitFeature = useCallback(
    async (title, description) => {
      try {
        await api.post("/features", { title, description });
        showToast("Feature request submitted successfully!");
        fetchFeatures();
        fetchActivity();
      } catch (e) {
        showToast("Failed to submit feature", "error");
      }
    },
    [fetchActivity, fetchFeatures, showToast],
  );

  const voteFeature = useCallback(
    async (featureId, voteType) => {
      try {
        await api.post(`/features/${featureId}/vote?type=${voteType}`);
        fetchFeatures();
        fetchActivity();
      } catch (e) {
        showToast("Failed to vote on feature", "error");
      }
    },
    [fetchActivity, fetchFeatures, showToast],
  );

  const addComment = useCallback(
    async (featureId, content, parentId) => {
      try {
        await api.post("/comments", { featureId, content, parentId });
        showToast("Comment posted!");
        fetchComments(featureId);
        fetchFeatures();
        fetchActivity();
      } catch (e) {
        showToast("Failed to post comment", "error");
      }
    },
    [fetchActivity, fetchComments, fetchFeatures, showToast],
  );

  const voteComment = useCallback(
    async (commentId, voteType, featureId) => {
      try {
        await api.post(`/comments/${commentId}/vote?type=${voteType}`);
        fetchComments(featureId);
        fetchActivity();
      } catch (e) {
        showToast("Failed to vote on comment", "error");
      }
    },
    [fetchActivity, fetchComments, showToast],
  );

  const updateFeatureStatus = useCallback(
    async (featureId, status) => {
      try {
        await api.put(`/features/${featureId}/status?status=${status}`);
        showToast(`Status updated to ${String(status).replace("_", " ")}`);
        fetchFeatures();
      } catch (e) {
        showToast("Failed to update status", "error");
      }
    },
    [fetchFeatures, showToast],
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        theme,
        features,
        comments,
        activity,
        toasts,
        toggleTheme,
        navigate,
        loginAsUser,
        loginAsDeveloper,
        registerDeveloper,
        logout,
        submitFeature,
        voteFeature,
        addComment,
        voteComment,
        updateFeatureStatus,
        showToast,
        fetchFeatures,
        fetchComments,
        fetchActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
