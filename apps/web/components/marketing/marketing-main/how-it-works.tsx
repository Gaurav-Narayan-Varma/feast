import { BookOpenCheck, Calendar, ChefHat, CreditCard } from "lucide-react";

const steps = [
  {
    icon: <BookOpenCheck className="w-10 h-10 text-chef-800" />,
    title: "Browse & Select",
    description:
      "Explore profiles of talented chefs and view their specialized menus, reviews, and availability",
  },
  {
    icon: <Calendar className="w-10 h-10 text-chef-800" />,
    title: "Book Your Experience",
    description:
      "Choose your date, menu, and any special dietary requirements for your meal",
  },
  {
    icon: <ChefHat className="w-10 h-10 text-chef-800" />,
    title: "Chef Arrives & Cooks",
    description:
      "Ingredients will be delivered, and your chef will cook, serve, and clean up, leaving you to enjoy the experience",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-chef-800" />,
    title: "Pay & Review",
    description:
      "Secure payment is processed after your meal and we encourage you to share your experience with a review!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-ds-chef-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-ds-chef-100 text-chef-800 rounded-full text-sm font-medium mb-4 animate-on-scroll">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
            How Feast Works
          </h2>
          <p className="text-chef-700 max-w-2xl mx-auto animate-on-scroll">
            Our platform makes it easy to discover, book, and enjoy exceptional
            personal chef experiences in the comfort of your home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-chef-100 flex flex-col items-center text-center animate-on-scroll"
            >
              <div className="w-16 h-16 rounded-full bg-ds-chef-100 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-chef-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg
                    width="40"
                    height="8"
                    viewBox="0 0 40 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.3536 4.35355C39.5488 4.15829 39.5488 3.84171 39.3536 3.64645L36.1716 0.464466C35.9763 0.269204 35.6597 0.269204 35.4645 0.464466C35.2692 0.659728 35.2692 0.976311 35.4645 1.17157L38.2929 4L35.4645 6.82843C35.2692 7.02369 35.2692 7.34027 35.4645 7.53553C35.6597 7.7308 35.9763 7.7308 36.1716 7.53553L39.3536 4.35355ZM0 4.5H39V3.5H0V4.5Z"
                      fill="#9c8585"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
