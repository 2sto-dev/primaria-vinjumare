import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function GhiseulWidget() {
  return (
    <aside
      aria-label="Plăți online taxe și impozite"
      className="fixed bottom-5 left-5 z-40 print:hidden"
    >
      <a
        href="https://www.ghiseul.ro"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ghișeul.ro - Plăți online taxe și impozite (se deschide într-o filă nouă)"
        title="Plătește online taxele și impozitele locale prin Ghișeul.ro"
        style={{ textDecoration: 'none' }}
        className="group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 !no-underline"
      >
        {/* Official Ghișeul.ro Geometric Logo Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f9fc] p-1 border border-[#e8edf2] shadow-sm transition-transform duration-200 group-hover:scale-105">
          <img
            src="/imagini/ghiseul-logo.svg"
            alt="Siglă Ghișeul.ro"
            width="36"
            height="36"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Text information */}
        <div className="flex flex-col text-left" style={{ textDecoration: 'none' }}>
          <div className="flex items-baseline font-sans text-[16px] font-black tracking-tight leading-none text-[#0b2e59]" style={{ textDecoration: 'none' }}>
            <span>GHIȘEUL</span>
            <span className="text-[#d83236]">.ro</span>
          </div>
          <span className="mt-1 text-[12px] font-medium leading-none text-slate-500 group-hover:text-slate-700 transition-colors" style={{ textDecoration: 'none' }}>
            Plăți online
          </span>
        </div>

        {/* External Link Arrow Icon */}
        <div className="ml-0.5 flex items-center justify-center text-slate-400 transition-colors duration-200 group-hover:text-[#0b2e59] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
          <ArrowUpRight size={18} strokeWidth={2.2} />
        </div>
      </a>
    </aside>
  );
}
