import React from "react";
import { Brain, ShieldCheck, Globe2, Handshake, Trophy, BarChart3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export function Features() {
  const items = [
    { icon: Brain, title: "Pathfinder AI", desc: "Matches jobs, people, and learning based on verified skills, not keywords.", meta: "Fit score + skill gap analysis" },
    { icon: ShieldCheck, title: "Skill Verification Hub", desc: "AI interviews, project uploads, peer endorsements — proof over claims.", meta: "Mercor-style live vetting" },
    { icon: Globe2, title: "Authentic Community", desc: "Niche groups, AI-facilitated networking, and local hubs in emerging markets.", meta: "150+ countries" },
    { icon: Handshake, title: "Agentic Headhunter", desc: "AI-to-AI negotiation for salary, culture fit, and skills — before humans talk.", meta: "Zero friction hiring" },
    { icon: Trophy, title: "Gamified Engagement", desc: "Skill challenges, hackathons, and leaderboards that directly improve job prospects.", meta: "Earn badges + rewards" },
    { icon: BarChart3, title: "Trust & Analytics", desc: "Dynamic reputation scores, bias detection, and live application insights.", meta: "See your ranking" },
  ];
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Core Features"
          desc="Everything you need to prove, connect, and get hired — all in one platform."
        >
          The <span className="text-gradient-brand">Intelligent</span> Professional OS
        </SectionHeader>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc, meta }) => (
            <div
              key={title}
              className="bg-surface rounded-2xl p-6 border border-border card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-glow" />
              </div>
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{desc}</p>
              <div className="mt-3 text-xs font-medium text-primary-glow">{meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
