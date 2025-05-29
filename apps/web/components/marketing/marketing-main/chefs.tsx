"use client";
import { trpc } from "@/app/_trpc/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import ChefCard from "./chef-card";

export default function Chefs() {
  const listChefUsers = trpc.chefUser.listChefUsersPublic.useQuery();
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  if (listChefUsers.isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <section id="chefs" className="pt-24 pb-16 bg-ds-chef-50">
      <div>
        <div className="text-center mb-4">
          <span className="inline-block py-1 px-3 bg-ds-chef-100 text-ds-chef-800 rounded-full text-sm font-medium mb-4 animate-on-scroll">
            Talented Professionals
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
            Meet Our Chefs
          </h2>
          <p className="text-ds-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Discover extraordinary culinary talent ready to create memorable
            dining experiences in your home
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="p-4 pb-8 md:-ml-4">
            {listChefUsers.data?.chefUsers.map((chef, index) => (
              <CarouselItem
                key={chef.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
              >
                <div
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/chefs/${chef.id}`}
                    className="block h-full transition-transform hover:scale-[1.02]"
                  >
                    <ChefCard
                      name={chef.name}
                      image={chef.profilePictureUrl ?? "/feast-icon.png"}
                      zipcode={chef.zipCode}
                    />
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 absolute -bottom-5 right-1/2 translate-x-1/2 ">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
