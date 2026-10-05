import React from "react";
import { Star } from "lucide-react";
import SectionHeader from "./SectionHeader";

export function Testimonials() {
  const items = [
    {
      quote:
        "I got hired in 11 days. The AI interview was actually fun, and I could see exactly where I stood.",
      name: "Rahul Khanna",
      role: "Data Scientist · Verified",
      initials: "RK",
    },
    {
      quote:
        "We reduced our time-to-hire by 60%. The Pathfinder AI delivers candidates that actually match our culture.",
      name: "Sarah Mitchell",
      role: "VP Talent · Stripe",
      initials: "SM",
    },
    {
      quote:
        "The community is incredible. I've found collaborators, mentors, and my current role — all through LetGetIn.",
      name: "Amara Okafor",
      role: "Product Designer · Lagos",
      initials: "AO",
    },
  ];
  return (
    <section id="testimonials" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Testimonials">
          Trusted by <span className="text-gradient-brand">Professionals</span> Worldwide
        </SectionHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="bg-surface rounded-2xl p-6 border border-border card-hover"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{t.name}</div>
                  <div className="text-xs text-ink-soft truncate">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
