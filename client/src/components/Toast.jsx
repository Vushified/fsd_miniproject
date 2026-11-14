import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// Toast alert notification component
export function Toast({ notification, onClose }) {
  if (!notification) return null;

  const { type = 'info', message } = notification;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-neutral-100 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-neutral-700 dark:text-neutral-300 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl transition-all animate-bounce-short">
      {iconMap[type] || iconMap.info}
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {message}
      </span>
      <button
        onClick={onClose}
        className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

