import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-200">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mt-4">Page not found</h2>
        <p className="text-slate-500 text-sm mt-2">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
