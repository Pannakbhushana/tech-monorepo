import React from "react";
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      case "danger":
      default:
        return <AlertCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10 focus:ring-amber-500";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 focus:ring-blue-500";
      case "danger":
      default:
        return "bg-red-600 hover:bg-red-700 text-white shadow-red-500/10 focus:ring-red-500";
    }
  };

  const getIconBgStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-500";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-500";
      case "danger":
      default:
        return "bg-red-50 dark:bg-red-950/30 text-red-500";
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
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-xl overflow-hidden transform transition-all z-10 p-6 flex flex-col items-center text-center animate-scaleUp relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${getIconBgStyles()}`}>
          {getIcon()}
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl shadow-sm transition cursor-pointer ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
