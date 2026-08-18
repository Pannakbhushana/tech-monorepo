import React, { useState, useRef } from "react";
import { Download, Upload, RefreshCw, AlertTriangle, X, Check, FileJson } from "lucide-react";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (jsonData: string) => { success: boolean; error?: string };
  onResetAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onResetAll,
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImport(content);
        if (result.success) {
          setImportStatus({ type: "success", message: "Database imported successfully!" });
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setImportStatus({ type: "error", message: result.error || "Failed to import file." });
        }
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: "error", message: "Failed to read file." });
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    setImportStatus({ type: "idle" });
    fileInputRef.current?.click();
  };

  const handleResetConfirm = () => {
    if (resetConfirmed) {
      onResetAll();
      setResetConfirmed(false);
      onClose();
    } else {
      setResetConfirmed(true);
    }
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
        <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">
              Manage Database & Backups
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Export section */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-heading">
              Export Database
            </h4>
            <p className="text-xs text-slate-555 dark:text-slate-400">
              Download your questions, categories, and custom answers as a JSON file. Use this as a backup or to move data to another device.
            </p>
            <button
              onClick={onExport}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-650 transition text-sm cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download JSON Backup
            </button>
          </div>

          {/* Import section */}
          <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-heading">
              Import Database
            </h4>
            <p className="text-xs text-slate-555 dark:text-slate-400">
              Upload a previously exported `.json` file to restore your questions and answers. This will merge or overwrite current local settings.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-650 transition text-sm cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Backup File
            </button>

            {importStatus.type === "success" && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:bg-emerald-900/60 rounded-xl p-3 mt-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>{importStatus.message}</span>
              </div>
            )}

            {importStatus.type === "error" && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 mt-1.5">
                <X className="w-4 h-4 shrink-0" />
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>

          {/* Reset section */}
          <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <h4 className="text-sm font-bold text-red-500 dark:text-red-400 font-heading flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h4>
            <p className="text-xs text-slate-555 dark:text-slate-400">
              Erase all subject categories, questions, and answers from this device. This action is permanent and cannot be undone!
            </p>
            <button
              onClick={handleResetConfirm}
              className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-white text-sm font-bold transition cursor-pointer shadow-sm
                ${resetConfirmed 
                  ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                  : "bg-red-500/10 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-650 hover:text-white hover:border-transparent"
                }
              `}
            >
              <RefreshCw className={`w-4 h-4 ${resetConfirmed ? "animate-spin" : ""}`} />
              {resetConfirmed ? "Click Again to Confirm Deletion" : "Clear All Database Data"}
            </button>
            {resetConfirmed && (
              <p className="text-[10px] text-red-500 dark:text-red-400 text-center font-medium mt-1">
                Warning: This deletes all topics, questions, and progress!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
