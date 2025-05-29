import { BookOpenCheck, Calendar, ChefHat, CreditCard } from "lucide-react";

const steps = [
  {
    icon: <BookOpenCheck className="w-10 h-10 text-chef-800" />,
    title: "Browse & Select",
    description:
      "Explore profiles of talented chefs and view their specialized menus and availability",
  },
  {
    icon: <Calendar className="w-10 h-10 text-chef-800" />,
    title: "Book Your Experience",
    description: "Choose your dishes and pick a date for your meal",
  },
  {
    icon: <ChefHat className="w-10 h-10 text-chef-800" />,
    title: "Chef Arrives & Cooks",
    description:
      "Your chef will cook, serve, and clean up, leaving you to enjoy the experience",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-chef-800" />,
    title: "Review & Pay",
    description:
      "Customer confirms payment after chef accepts the booking request",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-ds-chef-100 text-ds-chef-800 rounded-full text-sm font-medium mb-4 animate-on-scroll">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
            How Feast Works
          </h2>
          <p className="text-ds-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Our platform makes it easy to discover, book, and enjoy exceptional
            personal chef experiences in the comfort of your home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 rounded-xl shadow-sm border border-ds-chef-100 flex flex-col items-center text-center animate-on-scroll bg-ds-chef-50"
            >
              <div className="w-16 h-16 rounded-full bg-ds-chef-100 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-ds-chef-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
