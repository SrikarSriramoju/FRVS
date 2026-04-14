import { useEffect, useState } from "react";
import {
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import UserLayout from "../layout/UserLayout.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import SubmitFeatureModal from "./SubmitFeatureModal.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyActivity() {
  const { activity, navigate, fetchActivity } = useApp();
  const [tab, setTab] = useState("features");
  const [showModal, setShowModal] = useState(false);

  const myFeatures = activity.requests;
  const myComments = activity.comments;
  const upvotedFeatures = activity.votedFeatures.filter(
    (f) => f.userVote === "UPVOTE",
  );
  const downvotedFeatures = activity.votedFeatures.filter(
    (f) => f.userVote === "DOWNVOTE",
  );

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const tabs = [
    {
      key: "features",
      label: "My Requests",
      icon: Lightbulb,
      count: myFeatures.length,
    },
    {
      key: "comments",
      label: "My Comments",
      icon: MessageSquare,
      count: myComments.length,
    },
    {
      key: "votes",
      label: "My Votes",
      icon: ThumbsUp,
      count:
        upvotedFeatures.length +
        downvotedFeatures.length +
        activity.votedComments.length,
    },
  ];

  return (
    <UserLayout onNewFeature={() => setShowModal(true)}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">
            My Activity
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            Track your feature requests, comments, and votes
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Requests", value: myFeatures.length, color: "blue" },
            { label: "Comments", value: myComments.length, color: "teal" },
            {
              label: "Votes Cast",
              value:
                upvotedFeatures.length +
                downvotedFeatures.length +
                activity.votedComments.length,
              color: "emerald",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center transition-colors`}
            >
              <p
                className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1 transition-colors`}
              >
                {stat.value}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors">
          <div className="flex border-b border-slate-100 dark:border-slate-800 transition-colors">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${
                    tab === t.key
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full transition-colors ${tab === t.key ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
                  >
                    {t.count}
                  </span>
                  {tab === t.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {tab === "features" && (
              <>
                {myFeatures.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Lightbulb
                        size={24}
                        className="text-slate-400 dark:text-slate-500"
                      />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-1 transition-colors">
                      No requests yet
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mb-4 transition-colors">
                      Submit your first feature request to get started.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={15} /> New Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myFeatures.map((f) => (
                      <div
                        key={f.id}
                        onClick={() =>
                          navigate("user-feature-detail", { featureId: f.id })
                        }
                        className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 cursor-pointer transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 dark:text-slate-200 font-medium text-sm line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {f.title}
                          </p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 transition-colors">
                            {formatDate(f.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs transition-colors">
                            <ThumbsUp size={12} />
                            <span>{f.upvotes}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs transition-colors">
                            <MessageSquare size={12} />
                            <span>{f.commentCount}</span>
                          </div>
                          <StatusBadge status={f.status} />
                          <ArrowRight
                            size={14}
                            className="text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "comments" && (
              <>
                {myComments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                      <MessageSquare
                        size={24}
                        className="text-slate-400 dark:text-slate-500"
                      />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-1 transition-colors">
                      No comments yet
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">
                      Start engaging with the community!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myComments.map((c) => {
                      const feature =
                        activity.requests.find((f) => f.id === c.featureId) ||
                        activity.votedFeatures.find(
                          (f) => f.id === c.featureId,
                        );
                      return (
                        <div
                          key={c.id}
                          onClick={() =>
                            navigate("user-feature-detail", {
                              featureId: c.featureId,
                            })
                          }
                          className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-500/50 cursor-pointer transition-all group"
                        >
                          <p className="text-slate-500 dark:text-slate-400 text-xs mb-1.5 font-medium transition-colors">
                            On:{" "}
                            <span className="text-blue-600 dark:text-blue-400 group-hover:underline transition-colors">
                              {feature?.title || "Unknown feature"}
                            </span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 transition-colors">
                            {c.content}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                              {formatDate(c.createdAt)}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs transition-colors">
                              <ThumbsUp size={11} /> {c.upvotes}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {tab === "votes" && (
              <div className="space-y-5">
                {upvotedFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 transition-colors">
                      <ThumbsUp size={14} className="text-blue-500" /> Upvoted (
                      {upvotedFeatures.length})
                    </h4>
                    <div className="space-y-2">
                      {upvotedFeatures.map((f) => (
                        <div
                          key={f.id}
                          onClick={() =>
                            navigate("user-feature-detail", { featureId: f.id })
                          }
                          className="flex items-center gap-3 p-3 border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors group"
                        >
                          <ThumbsUp
                            size={14}
                            className="text-blue-500 flex-shrink-0 fill-current"
                          />
                          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium flex-1 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {f.title}
                          </p>
                          <StatusBadge status={f.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {downvotedFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 transition-colors">
                      <ThumbsDown size={14} className="text-rose-500" />{" "}
                      Downvoted ({downvotedFeatures.length})
                    </h4>
                    <div className="space-y-2">
                      {downvotedFeatures.map((f) => (
                        <div
                          key={f.id}
                          onClick={() =>
                            navigate("user-feature-detail", { featureId: f.id })
                          }
                          className="flex items-center gap-3 p-3 border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 rounded-lg cursor-pointer hover:border-rose-300 dark:hover:border-rose-500/50 transition-colors group"
                        >
                          <ThumbsDown
                            size={14}
                            className="text-rose-500 flex-shrink-0 fill-current"
                          />
                          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium flex-1 line-clamp-1 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                            {f.title}
                          </p>
                          <StatusBadge status={f.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {upvotedFeatures.length === 0 &&
                  downvotedFeatures.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                        <ThumbsUp
                          size={24}
                          className="text-slate-400 dark:text-slate-500"
                        />
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium mb-1 transition-colors">
                        No votes yet
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">
                        Browse the feed and vote on features that matter to you!
                      </p>
                    </div>
                  )}

                {activity.votedComments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 transition-colors">
                      <MessageSquare size={14} className="text-teal-500" />{" "}
                      Comment Votes ({activity.votedComments.length})
                    </h4>
                    <div className="space-y-2">
                      {activity.votedComments.map((comment) => (
                        <div
                          key={comment.id}
                          onClick={() =>
                            navigate("user-feature-detail", {
                              featureId: comment.featureId,
                            })
                          }
                          className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg cursor-pointer hover:border-teal-300 dark:hover:border-teal-500/50 transition-colors group"
                        >
                          <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 transition-colors">
                            {comment.userVote === "UPVOTE"
                              ? "Upvoted comment"
                              : "Downvoted comment"}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-1 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <SubmitFeatureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </UserLayout>
  );
}
