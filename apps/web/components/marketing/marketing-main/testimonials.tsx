"use client";
import cx from "clsx";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    rating: 5,
    text: "Chef Alex created the most memorable birthday dinner for my husband. The attention to detail and flavors were exceptional!",
    date: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "James Wilson",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    text: "Our anniversary dinner was perfect. Chef Sarah accommodated all our dietary restrictions while still delivering incredible food",
    date: "Feb 22, 2025",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    rating: 4,
    text: "We've used Feast three times now for dinner parties, and each experience has been outstanding. Highly recommend!",
    date: "Feb 5, 2025",
  },
  {
    id: 4,
    name: "David Chen",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    text: "Chef Marco turned our simple family gathering into a gourmet experience. Everyone is still talking about the meal!",
    date: "March 10, 2025",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-ds-chef-100 text-chef-800 rounded-full text-sm font-medium mb-4 animate-on-scroll">
            Client Experiences
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
            What Our Clients Say
          </h2>
          <p className="text-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Read about authentic experiences from clients who have enjoyed
            memorable culinary moments with our chefs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <TestimonialCard
                name={testimonial.name}
                image={testimonial.image}
                rating={testimonial.rating}
                text={testimonial.text}
                date={testimonial.date}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
  className?: string;
}

function TestimonialCard({
  name,
  image,
  rating,
  text,
  date,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cx(
        "bg-white p-6 rounded-xl shadow-sm border border-chef-100 chef-card-hover",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cx(
                  "w-3 h-3",
                  i < rating ? "text-amber-500 fill-amber-500" : "text-chef-200"
                )}
              />
            ))}
          </div>
        </div>
        <span className="ml-auto text-xs text-chef-400">{date}</span>
      </div>

      <p className="text-chef-600 text-sm">"{text}"</p>
    </div>
  );
}
