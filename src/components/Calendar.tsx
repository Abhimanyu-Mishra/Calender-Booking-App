import React, { useState } from 'react';

interface Booking {
  timeSlot: string;
}

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedRoom: string;
  bookings: Booking[];
  onSlotClick: (timeSlot: string) => void;
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const suffix = i < 12 ? 'AM' : 'PM';
  return `${hour.toString().padStart(2, '0')}:00 ${suffix}`;
});

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, selectedRoom, bookings, onSlotClick }) => {
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const occupiedSlots = bookings.map(b => b.timeSlot);

  // Filter slots by AM/PM
  const filteredSlots = TIME_SLOTS.filter(slot => slot.endsWith(period));

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-lg font-semibold text-gray-700">Select Date</label>
        <input
          type="date"
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring w-full text-gray-700"
          value={selectedDate}
          onChange={e => onDateChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold text-gray-700">Time Slots</label>
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition border-2 ${period === 'AM' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-600 border-blue-200'} focus:outline-none`}
            onClick={() => setPeriod('AM')}
            type="button"
          >
            AM
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition border-2 ${period === 'PM' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-600 border-blue-200'} focus:outline-none`}
            onClick={() => setPeriod('PM')}
            type="button"
          >
            PM
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSlots.map(slot => {
            const isOccupied = occupiedSlots.includes(slot);
            return (
              <button
                key={slot}
                className={`w-full px-6 py-4 rounded-xl text-lg font-medium border transition text-center shadow-sm focus:outline-none
                  ${isOccupied
                    ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:shadow-lg active:bg-blue-700'}
                `}
                disabled={isOccupied}
                onClick={() => !isOccupied && onSlotClick(slot)}
              >
                {slot} {isOccupied ? <span className="font-normal">(Occupied)</span> : ''}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 