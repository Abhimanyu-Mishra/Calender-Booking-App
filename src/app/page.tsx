'use client';

import React, { useState, useEffect } from 'react';
import RoomSelector from '@/components/RoomSelector';
import Calendar from '@/components/Calendar';
import BookingForm from '@/components/BookingForm';
import Link from 'next/link';

interface Booking {
  _id: string;
  timeSlot: string;
  // ...other fields
}

export default function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // BookingForm modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRoom || !selectedDate) {
      setBookings([]);
      return;
    }
    setLoading(true);
    fetch(`/api/bookings?date=${selectedDate}&room=${encodeURIComponent(selectedRoom)}`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  }, [selectedRoom, selectedDate]);

  // Open modal with selected slot, only if room and date are selected
  const handleSlotClick = (timeSlot: string) => {
    if (!selectedRoom || !selectedDate) {
      alert('Please select a room and date before booking a slot.');
      return;
    }
    setModalSlot(timeSlot);
    setModalOpen(true);
  };

  // Refresh bookings after successful booking
  const handleBookingSuccess = () => {
    setModalOpen(false);
    setModalSlot(null);
    // Refetch bookings
    setLoading(true);
    fetch(`/api/bookings?date=${selectedDate}&room=${encodeURIComponent(selectedRoom)}`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-2 relative">
      {/* Admin Button */}
      <div className="absolute top-6 right-6 z-10">
        <Link href="/admin" legacyBehavior>
          <a className="font-bold text-blue-700 bg-white border border-blue-200 shadow-md rounded-lg px-5 py-2 transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg">
            Admin
          </a>
        </Link>
      </div>
      <main className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col gap-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-2 tracking-tight">Book a Room</h1>
        <div className="flex flex-col gap-4">
          <RoomSelector value={selectedRoom} onChange={setSelectedRoom} className="mb-2" />
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedRoom={selectedRoom}
            bookings={bookings}
            onSlotClick={handleSlotClick}
          />
          {loading && <div className="text-center text-gray-500">Loading bookings...</div>}
        </div>
        <BookingForm
          open={modalOpen}
          onClose={() => { setModalOpen(false); setModalSlot(null); }}
          date={selectedDate}
          timeSlot={modalSlot || ''}
          room={selectedRoom}
          onBookingSuccess={handleBookingSuccess}
        />
      </main>
    </div>
  );
}
