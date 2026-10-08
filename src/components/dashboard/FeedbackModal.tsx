'use client';

import React, { useState } from 'react';
import { MessageSquareHeart, X, Loader2, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { submitFeedback } from '@/lib/actions/feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: string;
}

export default function FeedbackModal({ isOpen, onClose, userTier }: FeedbackModalProps) {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) {
      setError('Please write at least a few words.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      const result = await submitFeedback({
        message: message.trim(),
        rating,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      });

      if (result.ok) {
        setSuccess(true);
        setMessage('');
        setRating(null);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1400);
      } else {
        setError(result.error || 'Failed to send feedback.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStars = hoveredStar || rating || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Send Feedback</h3>
            <p className="text-xs text-zinc-400">Ideas, bugs, or feature requests — we read everything.</p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-2.5 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Thank you! Your feedback was recorded.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              How is Expansio? (optional)
            </label>
            <div className="flex items-center gap-1" onMouseLeave={() => setHoveredStars(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} of 5`}
                  onClick={() => setRating(star === rating ? null : star)}
                  onMouseEnter={() => setHoveredStars(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= activeStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-zinc-600 hover:text-zinc-400'
                    }`}
                  />
                </button>
              ))}
              {rating && (
                <span className="text-[11px] text-zinc-400 ml-2 font-mono">{rating}/5</span>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Your feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={3}
              maxLength={2000}
              rows={4}
              placeholder="e.g. I'd love a dark mode, or: the yearly export failed for me last night…"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
            <div className="text-[10px] text-zinc-500 mt-1 text-right font-mono">
              {message.length}/2000
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Submit Feedback</span>
            )}
          </button>

          <p className="text-[10px] text-zinc-500 text-center">
            Attached automatically: your account tier ({userTier}) and current page.
          </p>
        </form>
      </div>
    </div>
  );
}
