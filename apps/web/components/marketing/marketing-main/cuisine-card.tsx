import cx from "clsx";

export default function CuisineCard({
  name,
  image,
  className,
}: {
  name: string;
  image: string;
  className?: string;
}) {
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
      </div>
    </div>
  );
}
