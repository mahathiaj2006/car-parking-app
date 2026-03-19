import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <div className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium px-3 py-1 rounded-full mb-8">
          Smart Parking Management
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
          Park smarter,<br />not harder.
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
          Book a slot, track your vehicle, and settle your bill — all from one place.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3">Get started</Link>
          <Link to="/login" className="btn-secondary px-6 py-3">Sign in</Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-3 gap-8 max-w-lg">
        {[
          { label: 'Real-time availability', desc: 'See open slots instantly' },
          { label: 'Easy booking', desc: 'Reserve in seconds' },
          { label: 'Auto billing', desc: 'Pay only for what you use' },
        ].map(({ label, desc }) => (
          <div key={label}>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
