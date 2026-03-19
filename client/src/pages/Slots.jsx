import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { slotsAPI, bookingsAPI } from '../api';

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [booking, setBooking] = useState(false);
  const { token } = useAuth();

  useEffect(() => { fetchSlots(); }, [token]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await slotsAPI.getAll(token);
      setSlots(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !vehicleNumber) return;
    try {
      setBooking(true);
      await bookingsAPI.create(selectedSlot.id, vehicleNumber, token);
      setSelectedSlot(null);
      setVehicleNumber('');
      fetchSlots();
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  const floors = [...new Set(slots.map(s => s.floor))].sort();
  const available = slots.filter(s => s.status === 'available').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Parking Slots</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{available} of {slots.length} slots available</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800 inline-block" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-200 dark:bg-zinc-700 inline-block" />Booked</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-800 inline-block" />Maintenance</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {floors.map((floor) => (
          <div key={floor}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Floor {floor}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {slots.filter(s => s.floor === floor).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                  disabled={slot.status !== 'available'}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all
                    ${slot.status === 'available' ? 'slot-available' : slot.status === 'booked' ? 'slot-booked' : 'slot-maintenance'}
                    ${selectedSlot?.id === slot.id ? 'ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-950' : ''}
                  `}
                >
                  <span className="text-zinc-700 dark:text-zinc-200">{slot.floor}-{String(slot.slot_number).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              Book Slot {selectedSlot.floor}-{String(selectedSlot.slot_number).padStart(2, '0')}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Charged at Rs. 50/hr on checkout</p>

            <form onSubmit={handleBookSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="input"
                  placeholder="DL-01-AB-1234"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={booking} className="btn-primary flex-1">
                  {booking ? 'Booking...' : 'Confirm'}
                </button>
                <button type="button" onClick={() => { setSelectedSlot(null); setVehicleNumber(''); }} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
