export default function Spinner({ className = 'h-6 w-6' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <span className={`animate-spin rounded-full border-2 border-brand-600 border-t-transparent ${className}`} />
    </div>
  );
}
