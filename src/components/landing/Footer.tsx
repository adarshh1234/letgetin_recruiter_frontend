import React from "react";
import Logo from "./Logo";

export function Footer() {
  const cols = [
    {
      title: "Platform",
      links: ["Features", "Purpose", "Sequence", "Changelog"],
    },
    { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Policies", "GDPR"] },
  ];
  return (
    <footer className="bg-[oklch(0.14_0.04_260)] border-t border-white/5 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Logo dark />
            <p className="text-white/50 text-sm mt-4 max-w-xs leading-relaxed">
              The professional identity layer where verified skills, not CVs,
              get you hired.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {["Twitter", "LinkedIn", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-white/40 hover:text-white/80 transition text-sm"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                {c.title}
              </h4>
              <ul className="space-y-2 text-sm text-white/50">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <span>© 2026 LetGetIn. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span>Verified Proof of Work</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
