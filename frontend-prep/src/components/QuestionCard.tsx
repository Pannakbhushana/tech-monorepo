import React, { useState, useEffect, useRef } from "react";
import type { Question, QuestionSet } from "../types";
import { Eye, EyeOff, Edit3, Trash2, Check, X, Save } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface QuestionCardProps {
  question: Question;
  serialNumber: number;
  sets: QuestionSet[];
  onToggleRevised: (id: string) => void;
  onUpdate: (id: string, text: string, answer: string, setId?: string) => void;
  onDelete: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  serialNumber,
  sets,
  onToggleRevised,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Edit form states
  const [editText, setEditText] = useState(question.text);
  const [editAnswer, setEditAnswer] = useState(question.answer);
  const [editSetId, setEditSetId] = useState(question.setId);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleStartEdit = () => {
    setEditText(question.text);
    setEditAnswer(question.answer);
    setEditSetId(question.setId);
    setIsEditing(true);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editAnswer]);

  const handleSave = () => {
    if (!editText.trim()) return;
    onUpdate(question.id, editText, editAnswer, editSetId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(question.text);
    setEditAnswer(question.answer);
    setEditSetId(question.setId);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Custom Formatter for Code and formatting in Answers
  const formatAnswerContent = (text: string) => {
    if (!text.trim()) {
      return (
        <p className="text-slate-400 dark:text-slate-500 italic text-sm py-2">
          No answer added yet. Click the edit icon to add your notes, explanation, or code snippets.
        </p>
      );
    }

    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      // Check if this part is a block of code
      if (part.startsWith("```") && part.endsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "";
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} className="my-3 font-mono text-sm bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto border border-slate-800 dark:border-slate-900 relative group max-w-full">
            {language && (
              <span className="absolute top-2 right-2 text-[10px] text-slate-500 tracking-wider uppercase font-bold select-none bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                {language}
              </span>
            )}
            <pre className="whitespace-pre overflow-x-auto leading-relaxed">{code.trim()}</pre>
          </div>
        );
      } else {
        // Handle inline code `code`
        const subParts = part.split(/(`[^`\n]+`)/g);
        return (
          <span key={index} className="leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {subParts.map((subPart, subIndex) => {
              if (subPart.startsWith("`") && subPart.endsWith("`")) {
                return (
                  <code key={subIndex} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-xs border border-slate-200 dark:border-slate-700 font-semibold">
                    {subPart.slice(1, -1)}
                  </code>
                );
              }
              // Normal text: handle newlines properly
              return subPart.split("\n").map((line, lineIdx, array) => (
                <span key={lineIdx}>
                  {line}
                  {lineIdx < array.length - 1 && <br />}
                </span>
              ));
            })}
          </span>
        );
      }
    });
  };

  const activeSetName = sets.find((s) => s.id === question.setId)?.name || "General";

  return (
    <div 
      className={`glass-panel border rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-300 relative group
        ${question.isRevised 
          ? "border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/5 opacity-80" 
          : "border-slate-200 dark:border-slate-800/60 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
        }
        ${isEditing ? "ring-2 ring-accent-500 dark:ring-accent-400/50" : ""}
      `}
    >
      {/* Active edit state */}
      {isEditing ? (
        <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">
              Editing Question #{serialNumber}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-400">Category:</label>
              <select
                value={editSetId}
                onChange={(e) => setEditSetId(e.target.value)}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-500 font-medium cursor-pointer"
              >
                {sets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question Text</label>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-base font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 shadow-inner"
              placeholder="Enter question..."
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Answer / Notes</label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Supports code formatting: block code with ```javascript, inline code with `code`
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="w-full min-h-[140px] font-mono text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-100 shadow-inner resize-y"
              placeholder="Write your answer, code examples, or explanations here..."
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-semibold">Ctrl + Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-semibold">Esc</kbd> to cancel
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal question card display */
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Custom Interactive Checkbox */}
            <button
              onClick={() => onToggleRevised(question.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-500/50 cursor-pointer
                ${question.isRevised
                  ? "bg-emerald-500 border-emerald-500 text-white scale-100"
                  : "border-slate-300 dark:border-slate-600 text-transparent hover:border-accent-500 dark:hover:border-accent-400 hover:scale-105"
                }
              `}
              aria-label={question.isRevised ? "Mark as unrevised" : "Mark as revised"}
            >
              {question.isRevised && (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" className="animate-checkmark" />
                </svg>
              )}
            </button>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50 select-none">
                  #{serialNumber}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/40 dark:border-brand-900/40 px-2 py-0.5 rounded-md">
                  {activeSetName}
                </span>
                {question.isRevised && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/40 dark:border-emerald-900/40 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    Revised
                  </span>
                )}
              </div>
              <h3 
                onClick={() => setShowAnswer(!showAnswer)}
                className={`text-base font-bold text-slate-800 dark:text-slate-100 leading-snug cursor-pointer hover:text-accent-600 dark:hover:text-accent-400 transition select-text
                  ${question.isRevised ? "line-through text-slate-400 dark:text-slate-500" : ""}
                `}
              >
                {question.text}
              </h3>
            </div>

            {/* Quick Actions (Hover visible on desktop, always visible on mobile) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleStartEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-accent-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Question & Answer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Delete Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reveal toggle button & Answer Content block */}
          <div className="pl-9 sm:pl-10 mt-1">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition cursor-pointer
                ${showAnswer
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-950/70"
                }
              `}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Reveal Answer
                </>
              )}
            </button>

            {/* Answer Display */}
            {showAnswer && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn">
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm">
                  {formatAnswerContent(question.answer)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => onDelete(question.id)}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action is permanent and cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
};
