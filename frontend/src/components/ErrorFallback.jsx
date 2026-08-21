export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 text-center bg-red-50 text-red-800 rounded-lg max-w-md mx-auto my-8 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm font-mono mb-4 text-red-600">{error?.message || String(error)}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  );
}