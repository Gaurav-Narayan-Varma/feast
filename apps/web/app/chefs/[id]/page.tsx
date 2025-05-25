"use client";
import { trpc } from "@/app/_trpc/client";
import MenuCard from "@/components/marketing/chefs/menu-card";
import NavigationHeader from "@/components/marketing/chefs/navigation-header";
import Footer from "@/components/marketing/marketing-main/footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Recipe } from "@/lib/types";
import { generateTimeSlots } from "@/lib/utils";
import cx from "clsx";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "react-hot-toast";
import z from "zod";

const bookingSchema = z.object({
  cart: z
    .array(
      z.object({
        recipe: z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
        }),
        quantity: z.number(),
      })
    )
    .min(1, { message: "Please add at least one item to your cart" }),
  selectedDate: z.date({
    errorMap: () => ({ message: "Please select a date" }),
  }),
  selectedTime: z.date({
    errorMap: () => ({ message: "Please select a time" }),
  }),
  email: z
    .string({
      errorMap: () => ({ message: "Please enter a valid email" }),
    })
    .email({ message: "Please enter a valid email" }),
  address: z.string({
    errorMap: () => ({ message: "Please enter a valid address" }),
  }),
});

export default function ChefProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [cart, setCart] = useState<
    {
      recipe: Recipe;
      quantity: number;
    }[]
  >([]);
  const [email, setEmail] = useState("");
  const resolvedParams = use(params);
  const router = useRouter();

  const getChefUser = trpc.chefUser.getChefUserPublic.useQuery({
    chefUserId: resolvedParams.id,
  });

  const createBooking = trpc.booking.createBooking.useMutation({
    onSuccess: (data) => {
      router.push(`/booking/${data.booking.id}`);
      toast.success(
        "Booking created successfully! The chef has been notified."
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
        <div className="px-[140px] pb-9 pt-14">
          <div className="mb-4">
            <div className="text-2xl font-bold mb-1">Menu Options</div>
            <div className="text-sm text-muted-foreground mb-4">
              Add items to your cart to create a custom menu.
            </div>
          </div>
          <div className="gap-8 grid grid-cols-2">
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

                  toast.success("Added to cart");
                }}
                onRemoveFromCart={(recipe) => {
                  const existingCartItem = cart.find(
                    (item) => item.recipe.id === recipe.id
                  );

                  if (!existingCartItem) {
                    return;
                  }

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

                  toast.success("Removed from cart");
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-6 py-9 px-[140px]">
          {/* Cart Section */}
          <div className="w-1/2 justify-between flex flex-col">
            <div>
              <div className="text-2xl font-bold mb-1">Cart</div>
              <div className="text-sm text-muted-foreground mb-4">
                View a breakdown of your cart.
              </div>
            </div>
            <div className="p-3">
              <div className="flex flex-col gap-4">
                {cart.length === 0 && (
                  <div className="text-muted-foreground text-sm">
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
              <div className="border-t self-center mt-5" />
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
          </div>

          {/* Scheduling Section */}
          <div className="w-1/2">
            <div className="text-2xl font-bold mb-1">Scheduling</div>
            <div className="text-sm text-muted-foreground mb-4">
              Select a date and time to book a chef (~2 hours)
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
                <div className="text-sm font-medium">Availabilities</div>
                {/* Availability slots */}
                <ScrollArea className="overflow-y-auto">
                  <div className="flex flex-col gap-2 pr-4">
                    {generateTimeSlots({
                      recurringAvailabilities:
                        getChefUser.data?.chefUser.recurringAvailabilities ??
                        [],
                      dateOverrides:
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
                        className={cx("text-sm", {
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
        {/* Customer Info Section */}
        <div className="flex justify-center items-center gap-6 pb-10 px-[140px] lg:w-4/5 lg:mx-auto">
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              placeholder="john@doe.com"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="address">Address:</Label>
            <Input
              id="address"
              placeholder="123 Main St, Anytown, USA"
              className="w-full"
              value={address ?? ""}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        {/* Request Booking */}
        <div className="flex justify-center items-center gap-6 pb-10 px-[140px]">
          <Button
            className="w-1/3"
            variant="default"
            label="Request Booking"
            isLoading={createBooking.isPending}
            rightIcon={<ArrowRight />}
            onClick={() => {
              const result = bookingSchema.safeParse({
                cart,
                selectedDate,
                selectedTime,
                email,
                address,
              });

              if (!result.success) {
                toast.error(result.error.issues[0]?.message ?? "Invalid date");
                return;
              }

              createBooking.mutate({
                chefUserId: getChefUser.data?.chefUser.id ?? "",
                cart,
                appointmentAt: new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
                  selectedTime?.getHours() ?? 0,
                  selectedTime?.getMinutes() ?? 0
                ).toISOString(),
                customerEmail: result.data.email,
                customerAddress: result.data.address,
              });
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
