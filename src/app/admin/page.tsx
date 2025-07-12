"use client";

import React, { useState, useEffect } from 'react';
import RoomSelector from '@/components/RoomSelector';
import Link from 'next/link';

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  timeSlot: string;
}

export default function AdminPage() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookings = () => {
    if (!selectedRoom || !selectedDate) {
      setBookings([]);
      return;
    }
    setLoading(true);
    setError('');
    fetch(`/api/bookings?date=${selectedDate}&room=${encodeURIComponent(selectedRoom)}`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setError('Failed to fetch bookings.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [selectedRoom, selectedDate]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setLoading(true);
    setError('');
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchBookings();
    } else {
      setError('Failed to cancel booking.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-2 relative">
      {/* Go to Booking Page Button */}
      <div className="absolute top-6 right-6 z-10">
        <Link href="/" legacyBehavior>
          <a className="font-bold text-white bg-blue-600 shadow-md rounded-lg px-5 py-2 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg">
            Go to Booking Page
          </a>
        </Link>
      </div>
      <main className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-6 tracking-tight">Admin: Manage Bookings</h1>
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="w-full sm:w-auto">
                <label className="block mb-1 text-base font-semibold text-gray-700">Select Date</label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring w-full text-gray-800 font-medium"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block mb-1 text-base font-semibold text-gray-700">Select Room</label>
                <RoomSelector value={selectedRoom} onChange={setSelectedRoom} />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings</h2>
            {loading && <div className="text-center text-gray-500">Loading bookings...</div>}
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-0 mt-4 bg-white rounded shadow-lg text-base border border-gray-200">
                <thead>
                  <tr className="bg-blue-200">
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Name</th>
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Email</th>
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Phone</th>
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Notes</th>
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Time Slot</th>
                    <th className="py-3 px-4 font-bold text-blue-900 border-b border-blue-300 text-left text-base">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">No bookings found.</td>
                    </tr>
                  ) : (
                    bookings.map((booking, idx) => (
                      <tr
                        key={booking._id}
                        className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 hover:scale-[1.01] shadow-sm border-b border-gray-200`}
                      >
                        <td className="py-3 px-4 font-semibold text-gray-900 align-middle">{booking.name}</td>
                        <td className="py-3 px-4 text-gray-800 align-middle">{booking.email}</td>
                        <td className="py-3 px-4 text-gray-800 align-middle">{booking.phone}</td>
                        <td className="py-3 px-4 text-gray-800 align-middle">{booking.purpose}</td>
                        <td className="py-3 px-4 text-blue-700 font-semibold align-middle">{booking.timeSlot}</td>
                        <td className="py-3 px-4 align-middle">
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition ml-1 shadow-sm"
                            onClick={() => handleCancel(booking._id)}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 