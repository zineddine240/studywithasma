"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./motion";

const testimonials = [
  {
    name: "Feriel B",
    band: "Band 8.0",
    text: "Asma's structured approach completely transformed my writing. I was stuck at 6.5 for months, but her detailed feedback helped me achieve an 8.0 in just 6 weeks!",
    role: "Academic IELTS",
  },
  {
    name: "Mohammed R.",
    band: "Band 7.5",
    text: "The live sessions are incredibly engaging. Asma explains complex strategies so simply. I felt fully prepared and confident on exam day.",
    role: "General Training",
  },
  {
    name: "Yacine B",
    band: "Band 8.5",
    text: "The best IELTS preparation course available online. The speaking practice sessions were a game-changer for my confidence.",
    role: "Academic IELTS",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      id="testimonials"
    >
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold text-foreground mb-6">
            Student Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Don't just take our word for it. Hear from students who have
            achieved their dream scores with our guidance.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group bg-card p-8 rounded-[2rem] border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative flex flex-col justify-between"
            >
              <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed font-medium mb-8 text-lg relative z-10">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="border-t border-border pt-6 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                    <span className="text-primary font-bold">
                      {testimonial.band}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
