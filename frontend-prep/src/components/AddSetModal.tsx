import React, { useState } from "react";
import { FolderPlus, X } from "lucide-react";

interface AddSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

export const AddSetModal: React.FC<AddSetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");



  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Set name cannot be empty.");
      return;
    }
    onAdd(name, description);
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
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-xl overflow-hidden transform transition-all z-10 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-accent-600/10 to-brand-600/10 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">
              Create Question Set
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
              Set / Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Web Security, System Design"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm font-medium"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              placeholder="Briefly describe what topics this question set covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm resize-y"
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
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
            >
              Create Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
