import { ThumbsUp, ThumbsDown, MessageSquare, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import Avatar from '../common/Avatar.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FeatureCard({ feature, onClick }) {
  const { voteFeature } = useApp();

  const handleVote = (e, type) => {
    e.stopPropagation();
    voteFeature(feature.id, type);
  };

  const total = feature.upvotes + feature.downvotes;
  const upPct = total > 0 ? (feature.upvotes / total) * 100 : 50;

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-150 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1.5 pt-0.5 flex-shrink-0">
          <button
            onClick={(e) => handleVote(e, 'UPVOTE')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
              feature.userVote === 'UPVOTE'
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10'
            }`}
          >
            <ThumbsUp size={16} className={feature.userVote === 'UPVOTE' ? 'fill-current' : ''} />
            <span className="text-xs font-semibold leading-none">{feature.upvotes}</span>
          </button>
          <button
            onClick={(e) => handleVote(e, 'DOWNVOTE')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
              feature.userVote === 'DOWNVOTE'
                ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
            }`}
          >
            <ThumbsDown size={16} className={feature.userVote === 'DOWNVOTE' ? 'fill-current' : ''} />
            <span className="text-xs font-semibold leading-none">{feature.downvotes}</span>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-slate-900 dark:text-white font-semibold text-base leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {feature.title}
            </h3>
            <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-400 dark:group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 transition-colors">{feature.description}</p>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar name={feature.userName} size="sm" />
                <span className="text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors">{feature.userName}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600 text-xs transition-colors">•</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs transition-colors">{formatDate(feature.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 transition-colors">
                <MessageSquare size={13} />
                <span className="text-xs">{feature.commentCount}</span>
              </div>
              <StatusBadge status={feature.status} />
            </div>
          </div>

          {total > 0 && (
            <div className="mt-3">
              <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${upPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{Math.round(upPct)}% upvoted</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{total} votes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
