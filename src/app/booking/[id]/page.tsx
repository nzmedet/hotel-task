'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronLeft, Calendar, User, Mail, Trash2 } from 'lucide-react';
import { useBookingStore } from '@/store/useBookingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const bookings = useBookingStore((state) => state.bookings);
  const deleteBooking = useBookingStore((state) => state.deleteBooking);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-foreground">Booking not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The booking you are looking for does not exist.</p>
        <Link href="/">
           <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      deleteBooking(booking.id);
      router.push('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="pl-0 hover:pl-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking Details</h1>
          <p className="text-muted-foreground mt-1">ID: <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">{booking.id}</span></p>
        </div>
        <div className="flex gap-2">
            <Button 
                onClick={handleDelete}
                variant="danger"
                size="sm"
                className="flex items-center gap-2"
            >
                <Trash2 className="h-4 w-4" />
                Cancel Booking
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
             <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Guest Information</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {booking.guestName}</span>
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {booking.email}</span>
                </div>
             </div>
             <Badge
                variant={
                    booking.status === 'confirmed' ? 'success' : 
                    booking.status === 'cancelled' ? 'destructive' : 'warning'
                }
                className="capitalize"
            >
                {booking.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-6">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Check-in</p>
                <p className="text-lg font-medium text-foreground">{format(new Date(booking.checkIn), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground flex items-center gap-2 justify-end"><Calendar className="h-4 w-4" /> Check-out</p>
                <p className="text-lg font-medium text-foreground">{format(new Date(booking.checkOut), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between border border-border mt-6">
            <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Total Stay</p>
                <p className="text-2xl font-bold text-primary">${booking.totalPrice}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground uppercase">Room Type</p>
                <p className="text-lg font-medium text-foreground capitalize">{booking.roomType}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
            <Card className="overflow-hidden bg-primary/5 border-primary/10 shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-2">Reservation Summary</h3>
                <ul className="space-y-2 text-sm text-primary/80">
                    <li className="flex justify-between">
                        <span>Guests</span>
                        <span className="font-medium">{booking.guests}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Nights</span>
                        <span className="font-medium">
                            {Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                    </li>
                </ul>
            </Card>
        </div>
      </div>
    </div>
  );
}
