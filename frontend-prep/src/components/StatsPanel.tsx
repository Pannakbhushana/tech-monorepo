import React from "react";
import { CheckCircle, ListTodo, HelpCircle, Trophy } from "lucide-react";

interface StatsPanelProps {
  total: number;
  revised: number;
  pending: number;
  activeSetName: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  total,
  revised,
  pending,
  activeSetName,
}) => {
  const percent = total > 0 ? Math.round((revised / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Progress */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        
        {/* Radial Progress Circle */}
        <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="26"
              cx="32"
              cy="32"
            />
            <circle
              className="text-accent-500 dark:text-accent-400 transition-all duration-500 ease-out"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 26}
              strokeDashoffset={2 * Math.PI * 26 * (1 - percent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="26"
              cx="32"
              cy="32"
            />
          </svg>
          <span className="absolute text-sm font-bold font-heading text-slate-800 dark:text-slate-100">
            {percent}%
          </span>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {activeSetName} Progress
          </h4>
          <p className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100 mt-0.5">
            {percent === 100 ? "All Done! 🎉" : `${revised} of ${total}`}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            {percent === 100 && (
              <>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Fully Mastered!</span>
              </>
            )}
            {percent < 100 && percent > 0 && <span>Great progress, keep going!</span>}
            {percent === 0 && total > 0 && <span>Ready to start revising!</span>}
            {total === 0 && <span>No questions in this set</span>}
          </span>
        </div>
      </div>

      {/* Total Questions Card */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="p-3 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Questions
          </h4>
          <p className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 mt-0.5">
            {total}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Across active filters
          </span>
        </div>
      </div>

      {/* Pending Questions Card */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
          <ListTodo className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Remaining (Queue)
          </h4>
          <p className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 mt-0.5">
            {pending}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Needs review
          </span>
        </div>
      </div>

      {/* Completed Questions Card */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Revised (Done)
          </h4>
          <p className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 mt-0.5">
            {revised}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ready to test again
          </span>
        </div>
      </div>
    </div>
  );
};
