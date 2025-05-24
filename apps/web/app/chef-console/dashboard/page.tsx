"use client";
import { trpc } from "@/app/_trpc/client";
import BookingTabs from "@/components/chef-console/dashboard/booking-tabs";
import EarningsCard from "@/components/chef-console/dashboard/earnings-card";
import PageSpinner from "@/components/chef-console/page-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function ChefDashboardPage() {
  const getChefUser = trpc.chefUser.getChefUser.useQuery();

  if (getChefUser.isLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 h-full w-full max-w-[800px]">
      <div>
        <div className="section-title">Dashboard</div>
        <div className="text-sm text-muted-foreground">
          Manage your bookings and track your performance
        </div>
      </div>
      <div className="w-full flex flex-col gap-8 justify-center">
        <div className="w-full">
          <BookingTabs
            bookings={
              getChefUser.data?.chefUser.bookings.map((booking) => ({
                id: booking.id,
                timeCustomerRequestedAt: booking.timeCustomerRequestedAt,
                timeChefAcceptedAt: booking.timeChefAcceptedAt,
                timeChefRejectedAt: booking.timeChefRejectedAt,
                timeCustomerPaidAt: booking.timeCustomerPaidAt,
                timeBookingCompletedAt: booking.timeBookingCompletedAt,
                appointmentAt: booking.appointmentAt,
              })) ?? []
            }
          />
        </div>
        <div className="w-full flex gap-8">
          <EarningsCard
            isStripeOnboardingComplete={
              getChefUser.data?.chefUser.stripeOnboardingComplete ?? false
            }
          />
          {/* More coming soon */}
          <Card className="border border-dashed border-ds-chef-300 w-1/2 flex flex-col gap-2">
            <CardHeader>
              <CardTitle>More coming soon!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                We're working on adding more features to the dashboard. Please
                check back soon!
              </div>
              <Wrench className="w-full h-16 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
