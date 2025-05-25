"use client";

import { trpc } from "@/app/_trpc/client";
import BookingReceipt from "@/components/booking-receipt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "antd";
import { CheckCircle, Loader2 } from "lucide-react";
import { use } from "react";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const getBooking = trpc.booking.getBooking.useQuery({
    bookingId: resolvedParams.id,
  });

  const createCheckoutSession = trpc.booking.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
  });

  if (getBooking.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (getBooking.isError || !getBooking.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {getBooking.error?.message}</p>
      </div>
    );
  }

  const timeCustomerRequestedAt = new Date(
    getBooking.data?.booking.timeCustomerRequestedAt
  ).toLocaleString();

  return (
    <div className="flex justify-center items-center h-screen bg-ds-chef-50">
      <Card className="w-4/5 lg:w-2/5 mx-auto relative pb-0 px-4">
        <CardHeader>
          <img
            src="/feast-logo-red.png"
            alt="Feast Logo"
            className="absolute top-4 right-4"
            width={60}
          />
          <CardTitle>Booking ID: {getBooking.data?.booking.id}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <BookingReceipt
            chefId={getBooking.data?.booking.chef.id}
            chefName={getBooking.data?.booking.chef.name}
            items={getBooking.data?.booking.items}
            totalAmount={getBooking.data?.booking.totalAmount}
            appointmentAt={getBooking.data?.booking.appointmentAt}
            customerAddress={getBooking.data?.booking.customerAddress ?? ""}
          />
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Tracker</h2>
            <Timeline
              items={[
                {
                  color: "#e2533f",
                  children: (
                    <p>Customer requested booking: {timeCustomerRequestedAt}</p>
                  ),
                },
                {
                  dot: !getBooking.data?.booking.timeChefAcceptedAt ? (
                    <div className="relative">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-ds-chef-400 animate-[ping_2.5s_infinite]" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-ds-chef-400" />
                    </div>
                  ) : (
                    <CheckCircle className="w-4 h-4 text-ds-chef-800" />
                  ),
                  children: !getBooking.data?.booking.timeChefAcceptedAt ? (
                    <p>
                      Waiting for {getBooking.data?.booking.chef.name} to accept
                      booking
                    </p>
                  ) : (
                    <p>{getBooking.data?.booking.chef.name} accepted booking</p>
                  ),
                },
                ...(getBooking.data?.booking.timeChefAcceptedAt
                  ? [
                      {
                        dot: !getBooking.data?.booking.timeCustomerPaidAt ? (
                          <div className="relative">
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-ds-chef-400 animate-[ping_2.5s_infinite]" />
                            <div className="relative w-2.5 h-2.5 rounded-full bg-ds-chef-400" />
                          </div>
                        ) : (
                          <CheckCircle className="w-4 h-4 text-ds-chef-800" />
                        ),
                        children: !getBooking.data?.booking
                          .timeCustomerPaidAt ? (
                          <div className="flex flex-col gap-2">
                            <p>Waiting for customer to pay</p>
                            <Button
                              size="sm"
                              variant="outline"
                              label="Proceed to Payment"
                              className="w-fit"
                              onClick={() =>
                                createCheckoutSession.mutate({
                                  bookingId: getBooking.data?.booking.id,
                                })
                              }
                              isLoading={createCheckoutSession.isPending}
                            />
                          </div>
                        ) : (
                          <p>Customer paid – session is confirmed!</p>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
