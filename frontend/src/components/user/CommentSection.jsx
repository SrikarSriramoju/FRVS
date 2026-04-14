import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CornerDownRight, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import Avatar from '../common/Avatar.jsx';

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CommentItem({ comment, featureId, depth = 0 }) {
  const { voteComment, addComment, currentUser } = useApp();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVote = (type) => voteComment(comment.id, type, featureId);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addComment(featureId, replyText.trim(), comment.id);
      setReplyText('');
      setShowReply(false);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-slate-100 dark:border-slate-800 pl-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar name={comment.userName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors">{comment.userName}</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs transition-colors">{formatDate(comment.createdAt)}</span>
              {comment.userId === currentUser?.id && (
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors">You</span>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed transition-colors">{comment.content}</p>
          </div>

          <div className="flex items-center gap-3 mt-2 ml-1">
            <button
              onClick={() => handleVote('UPVOTE')}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.userVote === 'UPVOTE' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <ThumbsUp size={13} className={comment.userVote === 'UPVOTE' ? 'fill-current' : ''} />
              <span>{comment.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote('DOWNVOTE')}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.userVote === 'DOWNVOTE' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400'
              }`}
            >
              <ThumbsDown size={13} className={comment.userVote === 'DOWNVOTE' ? 'fill-current' : ''} />
              <span>{comment.downvotes}</span>
            </button>
            {depth === 0 && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <CornerDownRight size={13} />
                Reply
              </button>
            )}
          </div>

          {showReply && (
            <form onSubmit={handleReply} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 text-sm bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!replyText.trim() || submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} featureId={featureId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ featureId }) {
  const { comments, addComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const featureComments = comments.filter((c) => c.featureId === featureId && !c.parentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addComment(featureId, newComment.trim());
      setNewComment('');
      setSubmitting(false);
    }, 400);
  };

  return (
    <div>
      <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2 transition-colors">
        Comments
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full transition-colors">{featureComments.length}</span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          placeholder="Share your thoughts on this feature..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all resize-none mb-2"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Send size={14} />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {featureComments.length === 0 ? (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500 transition-colors">
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {featureComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} featureId={featureId} />
          ))}
        </div>
      )}
    </div>
  );
}
