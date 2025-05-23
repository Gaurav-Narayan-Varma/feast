import CuisineCard from "./cuisine-card";

const cuisines = [
  {
    id: 1,
    name: "Italian",
    image:
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Japanese",
    image:
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?q=80&w=3475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    name: "French",
    image:
      "https://plus.unsplash.com/premium_photo-1674147611070-bbca5e2725e4?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    name: "Indian",
    image:
      "https://plus.unsplash.com/premium_photo-1675727579542-ad785e1cee41?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "Plant-Based",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
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
            Our Cuisines
          </h2>
          <p className="text-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Our chefs specialize in your favorite cuisines from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuisines.map((cuisine, index) => (
            <div
              key={cuisine.id}
              className="animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CuisineCard name={cuisine.name} image={cuisine.image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
