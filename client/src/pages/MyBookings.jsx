import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => { fetchBookings(); }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getMyBookings(token);
      setBookings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id, token);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = async (id) => {
    if (!window.confirm('Complete booking and generate bill?')) return;
    try {
      const response = await bookingsAPI.checkout(id, token);
      console.log('[CHECKOUT RESPONSE]', response.data);
      alert(`Bill: Rs. ${response.data.amount} for ${response.data.duration_hours} hrs`);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const fmt = (d) => new Date(d.endsWith('Z') ? d : d + 'Z').toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  const statusBadge = (status) => {
    if (status === 'active') return <span className="badge-primary">Active</span>;
    if (status === 'completed') return <span className="badge-success">Completed</span>;
    return <span className="badge-danger">Cancelled</span>;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">My Bookings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{bookings.length} total &middot; {bookings.filter(b => b.status === 'active').length} active</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-zinc-400 dark:text-zinc-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">
                    Slot {b.floor}-{String(b.slot_number).padStart(2, '0')}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{b.vehicle_number}</p>
                </div>
                {statusBadge(b.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 mb-0.5">Check-in</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{fmt(b.start_time)}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 mb-0.5">Check-out</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{b.end_time ? fmt(b.end_time) : '—'}</p>
                </div>
              </div>

              {b.amount && (
                <div className="mb-4 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-emerald-700 dark:text-emerald-400">Total charged</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Rs. {b.amount}</span>
                </div>
              )}

              {b.status === 'active' && (
                <div className="flex gap-2">
                  <button onClick={() => handleCheckout(b.id)} className="btn-accent flex-1 text-sm">Checkout</button>
                  <button onClick={() => handleCancel(b.id)} className="btn-danger flex-1 text-sm">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
