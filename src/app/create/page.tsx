'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { startOfToday } from 'date-fns';
import { Users, CreditCard } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DateRangePicker from 'react-tailwindcss-datepicker';
import { useBookingStore, Booking, RoomType } from '@/store/useBookingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

const ROOM_PRICES: Record<RoomType, number> = {
  single: 100,
  double: 150,
  suite: 300,
  penthouse: 800,
};

const validationSchema = Yup.object({
  guestName: Yup.string().required('Guest name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  dateRange: Yup.object({
    startDate: Yup.date().nullable().required('Check-in date is required'),
    endDate: Yup.date().nullable().required('Check-out date is required')
      .min(Yup.ref('startDate'), 'Check-out must be after check-in'),
  }).required('Please select a date range'),
  roomType: Yup.string().required(),
  guests: Yup.number().min(1, 'At least 1 guest required').max(10, 'Max 10 guests').required(),
});

export default function CreateBookingPage() {
  const router = useRouter();
  const addBooking = useBookingStore((state) => state.addBooking);

  const formik = useFormik({
    initialValues: {
      guestName: '',
      email: '',
      dateRange: { startDate: null, endDate: null } as { startDate: Date | null; endDate: Date | null },
      roomType: 'single' as RoomType,
      guests: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const days = values.dateRange.endDate && values.dateRange.startDate 
        ? Math.ceil(Math.abs(new Date(values.dateRange.endDate).getTime() - new Date(values.dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) 
        : 0;
      
      const totalPrice = days * ROOM_PRICES[values.roomType];

      const newBooking: Booking = {
        id: uuidv4(),
        guestName: values.guestName,
        email: values.email,
        checkIn: new Date(values.dateRange.startDate!).toISOString(),
        checkOut: new Date(values.dateRange.endDate!).toISOString(),
        roomType: values.roomType,
        guests: values.guests,
        totalPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      addBooking(newBooking);
      router.push('/');
    },
  });

  const calculateTotal = () => {
    if (!formik.values.dateRange.startDate || !formik.values.dateRange.endDate) return 0;
    const diffTime = Math.abs(new Date(formik.values.dateRange.endDate).getTime() - new Date(formik.values.dateRange.startDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * ROOM_PRICES[formik.values.roomType];
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Reservation</h1>
        <p className="text-muted-foreground">Fill in the details below to secure your stay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative z-10">
          <Card className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Guest Name"
                  id="guestName"
                  {...formik.getFieldProps('guestName')}
                  error={formik.touched.guestName && formik.errors.guestName}
                />

                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && formik.errors.email}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Dates of Stay</label>
                <div className="border border-input rounded-lg flex flex-col bg-muted/20 relative z-40">
                    <DateRangePicker
                        value={formik.values.dateRange}
                        onChange={(value) => formik.setFieldValue('dateRange', value)}
                        minDate={startOfToday()}
                        primaryColor='indigo'
                        toggleClassName="hidden"
                        inputClassName="flex h-10 w-full rounded-lg border-input focus-visible:border-ring focus-visible:ring-ring bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                        containerClassName="[&>div.absolute>div]:bg-popover [&>div.absolute>div]:dark:bg-popover [&>div.absolute>div]:border-border [&>div.absolute>div]:dark:border-border [&>div.absolute>div]:text-popover-foreground [&>div.absolute>div]:dark:text-popover-foreground"
                    />
                     {formik.touched.dateRange && (formik.errors.dateRange as unknown as { endDate?: string })?.endDate && (
                        <p className="text-xs text-destructive mt-2">{(formik.errors.dateRange as unknown as { endDate?: string }).endDate}</p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Select
                    label="Room Type"
                    id="roomType"
                    {...formik.getFieldProps('roomType')}
                    error={formik.touched.roomType && formik.errors.roomType}
                >
                    <option value="single">Single Room ($100)</option>
                    <option value="double">Double Room ($150)</option>
                    <option value="suite">Suite ($300)</option>
                    <option value="penthouse">Penthouse ($800)</option>
                </Select>
                
                <Input
                    label="Number of Guests"
                    id="guests"
                    type="number"
                    min={1}
                    max={10}
                    {...formik.getFieldProps('guests')}
                    error={formik.touched.guests && formik.errors.guests}
                />
              </div>

              <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={formik.isSubmitting || !formik.isValid}
                    isLoading={formik.isSubmitting}
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden bg-card p-6">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Booking Summary
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium capitalize text-foreground">{formik.values.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nights</span>
                <span className="font-medium text-foreground">
                  {formik.values.dateRange.startDate && formik.values.dateRange.endDate ? Math.max(0, Math.ceil(Math.abs(new Date(formik.values.dateRange.endDate).getTime() - new Date(formik.values.dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-medium text-foreground">{formik.values.guests}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${calculateTotal()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
