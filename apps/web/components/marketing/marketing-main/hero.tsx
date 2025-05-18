import React from "react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20 overflow-hidden">
      <img src="" alt="" />
      <div
        className="absolute inset-0 bg-cover bg-center z-0 fade-mask"
        style={{
          backgroundImage: "url('/hero.png')",
          opacity: 0.8,
          transition: "opacity 1s ease-in-out",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90 z-10" />

      <div className="max-w-7xl mx-auto relative z-20 text-center py-12 md:py-24">
        <span className="inline-block py-1 px-3 bg-ds-chef-100 text-ds-chef-400 rounded-full text-sm font-medium mb-4 md:mb-6 font-[Inter]">
          A Personal Chef Marketplace
        </span>

        <h1
          className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 max-w-4xl mx-auto tracking-tight`}
        >
          Elevate Your Dining Experience With{" "}
          <span className="shimmer-text">Expert Personal Chefs</span>
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl text-ds-chef-700 mb-6 md:mb-10 max-w-2xl mx-auto font-[Inter]"
        >
          Bring a gourmet eating experience to your home with talented chefs who
          craft personalized culinary journeys in your kitchen
        </p>
        <StatsDisplay />
      </div>
    </section>
  );
}

const stats = [
  { value: "50+", label: "Professional Chefs" },
  { value: "~$18", label: "Average Plate Cost" },
  { value: "100+", label: "Happy Clients" },
  { value: "NYC", label: "Focused" },
];

function StatsDisplay() {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-4 mt-8 w-full md:justify-center md:gap-8 md:mt-12`}
    >
      {stats.map(({ value, label }, index) => (
        <React.Fragment key={label}>
          {/* Stat Item */}
          <div className="flex flex-col items-center w-full">
            <span className="font-display text-2xl font-bold text-ds-chef-800">
              {value}
            </span>
            <span className="text-sm text-ds-chef-600">{label}</span>
          </div>

          {/* Separator - horizontal on mobile, vertical on desktop */}
          {index < stats.length - 1 && (
            <div className="w-1/4 h-px md:w-px md:h-10 bg-ds-chef-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
