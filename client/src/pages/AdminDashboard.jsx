import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, slotsAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/slots'); return; }
    fetchData();
  }, [user, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, slotsRes] = await Promise.all([
        bookingsAPI.getAllBookings(token),
        slotsAPI.getAll(token),
      ]);
      setBookings(bookingsRes.data || []);
      setSlots(slotsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlot = async () => {
    if (!selectedSlot || !newStatus) return;
    try {
      await slotsAPI.update(selectedSlot.id, { status: newStatus }, token);
      setSelectedSlot(null);
      setNewStatus('');
      fetchData();
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

  const totalRevenue = bookings.filter(b => b.status === 'completed' && b.amount).reduce((s, b) => s + b.amount, 0);
  const stats = [
    { label: 'Total Slots', value: slots.length },
    { label: 'Available', value: slots.filter(s => s.status === 'available').length },
    { label: 'Booked', value: slots.filter(s => s.status === 'booked').length },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'active').length },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    { label: 'Revenue', value: `Rs. ${totalRevenue}` },
  ];

  const statusBadge = (status) => {
    if (status === 'active') return <span className="badge-primary">Active</span>;
    if (status === 'completed') return <span className="badge-success">Completed</span>;
    return <span className="badge-danger">Cancelled</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">System overview and slot management</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {stats.map(({ label, value }) => (
          <div key={label} className="card px-4 py-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Slot Management */}
      <div className="card p-6 mb-8">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Manage Slots</h2>
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800 inline-block" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-200 dark:bg-zinc-700 inline-block" />Booked</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-800 inline-block" />Maintenance</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => { setSelectedSlot(slot); setNewStatus(slot.status); }}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all
                ${slot.status === 'available' ? 'slot-available' : slot.status === 'booked' ? 'slot-booked' : 'slot-maintenance'}
                ${selectedSlot?.id === slot.id ? 'ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-950' : ''}
              `}
            >
              <span className="text-zinc-700 dark:text-zinc-200 text-[10px]">{slot.floor}-{String(slot.slot_number).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">All Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                {['ID', 'User', 'Slot', 'Vehicle', 'Check-in', 'Check-out', 'Status', 'Amount'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">#{b.id}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{b.username}</td>
                  <td className="px-4 py-3 text-zinc-900 dark:text-white">{b.floor}-{String(b.slot_number).padStart(2, '0')}</td>
                  <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">{b.vehicle_number}</td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{fmt(b.start_time)}</td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{b.end_time ? fmt(b.end_time) : '—'}</td>
                  <td className="px-4 py-3">{statusBadge(b.status)}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{b.amount ? `Rs. ${b.amount}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Edit Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              Update Slot {selectedSlot.floor}-{String(selectedSlot.slot_number).padStart(2, '0')}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Change the status of this slot</p>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input">
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdateSlot} className="btn-primary flex-1">Update</button>
              <button onClick={() => { setSelectedSlot(null); setNewStatus(''); }} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
