const LoadingSpinner = ({ size = 'md', message = 'טוען...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-slate-200 border-t-primary`}
        aria-hidden="true"
      />
      {message && (
        <p className="text-sm text-slate-600 font-medium">{message}</p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
