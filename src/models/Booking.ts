import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  room: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeSlot: string; // e.g., '10:00', '11:00'
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
  room: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

BookingSchema.index({ room: 1, date: 1, timeSlot: 1 }, { unique: true });

export default models.Booking || model<IBooking>('Booking', BookingSchema); 