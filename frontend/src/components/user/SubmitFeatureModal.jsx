import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function SubmitFeatureModal({ isOpen, onClose }) {
  const { submitFeature } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      submitFeature(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a Feature Request" size="md">
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-5 border border-blue-100 dark:border-blue-800/50 transition-colors">
        <Lightbulb size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium transition-colors">Tip for better results</p>
          <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5 leading-relaxed transition-colors">
            Be specific and describe the problem you're trying to solve. Our AI will group similar requests to help developers prioritize.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5 block transition-colors">
            Feature Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Add dark mode to the dashboard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
          />
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 text-right transition-colors">{title.length}/120</p>
        </div>

        <div>
          <label className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5 block transition-colors">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describe the feature you'd like to see. Include why it's important to you and how you'd use it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            maxLength={1000}
            className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all resize-none"
          />
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 text-right transition-colors">{description.length}/1000</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
