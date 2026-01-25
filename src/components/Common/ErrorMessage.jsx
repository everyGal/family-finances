const ErrorMessage = ({
  error,
  title = 'שגיאה',
  onRetry,
  retryLabel = 'נסה שוב',
}) => {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-center mb-4">
        <div className="bg-red-100 p-3 rounded-full">
          <span
            className="material-symbols-outlined text-red-600 text-2xl"
            aria-hidden="true"
          >
            error
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-red-800 mb-2">{title}</h3>

      <p className="text-red-700 text-sm mb-4">
        {typeof error === 'string' ? error : error?.message || 'אירעה שגיאה'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            refresh
          </span>
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
