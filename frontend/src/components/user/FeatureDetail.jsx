import { ArrowLeft, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import UserLayout from '../layout/UserLayout.jsx';
import CommentSection from './CommentSection.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import Avatar from '../common/Avatar.jsx';
import SubmitFeatureModal from './SubmitFeatureModal.jsx';
import { useState } from 'react';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function FeatureDetail() {
  const { currentPage, features, voteFeature, navigate } = useApp();
  const [showModal, setShowModal] = useState(false);

  const featureId = currentPage.params?.featureId;
  const feature = features.find((f) => f.id === featureId);

  if (!feature) {
    return (
      <UserLayout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-slate-500 dark:text-slate-400 transition-colors">Feature not found.</p>
          <button onClick={() => navigate('user-feed')} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors">
            Back to feed
          </button>
        </div>
      </UserLayout>
    );
  }

  const total = feature.upvotes + feature.downvotes;
  const upPct = total > 0 ? Math.round((feature.upvotes / total) * 100) : 0;

  return (
    <UserLayout onNewFeature={() => setShowModal(true)}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('user-feed')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to feed
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6 transition-colors">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <StatusBadge status={feature.status} />
                  {feature.clusterId && (
                    <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 px-2 py-0.5 rounded-full transition-colors">
                      AI Clustered
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight transition-colors">{feature.title}</h1>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-6 transition-colors">{feature.description}</p>

            <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400 flex-wrap border-t border-slate-100 dark:border-slate-800 pt-5 transition-colors">
              <div className="flex items-center gap-2">
                <Avatar name={feature.userName} size="sm" />
                <div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors">{feature.userName}</span>
                  <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">{feature.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 transition-colors">
                <Calendar size={14} />
                <span className="text-xs">{formatDate(feature.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 sm:px-8 py-5 transition-colors">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => voteFeature(feature.id, 'UPVOTE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    feature.userVote === 'UPVOTE'
                      ? 'bg-blue-600 dark:bg-blue-500/20 text-white dark:text-blue-400 shadow-sm dark:shadow-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <ThumbsUp size={15} className={feature.userVote === 'UPVOTE' ? 'fill-current' : ''} />
                  Upvote
                  <span className={`text-xs px-1.5 py-0.5 rounded transition-colors ${feature.userVote === 'UPVOTE' ? 'bg-blue-500 dark:bg-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {feature.upvotes}
                  </span>
                </button>
                <button
                  onClick={() => voteFeature(feature.id, 'DOWNVOTE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    feature.userVote === 'DOWNVOTE'
                      ? 'bg-rose-600 dark:bg-rose-500/20 text-white dark:text-rose-400 shadow-sm dark:shadow-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  <ThumbsDown size={15} className={feature.userVote === 'DOWNVOTE' ? 'fill-current' : ''} />
                  Downvote
                  <span className={`text-xs px-1.5 py-0.5 rounded transition-colors ${feature.userVote === 'DOWNVOTE' ? 'bg-rose-500 dark:bg-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {feature.downvotes}
                  </span>
                </button>
              </div>

              {total > 0 && (
                <div className="flex-1 min-w-40">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">
                    <span>{upPct}% positive</span>
                    <span>{total} total votes</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${upPct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 transition-colors">
          <CommentSection featureId={feature.id} />
        </div>
      </div>

      <SubmitFeatureModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </UserLayout>
  );
}
