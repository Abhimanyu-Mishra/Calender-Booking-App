import React from 'react';

interface RoomSelectorProps {
  value: string;
  onChange: (room: string) => void;
  className?: string;
}

const ROOMS = ['Room A', 'Room B', 'Room C'];

const RoomSelector: React.FC<RoomSelectorProps> = ({ value, onChange, className }) => (
  <select
    className={`border text-gray-700 rounded px-3  py-2 focus:outline-none focus:ring w-full ${className || ''}`}
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    <option value="" className='text-black'>Select Room</option>
    {ROOMS.map(room => (
      <option key={room} value={room} className='text-black' >{room} </option>
    ))}
  </select>
);

export default RoomSelector; 