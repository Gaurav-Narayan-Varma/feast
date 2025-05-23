"use client";
import { trpc } from "@/app/_trpc/client";
import MenuCard from "@/components/marketing/chefs/menu-card";
import NavigationHeader from "@/components/marketing/chefs/navigation-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Recipe } from "@/lib/types";
import { generateTimeSlots } from "@/lib/utils";
import cx from "clsx";
import { Loader2, MapPin } from "lucide-react";
import { use, useState } from "react";

export default function ChefProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const resolvedParams = use(params);

  const getChefUser = trpc.chefUser.getChefUserPublic.useQuery({
    chefUserId: resolvedParams.id,
  });

  const [cart, setCart] = useState<
    {
      recipe: Recipe;
      quantity: number;
    }[]
  >([]);

  return (
    <div>
      <NavigationHeader />
      {getChefUser.isLoading && (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <div className="mt-20">
        {/* Hero Section */}
        <div className="px-[140px] py-7 bg-ds-chef-50 flex gap-8">
          <img
            src={getChefUser.data?.chefUser.profilePictureUrl ?? undefined}
            alt="Chef Profile Picture"
            className="w-[460px] h-[460px] rounded-lg shadow-md object-cover"
          />
          <div>
            <div className="px-3 py-1 bg-ds-chef-100 text-ds-chef-800 rounded-full text-sm font-medium w-fit mb-4">
              {getChefUser.data?.chefUser.cuisines
                .map((cuisine) => cuisine)
                .join(", ")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {getChefUser.data?.chefUser.name}
            </h1>

            <div className="flex items-center text-ds-chef-600 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{getChefUser.data?.chefUser.zipCode}</span>
            </div>

            <p className="text-ds-chef-700 mb-6">
              {getChefUser.data?.chefUser.bio}
            </p>
          </div>
        </div>

        {/* Menu Section */}
        <div className="px-[140px] py-9">
          <div className="mb-4">
            <div className="text-2xl font-bold mb-1">Menu Options</div>
            <div className="text-sm text-muted-foreground mb-4">
              Add items to your cart to create a custom menu.
            </div>
          </div>
          <div className="flex gap-8">
            {getChefUser.data?.chefUser.menus.map((menu) => (
              <MenuCard
                key={menu.id}
                name={menu.name}
                description={menu.description}
                recipes={menu.recipes}
                onAddToCart={(recipe) => {
                  const existingCartItem = cart.find(
                    (item) => item.recipe.id === recipe.id
                  );

                  if (existingCartItem) {
                    setCart(
                      cart.map((item) =>
                        item.recipe.id === recipe.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      )
                    );
                  } else {
                    setCart([...cart, { recipe, quantity: 1 }]);
                  }
                }}
                onRemoveFromCart={(recipe) => {
                  setCart(
                    cart
                      .map((item) =>
                        item.recipe.id === recipe.id
                          ? {
                              ...item,
                              quantity: Math.max(0, item.quantity - 1),
                            }
                          : item
                      )
                      .filter((item) => item.quantity > 0)
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="px-[140px] py-9 bg-ds-chef-50">
          <div className="text-2xl font-bold mb-4">Cart</div>
          <div className="flex flex-col gap-4">
            {cart.length === 0 && (
              <div className="text-muted-foreground italic text-sm">
                Your cart is empty
              </div>
            )}
            {cart.map((item) => (
              <div
                key={item.recipe.id}
                className="flex gap-2 text-muted-foreground"
              >
                <div>{item.recipe.name}</div>
                <div>x{item.quantity}</div>
                <div className="flex-1 border-b border-ds-chef-300 self-center border-dashed mx-3" />
                <div>${item.recipe.price * item.quantity}</div>
              </div>
            ))}
          </div>
          <div className="border-t self-center mt-6" />
          <div className="flex justify-between mt-4">
            <div>Total</div>
            <div>
              $
              {cart.reduce(
                (acc, item) => acc + item.recipe.price * item.quantity,
                0
              )}
            </div>
          </div>
        </div>

        {/* Scheduling Section */}
        <div className="px-[140px] py-9">
          <div className="text-2xl font-bold mb-1">Scheduling</div>
          <div className="text-sm text-muted-foreground mb-4">
            Select a date and time to book a chef. Appointments can typically
            last up to 2 hours.
          </div>
          <div className="flex gap-6 h-[283.2px]">
            <div className="w-1/2 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date ?? new Date());
                  setSelectedTime(null);
                }}
                fromDate={new Date()}
              />
            </div>
            <div className="w-1/2 flex flex-col gap-4 p-3">
              <div className="text-sm font-medium">
                {selectedDate.toLocaleDateString()} Availabilities
              </div>
              {/* Availability slots */}
              <ScrollArea className="overflow-y-auto">
                <div className="flex flex-col gap-2 pr-4">
                  {generateTimeSlots({
                    recurringAvailability:
                      getChefUser.data?.chefUser.recurringAvailabilities ?? [],
                    dateOverride:
                      getChefUser.data?.chefUser.dateOverrides ?? [],
                    selectedDate: selectedDate,
                  }).map((slot) => (
                    <Button
                      key={slot.toISOString()}
                      variant={
                        selectedTime?.toISOString() === slot.toISOString()
                          ? "default"
                          : "outline"
                      }
                      className={cx("text-sm text-muted-foreground", {
                        "text-white":
                          selectedTime?.toISOString() === slot.toISOString(),
                      })}
                      label={slot.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      onClick={() => setSelectedTime(slot)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
