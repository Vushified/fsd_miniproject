import React from 'react';

// Reusable minimalist loading spinner
export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-2">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100 rounded-full animate-spin`}
      />
      {text && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}

