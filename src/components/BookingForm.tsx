import React, { useState } from 'react';

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  date: string;
  timeSlot: string;
  room: string;
  onBookingSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ open, onClose, date, timeSlot, room, onBookingSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !purpose) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, purpose, room, date, timeSlot })
    });
    setLoading(false);
    if (res.ok) {
      setName(''); setEmail(''); setPhone(''); setPurpose('');
      onClose();
      onBookingSuccess();
    } else {
      const data = await res.json();
      setError(data.error || 'Booking failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity animate-fadeIn">
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col gap-6 animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-2">Book Slot</h2>
        <div className="text-center text-base text-gray-600 mb-2">
          <span className="font-semibold">{room}</span> &middot; <span>{date}</span> &middot; <span>{timeSlot}</span>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-base font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400 text-base text-gray-800 placeholder-gray-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block mb-1 text-base font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400 text-base text-gray-800 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1 text-base font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400 text-base text-gray-800 placeholder-gray-400"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block mb-1 text-base font-medium text-gray-700">Purpose / Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400 text-base text-gray-800 placeholder-gray-400 min-h-[60px]"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              required
              placeholder="Add your notes here"
            />
          </div>
          {/* Hidden fields for date, timeSlot, room */}
          <input type="hidden" value={date} name="date" />
          <input type="hidden" value={timeSlot} name="timeSlot" />
          <input type="hidden" value={room} name="room" />
          {error && (
            <div className="flex items-center gap-2 border border-red-400 bg-red-50 text-red-700 rounded-lg px-4 py-2 mt-2 mb-1">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
              <span className="font-medium">{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg mt-2 hover:bg-blue-700 transition disabled:opacity-60 shadow-md"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Slot'}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
        .animate-fadeInUp { animation: fadeInUp 0.3s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};

export default BookingForm; 