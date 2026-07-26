"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./motion";
import React from "react";

const faqs = [
  {
    question: "Do you offer both Academic and General IELTS preparation?",
    answer: "Yes, our courses are tailored to cover both Academic and General IELTS. When you enroll, you can choose your focus, and Asma will provide the specific materials and strategies you need for your target module."
  },
  {
    question: "How do the live classes work?",
    answer: "Live classes are conducted via Zoom or Google Meet. They are fully interactive, allowing you to ask questions and participate in speaking exercises. All sessions are recorded so you can review them later if you miss a class."
  },
  {
    question: "Will I get personal feedback on my writing?",
    answer: "Absolutely. One of the core benefits of studying with Asma is the detailed, personalized feedback on your Writing and Speaking tasks, highlighting exactly what you need to do to improve your band score."
  },
  {
    question: "How long does a typical course last?",
    answer: "Our standard intensive course runs for 6 weeks, but we also offer flexible packages if you need more time or want a fast-track 3-week crash course before your exam."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-24 bg-card border-t border-border relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            Everything you need to know about preparing for the IELTS with Asma.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-primary/50 bg-primary/5 shadow-md' : 'border-border bg-background hover:border-primary/30'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-foreground pr-8">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
