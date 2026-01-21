import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type RoomType = 'single' | 'double' | 'suite' | 'penthouse';

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  roomType: RoomType;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      deleteBooking: (id) =>
        set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),
      reset: () => set({ bookings: [] }),
    }),
    {
      name: 'booking-storage',
    }
  )
);
