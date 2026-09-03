import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-2xl font-black text-[hsl(222,47%,9%)] mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/discover"
        className="px-6 py-2.5 bg-[hsl(24,95%,53%)] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm"
      >
        Back to Discover
      </Link>
    </div>
  );
}
