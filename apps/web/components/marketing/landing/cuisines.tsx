import cx from "clsx";

const cuisines = [
  {
    id: 1,
    name: "Italian",
    image:
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop",
    count: 42,
  },
  {
    id: 2,
    name: "Japanese",
    image:
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=1974&auto=format&fit=crop",
    count: 35,
  },
  {
    id: 3,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?q=80&w=3475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 28,
  },
  {
    id: 4,
    name: "French",
    image:
      "https://plus.unsplash.com/premium_photo-1674147611070-bbca5e2725e4?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 32,
  },
  {
    id: 5,
    name: "Indian",
    image:
      "https://plus.unsplash.com/premium_photo-1675727579542-ad785e1cee41?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 26,
  },
  {
    id: 6,
    name: "Plant-Based",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    count: 19,
  },
];

export default function Cuisines() {
  return (
    <section id="cuisines" className="py-24 px-6 lg:px-12 bg-ds-chef-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-ds-chef-100 text-chef-800 rounded-full text-sm font-medium mb-4 animate-on-scroll">
            Diverse Culinary Styles
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
            Explore Cuisines
          </h2>
          <p className="text-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Discover chefs specializing in your favorite cuisine or explore new
            flavors from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuisines.map((cuisine, index) => (
            <div
              key={cuisine.id}
              className="animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CuisineCard
                name={cuisine.name}
                image={cuisine.image}
                count={cuisine.count}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CuisineCardProps {
  name: string;
  image: string;
  count: number;
  className?: string;
}

function CuisineCard({ name, image, count, className }: CuisineCardProps) {
  return (
    <div
      className={cx(
        "group rounded-xl overflow-hidden relative h-80 chef-card-hover",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 z-10" />

      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <h3 className="font-display text-2xl font-semibold mb-2">{name}</h3>
        <p className="text-white/80 text-sm">{count} chefs available</p>
      </div>
    </div>
  );
}
