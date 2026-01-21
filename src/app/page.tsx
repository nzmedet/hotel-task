'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Calendar, User, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/store/useBookingStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  const bookings = useBookingStore((state) => state.bookings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookings</h1>
          <p className="mt-2 text-muted-foreground">Manage your hotel reservations.</p>
        </div>
        <Link href="/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No bookings found</h3>
          <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
            You havent created any bookings yet. Get started by creating your first reservation.
          </p>
          <Link href="/create">
            <Button variant="secondary">
                Create your first booking
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/booking/${booking.id}`} className="group block h-full">
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative p-6">
                
                <div className="flex flex-col h-full gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                         <User className="h-3 w-3" /> {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </p>
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
                  
                  <div className="pt-2 border-t border-border mt-auto space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Check In</p>
                        <p className="font-medium text-foreground">{format(new Date(booking.checkIn), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Check Out</p>
                        <p className="font-medium text-foreground">{format(new Date(booking.checkOut), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground capitalize">
                      {booking.roomType}
                    </span>
                    <span className="font-bold text-primary text-lg">
                      ${booking.totalPrice}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
