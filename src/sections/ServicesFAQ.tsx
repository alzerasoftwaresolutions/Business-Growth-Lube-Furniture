import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Timelines vary by scope — a single consultation can be scheduled within days, while full furniture solutions and commercial programs typically run several weeks depending on customization and order size."
  },
  {
    question: "Is there a minimum order for Commercial & Hospitality projects?",
    answer: "Commercial programs are typically scoped for multi-room or multi-unit projects. Reach out with your project details and we'll confirm what fits your scale."
  },
  {
    question: "Can I mix pieces from different collections in one project?",
    answer: "Yes — many of our clients combine pieces across Living, Bedroom, Dining, and Office collections. Our consultation process helps ensure finishes and materials stay cohesive."
  },
  {
    question: "Do you offer custom sizing or materials?",
    answer: "Custom sizing and material/upholstery selection are available as part of our Furniture Consultation and Solutions packages."
  },
  {
    question: "What happens after I submit a quote request?",
    answer: "Our team reviews your project details and follows up within one business day with guidance, recommendations, and a tailored quotation."
  },
  {
    question: "Do you work with interior designers and architects?",
    answer: "Yes — our Furniture Consultation service is specifically suited to homeowners, interior architects, and private studios."
  }
];

export const ServicesFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-warm-ivory border-t border-lube-border">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading title="Common Questions" align="center" />
        
        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-lube-border bg-soft-white rounded-[1rem] overflow-hidden transition-all duration-200"
            >
              <button 
                onClick={() => toggleOpen(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-[1rem]"
              >
                <h3 className="text-base font-medium tracking-tight text-dark-graphite pr-4">
                  {faq.question}
                </h3>
                <ChevronDown 
                  size={20} 
                  className={`text-clay shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-sm leading-relaxed text-secondary-text">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
