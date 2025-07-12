import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Booking cancelled successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 