import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function ChefCard({
  name,
  image,
  zipcode,
  className,
}: {
  name: string;
  image: string;
  zipcode?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden glass-card chef-card-hover transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-full",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={1}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </AspectRatio>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold mb-1">{name}</h3>
        <div className="flex items-center justify-between">
          {zipcode ? (
            <span className="text-sm text-ds-chef-500">{zipcode}</span>
          ) : (
            <span className="text-sm text-ds-chef-300">Location TBA</span>
          )}
          <div className="flex items-center text-sm font-medium text-ds-chef-800 group">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
