import React, { useState } from "react";
import type { QuestionSet } from "../types";
import { X, Plus, Sparkles } from "lucide-react";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, answer: string, setId: string) => void;
  sets: QuestionSet[];
  activeSetId: string;
  onOpenAddSet?: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  sets,
  activeSetId,
  onOpenAddSet,
}) => {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [setId, setSetId] = useState(() => {
    if (activeSetId !== "all" && sets.some(s => s.id === activeSetId)) {
      return activeSetId;
    }
    return sets[0]?.id || "";
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  if (sets.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal Card */}
        <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-xl overflow-hidden transform transition-all z-10 p-6 flex flex-col items-center text-center animate-scaleUp">
          <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">
            No Subject Categories Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You must create at least one subject category (like History, Science, or Tech) before you can add questions.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenAddSet) {
                  onOpenAddSet();
                }
              }}
              className="px-4 py-2 text-sm font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition cursor-pointer"
            >
              Create Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Question text cannot be empty.");
      return;
    }
    onAdd(text, answer, setId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-xl overflow-hidden transform transition-all z-10 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-accent-600/10 to-brand-600/10 border-b border-slate-200/50 dark:border-slate-850/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">
              Create New Question
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Topic Category
            </label>
            <select
              value={setId}
              onChange={(e) => setSetId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer"
            >
              {sets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question Title
            </label>
            <input
              type="text"
              placeholder="e.g. What is the difference between map and forEach?"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Answer / Explanation (Optional)
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                You can write block code with ```javascript
              </span>
            </div>
            <textarea
              placeholder="Write explanation or notes... If left empty, you can edit it later from the card."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full min-h-[160px] font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-y"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-xl bg-accent-600 hover:bg-accent-700 text-white shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
