import { useState } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Clock, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import UserLayout from '../layout/UserLayout.jsx';
import FeatureCard from './FeatureCard.jsx';
import SubmitFeatureModal from './SubmitFeatureModal.jsx';

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export default function FeatureFeed() {
  const { features, currentUser, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState('trending');
  const [showModal, setShowModal] = useState(false);

  const productFeatures = features.filter((f) => f.productKey === currentUser?.productKey);

  const filtered = productFeatures
    .filter((f) => statusFilter === 'ALL' || f.status === statusFilter)
    .filter((f) =>
      !search || f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'votes') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.upvotes * 2 + b.commentCount) - (a.upvotes * 2 + a.commentCount);
    });

  return (
    <UserLayout onNewFeature={() => setShowModal(true)}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Feature Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            {productFeatures.length} requests from the community — vote for what matters to you
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-5 space-y-3 transition-colors">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search feature requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 transition-colors">
              {[
                { key: 'trending', icon: TrendingUp, label: 'Trending' },
                { key: 'votes', icon: SlidersHorizontal, label: 'Top Voted' },
                { key: 'newest', icon: Clock, label: 'Newest' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      sort === s.key ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={12} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Lightbulb size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-slate-700 dark:text-slate-200 font-semibold text-lg mb-1 transition-colors">No features found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">Try adjusting your filters or be the first to submit a request!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onClick={() => navigate('user-feature-detail', { featureId: feature.id })}
              />
            ))}
          </div>
        )}
      </div>

      <SubmitFeatureModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </UserLayout>
  );
}
