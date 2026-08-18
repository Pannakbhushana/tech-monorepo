import { useState } from "react";
import { usePrepStore } from "./hooks/usePrepStore";
import { StatsPanel } from "./components/StatsPanel";
import { QuestionCard } from "./components/QuestionCard";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { AddSetModal } from "./components/AddSetModal";
import { BackupModal } from "./components/BackupModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { 
  Plus, 
  Menu, 
  X, 
  Search, 
  Database, 
  Sparkles, 
  Sun, 
  Moon, 
  Laptop, 
  Trash2, 
  RotateCcw, 
  FolderPlus, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
}

function App() {
  const store = usePrepStore();
  
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme dropdown state
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  // Modals visibility state
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddSetOpen, setIsAddSetOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Custom confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);

  const activeSet = store.sets.find((s) => s.id === store.activeSetId);
  const activeSetName = store.activeSetId === "all" ? "All Subjects" : activeSet?.name || "Subject";
  const activeSetDesc = store.activeSetId === "all" 
    ? "Review all questions across all subjects and categories." 
    : activeSet?.description || "Subject-specific preparation questions.";

  // Calculate statistics for the active set
  const setQuestions = store.questions.filter(
    (q) => store.activeSetId === "all" || q.setId === store.activeSetId
  );
  const totalInSet = setQuestions.length;
  const revisedInSet = setQuestions.filter((q) => q.isRevised).length;
  const pendingInSet = totalInSet - revisedInSet;

  // Handle set deletion
  const handleDeleteSet = (setId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the set
    setConfirmConfig({
      title: "Delete Category",
      message: `Are you sure you want to delete the category "${name}"? This will also delete all its questions!`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => store.deleteSet(setId),
    });
  };

  // Bulk actions
  const handleResetSetProgress = () => {
    setConfirmConfig({
      title: "Reset Progress",
      message: `Restore all completed questions in "${activeSetName}" back to the revision queue?`,
      confirmText: "Reset",
      variant: "warning",
      onConfirm: () => store.resetSetQuestions(store.activeSetId),
    });
  };

  const handleMarkAllAsDone = () => {
    const pendingIds = store.filteredQuestions.filter(q => !q.isRevised).map(q => q.id);
    if (pendingIds.length === 0) return;
    setConfirmConfig({
      title: "Mark All Revised",
      message: `Mark all ${pendingIds.length} pending questions in this view as revised?`,
      confirmText: "Mark Revised",
      variant: "info",
      onConfirm: () => store.markQuestionsAsRevised(pendingIds),
    });
  };

  const handleRestoreAllDone = () => {
    const revisedIds = store.filteredQuestions.filter(q => q.isRevised).map(q => q.id);
    if (revisedIds.length === 0) return;
    setConfirmConfig({
      title: "Restore All to Queue",
      message: `Add all ${revisedIds.length} completed questions back to your revision queue?`,
      confirmText: "Restore",
      variant: "info",
      onConfirm: () => store.restoreQuestions(revisedIds),
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      
      {/* 1. COLLAPSIBLE SIDEBAR FOR MOBILE & PERSISTENT FOR DESKTOP */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 flex flex-col transition-transform duration-350 ease-in-out md:translate-x-0 md:static md:h-screen shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between bg-gradient-to-r from-accent-600/5 to-brand-600/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-600 via-accent-500 to-brand-500 flex items-center justify-center text-white shadow-md glow-accent shrink-0 select-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5.5 h-5.5 fill-none stroke-white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 190 150 C 160 150, 140 180, 140 220 C 140 245, 120 256, 100 256 C 120 256, 140 267, 140 292 C 140 332, 160 362, 190 362" />
                <path d="M 322 150 C 352 150, 372 180, 372 220 C 372 245, 392 256, 412 256 C 392 256, 372 267, 372 292 C 372 332, 352 362, 322 362" />
                <path d="M 215 260 L 245 290 L 305 220" stroke="#10b981" strokeWidth="54" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold font-heading text-lg tracking-tight bg-gradient-to-r from-accent-600 to-brand-500 bg-clip-text text-transparent">
                PrepApp
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                Revision Board
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input In Sidebar */}
        <div className="px-4 pt-4 pb-2 border-b border-slate-150 dark:border-slate-850/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, answers..."
              value={store.searchQuery}
              onChange={(e) => store.setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-800 dark:text-slate-200 transition"
            />
            {store.searchQuery && (
              <button
                onClick={() => store.setSearchQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-655"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Set Categories List Container */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Subject Categories
            </span>
            <button
              onClick={() => {
                setIsAddSetOpen(true);
                setIsSidebarOpen(false);
              }}
              className="p-1 rounded-md text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-500 transition cursor-pointer"
              title="Add new subject category"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {/* "All Topics" Special Tab */}
          <button
            onClick={() => {
              store.setActiveSetId("all");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition duration-200 cursor-pointer
              ${store.activeSetId === "all"
                ? "bg-accent-500/10 dark:bg-accent-400/15 text-accent-700 dark:text-accent-400 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 font-medium"
              }
            `}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">All Subjects</span>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              {store.questions.filter(q => !q.isRevised).length}/{store.questions.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {store.sets.map((set) => {
            const setQuestions = store.questions.filter(q => q.setId === set.id);
            const setPending = setQuestions.filter(q => !q.isRevised).length;
            const setTotal = setQuestions.length;

            return (
              <button
                key={set.id}
                onClick={() => {
                  store.setActiveSetId(set.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition duration-200 group/item cursor-pointer
                  ${store.activeSetId === set.id
                    ? "bg-accent-500/10 dark:bg-accent-400/15 text-accent-700 dark:text-accent-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 font-medium"
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${store.activeSetId === set.id ? "bg-accent-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                  <span className="text-sm truncate pr-2">{set.name}</span>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                    {setPending}/{setTotal}
                  </span>
                  
                  <button
                    onClick={(e) => handleDeleteSet(set.id, set.name, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200 dark:hover:bg-slate-800 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    title="Delete category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20">
          <button
            onClick={() => {
              setIsBackupOpen(true);
              setIsSidebarOpen(false);
            }}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-sm cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            Backup & Reset
          </button>
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500">
            PrepApp Board v1.0.0
          </div>
        </div>
      </aside>

      {/* 2. OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Navigation Bar / Title Section */}
        <header className="h-16 px-4 sm:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-850 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden transition cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold font-heading text-slate-800 dark:text-slate-150 truncate leading-tight my-0">
                {activeSetName}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-400 truncate hidden sm:block">
                {activeSetDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
                aria-label="Toggle theme"
              >
                {store.theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
                {store.theme === "dark" && <Moon className="w-4 h-4 text-indigo-400" />}
                {store.theme === "system" && <Laptop className="w-4 h-4" />}
              </button>

              {/* Theme Dropdown Menu */}
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />
                  <div className="absolute right-0 mt-2 w-36 glass-panel border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-20 animate-scaleUp">
                    <button
                      onClick={() => {
                        store.setTheme("light");
                        setShowThemeMenu(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3.5 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition ${store.theme === "light" ? "text-accent-500" : ""}`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Light Mode
                    </button>
                    <button
                      onClick={() => {
                        store.setTheme("dark");
                        setShowThemeMenu(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3.5 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition ${store.theme === "dark" ? "text-indigo-400" : ""}`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      Dark Mode
                    </button>
                    <button
                      onClick={() => {
                        store.setTheme("system");
                        setShowThemeMenu(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3.5 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition ${store.theme === "system" ? "text-accent-500" : ""}`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      System Default
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick Add Question Button */}
            <button
              onClick={() => setIsAddQuestionOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer glow-accent"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Question</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content Scroll Container */}
        <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
          
          {/* Stats Dashboard */}
          <StatsPanel 
            total={totalInSet}
            revised={revisedInSet}
            pending={pendingInSet}
            activeSetName={activeSetName}
          />

          {/* Filtering and Actions Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-5">
            {/* Status Filters (All / Pending / Revised) */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1 self-start">
              <button
                onClick={() => store.setFilterType("all")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer
                  ${store.filterType === "all"
                    ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                  }
                `}
              >
                All
              </button>
              <button
                onClick={() => store.setFilterType("unrevised")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer
                  ${store.filterType === "unrevised"
                    ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                  }
                `}
              >
                Pending ({pendingInSet})
              </button>
              <button
                onClick={() => store.setFilterType("revised")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer
                  ${store.filterType === "revised"
                    ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                  }
                `}
              >
                Revised ({revisedInSet})
              </button>
            </div>

            {/* Bulk / Context Actions */}
            <div className="flex items-center gap-2 justify-end">
              {store.filterType === "unrevised" && pendingInSet > 0 && (
                <button
                  onClick={handleMarkAllAsDone}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 dark:border-emerald-950/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark All Revised
                </button>
              )}

              {store.filterType === "revised" && revisedInSet > 0 && (
                <button
                  onClick={handleRestoreAllDone}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore All to Queue
                </button>
              )}

              {store.filterType === "all" && revisedInSet > 0 && (
                <button
                  onClick={handleResetSetProgress}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Mark all questions in this category as unrevised"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Progress
                </button>
              )}
            </div>
          </div>

          {/* Active search filter details banner */}
          {store.searchQuery && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-100/50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <span>
                Showing results for "<strong>{store.searchQuery}</strong>" in <strong>{activeSetName}</strong>
              </span>
              <button
                onClick={() => store.setSearchQuery("")}
                className="text-accent-500 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Questions Grid/List Container */}
          <div className="flex flex-col gap-4">
            {store.filteredQuestions.length > 0 ? (
              store.filteredQuestions.map((q) => {
                // Find index of this question in the unfiltered questions list
                const originalIndex = store.questions.findIndex((origQ) => origQ.id === q.id) + 1;

                return (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    serialNumber={originalIndex}
                    sets={store.sets}
                    onToggleRevised={store.toggleQuestionRevised}
                    onUpdate={store.updateQuestion}
                    onDelete={store.deleteQuestion}
                  />
                );
              })
            ) : (
              /* EMPTY STATES */
              <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm">
                
                {/* 1. Welcome state for new users (no categories created yet) */}
                {store.sets.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-4">
                      <FolderPlus className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-150 mb-2">
                      Welcome to PrepApp!
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Get started by creating your first subject or topic category (e.g. History, Science, or Tech).
                    </p>
                    <button
                      onClick={() => setIsAddSetOpen(true)}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      Create Subject Category
                    </button>
                  </>
                ) : store.filterType === "unrevised" && totalInSet > 0 ? (
                  /* 2. All Pending Checked Off (Empty Queue) */
                  <>
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-150 mb-2">
                      Subject Mastered! 🎉
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      You have revised all {totalInSet} questions in <strong>{activeSetName}</strong>. Ready to test yourself again?
                    </p>
                    <button
                      onClick={handleResetSetProgress}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      Reset Subject Progress
                    </button>
                  </>
                ) : store.filterType === "revised" && totalInSet > 0 ? (
                  /* 3. No Revised Questions Yet */
                  <>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-150 mb-2">
                      Nothing Checked Yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      You haven't marked any questions as revised in this subject. Read the questions and check them off when you feel confident.
                    </p>
                    <button
                      onClick={() => store.setFilterType("unrevised")}
                      className="px-6 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      Go to Pending Queue
                    </button>
                  </>
                ) : store.searchQuery ? (
                  /* 4. Search yields no results */
                  <>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-150 mb-2">
                      No Matches Found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      No questions or answers in <strong>{activeSetName}</strong> matched your search "{store.searchQuery}".
                    </p>
                    <button
                      onClick={() => store.setSearchQuery("")}
                      className="px-5 py-2 rounded-xl border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-semibold cursor-pointer"
                    >
                      Clear Search Filter
                    </button>
                  </>
                ) : (
                  /* 5. Complete category empty (no questions inside it at all) */
                  <>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-150 mb-2">
                      No Questions Yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      There are currently no questions in the subject <strong>{activeSetName}</strong>. Create a question to get started.
                    </p>
                    <button
                      onClick={() => setIsAddQuestionOpen(true)}
                      className="px-6 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      Create First Question
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. MODALS INTEGRATION */}
      {isAddQuestionOpen && (
        <AddQuestionModal
          isOpen={isAddQuestionOpen}
          onClose={() => setIsAddQuestionOpen(false)}
          onAdd={store.addQuestion}
          sets={store.sets}
          activeSetId={store.activeSetId}
          onOpenAddSet={() => setIsAddSetOpen(true)}
        />
      )}

      {isAddSetOpen && (
        <AddSetModal
          isOpen={isAddSetOpen}
          onClose={() => setIsAddSetOpen(false)}
          onAdd={(name, desc) => {
            const newId = store.addSet(name, desc);
            store.setActiveSetId(newId);
          }}
        />
      )}

      {isBackupOpen && (
        <BackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          onExport={store.exportData}
          onImport={store.importData}
          onResetAll={store.resetToDefaultData}
        />
      )}

      {confirmConfig && (
        <ConfirmModal
          isOpen={!!confirmConfig}
          onClose={() => setConfirmConfig(null)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          cancelText={confirmConfig.cancelText}
          variant={confirmConfig.variant}
        />
      )}
    </div>
  );
}

export default App;
