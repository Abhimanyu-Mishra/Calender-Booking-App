import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const { name, email, phone, purpose, room, date, timeSlot } = data;
    if (!name || !email || !phone || !purpose || !room || !date || !timeSlot) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    // Prevent duplicate booking for same room/date/timeSlot
    const exists = await Booking.findOne({ room, date, timeSlot });
    if (exists) {
      return NextResponse.json({ error: 'This slot is already booked.' }, { status: 409 });
    }
    const booking = await Booking.create({ name, email, phone, purpose, room, date, timeSlot });
    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const room = searchParams.get('room');
    const filter: any = {};
    if (date) filter.date = date;
    if (room) filter.room = room;
    const bookings = await Booking.find(filter).sort({ date: 1, timeSlot: 1 });
    return NextResponse.json(bookings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 