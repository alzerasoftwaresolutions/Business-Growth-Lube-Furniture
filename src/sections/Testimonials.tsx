import React from 'react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Lube helped us furnish our entire living room with pieces that actually work for how we live. Nothing feels forced.",
      name: "Sarah M.",
      initials: "SM",
      role: "Homeowner"
    },
    {
      quote: "Their team understood our brand instantly. The furniture package they built for our office speaks for itself.",
      name: "David K.",
      initials: "DK",
      role: "Interior Designer"
    },
    {
      quote: "We needed contract-grade furniture for 40 hotel rooms, delivered on schedule. Lube delivered exactly that.",
      name: "Amina T.",
      initials: "AT",
      role: "Hospitality Client"
    }
  ];

  return (
    <section className="bg-soft-white border-y border-lube-border">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-editorial text-clay uppercase">
            Trusted By
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col text-center">
              <p className="text-base leading-relaxed text-secondary-text mb-6 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-warm-ivory border border-lube-border text-lg font-semibold text-dark-graphite shadow-sm">
                  {testimonial.initials}
                </div>
                <p className="font-semibold text-dark-graphite">{testimonial.name}</p>
                <p className="text-sm text-clay mt-1">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
