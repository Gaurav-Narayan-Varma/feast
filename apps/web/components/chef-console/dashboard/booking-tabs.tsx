import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BookingTabs({
  bookings,
}: {
  bookings: {
    id: string;
    timeCustomerRequestedAt: string | null;
    timeChefAcceptedAt: string | null;
    timeChefRejectedAt: string | null;
    timeCustomerPaidAt: string | null;
    timeBookingCompletedAt: string | null;
    appointmentAt: string;
  }[];
}) {
  const utils = trpc.useUtils();

  const respondToBooking = trpc.booking.respondToBooking.useMutation({
    onSuccess: (data) => {
      utils.chefUser.getChefUser.invalidate();

      if (data.accepted) {
        toast.success("Booking accepted! The customer has been notified.");
      } else {
        toast.success("Booking rejected. The customer has been notified.");
      }
    },
  });

  const pendingBookings = bookings.filter(
    (booking) => !booking.timeCustomerPaidAt && !booking.timeChefRejectedAt
  );

  const upcomingBookings = bookings.filter(
    (booking) => booking.timeCustomerPaidAt && booking.timeChefAcceptedAt
  );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.appointmentAt) < new Date()
  );

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">
          Pending Bookings ({pendingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Upcoming Bookings ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past Bookings ({pastBookings.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
            <CardDescription>
              Booking requests awaiting your approval or customer payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
            {pendingBookings.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-muted-foreground text-sm">
                  No pending bookings
                </div>
              </div>
            )}
            {pendingBookings.map((booking) => {
              return (
                <Card
                  key={booking.id}
                  className="flex flex-row justify-between px-5 items-center py-3"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-sm">
                      {booking.appointmentAt &&
                        new Date(booking.appointmentAt)
                          .toLocaleString("en-US", {
                            month: "numeric",
                            day: "2-digit",
                            year: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                          .replace(",", " at")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      label="Details & Status"
                      rightIcon={<ExternalLink />}
                      onClick={() => {
                        window.open(`/booking/${booking.id}`, "_blank");
                      }}
                    />
                  </div>
                  {/* Respond to booking */}
                  {!booking.timeChefAcceptedAt &&
                  !booking.timeCustomerPaidAt ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        label="Accept"
                        size="sm"
                        onClick={() =>
                          respondToBooking.mutate({
                            bookingId: booking.id,
                            accept: true,
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        label="Reject"
                        size="sm"
                        onClick={() =>
                          respondToBooking.mutate({
                            bookingId: booking.id,
                            accept: false,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Badge variant="secondary">Accepted by you</Badge>
                      <Badge variant="secondary">
                        Waiting for customer payment
                      </Badge>
                    </div>
                  )}
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="upcoming">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>
              Bookings you've accepted and the customer has paid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingBookings.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-muted-foreground text-sm">
                  No upcoming bookings
                </div>
              </div>
            )}
            {upcomingBookings.map((booking) => {
              return (
                <Card
                  key={booking.id}
                  className="flex flex-row px-5 items-center py-3"
                >
                  <div className="flex flex-1 flex-row justify-between items-center">
                    <div className="text-sm">
                      {booking.appointmentAt &&
                        new Date(booking.appointmentAt)
                          .toLocaleString("en-US", {
                            month: "numeric",
                            day: "2-digit",
                            year: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                          .replace(",", " at")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      label="Details & Status"
                      rightIcon={<ExternalLink />}
                      onClick={() => {
                        window.open(`/booking/${booking.id}`, "_blank");
                      }}
                    />
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="past">
        <Card>
          <CardHeader>
            <CardTitle>Past Bookings</CardTitle>
            <CardDescription>Bookings you've completed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pastBookings.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-muted-foreground text-sm">
                  No past bookings
                </div>
              </div>
            )}
            {pastBookings.map((booking) => {
              return (
                <Card
                  key={booking.id}
                  className="flex flex-row justify-between px-5 items-center py-3"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-sm">
                      {booking.appointmentAt &&
                        new Date(booking.appointmentAt)
                          .toLocaleString("en-US", {
                            month: "numeric",
                            day: "2-digit",
                            year: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                          .replace(",", " at")}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      label="Details & Status"
                      rightIcon={<ExternalLink />}
                      onClick={() => {
                        window.open(`/booking/${booking.id}`, "_blank");
                      }}
                    />
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
