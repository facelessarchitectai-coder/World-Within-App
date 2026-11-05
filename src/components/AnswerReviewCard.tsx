import React from 'react';
import { AnswerReviewFeedback, IssueCategory } from '../services/answerReview';
import { CheckCircle2, AlertTriangle, HelpCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AnswerReviewCardProps {
  feedback: AnswerReviewFeedback | null;
  isLoading?: boolean;
  onClose?: () => void;
  onFocusInput?: () => void;
  className?: string;
}

const CATEGORY_META: Record<IssueCategory, { label: string; color: string; border: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  missing_required: {
    label: 'Missing Required Element',
    color: 'text-ww-pink-deep',
    border: 'border-ww-pink-deep/30',
    bg: 'bg-ww-pink-deep/10',
    icon: AlertTriangle,
  },
  unclear_explanation: {
    label: 'Unclear Explanation',
    color: 'text-amber-400',
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/10',
    icon: HelpCircle,
  },
  contradiction: {
    label: 'Contradiction to Clarify',
    color: 'text-ww-pink-rose',
    border: 'border-ww-pink-rose/30',
    bg: 'bg-ww-pink-rose/10',
    icon: AlertTriangle,
  },
  optional_opportunity: {
    label: 'Opportunity to Explore',
    color: 'text-ww-cyan',
    border: 'border-ww-cyan/30',
    bg: 'bg-ww-cyan/10',
    icon: Sparkles,
  },
  ready: {
    label: 'Meets Requirements',
    color: 'text-ww-cyan',
    border: 'border-ww-cyan/40',
    bg: 'bg-ww-cyan/10',
    icon: CheckCircle2,
  },
};

export default function AnswerReviewCard({
  feedback,
  isLoading,
  onClose,
  onFocusInput,
  className,
}: AnswerReviewCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 border border-ww-cyan/20 bg-ww-cyan/5 text-ww-cyan text-xs font-mono flex items-center gap-3 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-ww-cyan animate-ping" />
        <span className="tracking-widest uppercase">World Within Method: Reviewing answer against step criteria...</span>
      </div>
    );
  }

  if (!feedback) return null;

  const category = CATEGORY_META[feedback.issueCategory] || CATEGORY_META.unclear_explanation;
  const IconComponent = category.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative border p-5 md:p-6 space-y-4 rounded-none text-left backdrop-blur-sm transition-all",
          category.border,
          category.bg,
          className
        )}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <IconComponent className={cn("w-4 h-4 shrink-0", category.color)} />
            <span className={cn("text-[10px] font-black tracking-[2px] uppercase", category.color)}>
              {category.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
              Answer Review
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Dismiss feedback"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Resolved Notes if this was a revision */}
        {feedback.resolvedNotes && (
          <div className="p-3 bg-ww-cyan/10 border border-ww-cyan/25 flex items-start gap-2.5 text-xs text-ww-cyan">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest block opacity-80">
                Resolved from your previous response:
              </span>
              <p className="font-medium text-[11px] leading-relaxed text-white/90">
                {feedback.resolvedNotes}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {feedback.meetsRequirements ? (
          <div className="space-y-2">
            <div className="text-[10px] font-black tracking-[2px] uppercase text-ww-cyan">
              Ready to move forward
            </div>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
              {feedback.readyToMoveForwardExplanation ||
                "Your answer directly addresses the question and meets the requirements for this step."}
            </p>
          </div>
        ) : (
          /* REVISION NEEDED STATE: EXACT 3-PART STRUCTURE */
          <div className="space-y-4">
            {/* 1. What needs attention */}
            {feedback.whatNeedsAttention && (
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-[2px] uppercase text-white/50 block">
                  What needs attention
                </span>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
                  {feedback.whatNeedsAttention}
                </p>
              </div>
            )}

            {/* 2. Direction to explore */}
            {feedback.directionToExplore && (
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-[2px] uppercase text-ww-cyan block">
                  Direction to explore
                </span>
                <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
                  {feedback.directionToExplore}
                </p>
              </div>
            )}

            {/* 3. Question to help you revise */}
            {feedback.questionToHelpRevise && (
              <div className="space-y-1 bg-black/30 p-3.5 border border-white/10">
                <span className="text-[10px] font-black tracking-[2px] uppercase text-amber-300 block">
                  Question to help you revise
                </span>
                <p className="text-xs md:text-sm text-white/95 leading-relaxed font-semibold italic">
                  "{feedback.questionToHelpRevise}"
                </p>
              </div>
            )}

            {onFocusInput && (
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>Develop your revision above without adding generic filler.</span>
                <button
                  type="button"
                  onClick={onFocusInput}
                  className="flex items-center gap-1 text-ww-cyan hover:underline font-bold"
                >
                  <span>Edit answer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
