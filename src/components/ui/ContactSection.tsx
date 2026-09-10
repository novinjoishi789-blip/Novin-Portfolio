"use client";

import React, { useState } from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { ArrowUpRight, Copy, Check, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6 space-y-16">
      {/* Availability Pill */}
      <div className="flex items-center gap-2 font-mono-tech text-xs text-[#e89e47]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span className="tracking-widest uppercase">{PERSONAL_INFO.availability}</span>
      </div>

      {/* Hero Typography */}
      <div className="space-y-2">
        <h2 className="font-display text-5xl sm:text-7xl md:text-9xl font-bold uppercase tracking-tighter text-gradient-silver leading-none">
          LET&apos;S BUILD
        </h2>
        <h2 className="font-display text-5xl sm:text-7xl md:text-9xl font-bold uppercase tracking-tighter text-gradient-gold leading-none">
          SOMETHING.
        </h2>
      </div>

      {/* Copy Email Bar & CTA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-6">
        <div className="md:col-span-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="flex-1 px-8 py-5 rounded-2xl bg-white text-[#060709] font-mono-tech text-sm sm:text-base font-bold uppercase tracking-wider hover:bg-[#e89e47] transition-all flex items-center justify-between group shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            <span>Initiate Project Conversation</span>
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

          <button
            onClick={handleCopyEmail}
            title="Copy Email to Clipboard"
            className="px-6 py-5 rounded-2xl studio-glass studio-glass-hover font-mono-tech text-xs text-neutral-300 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>COPY EMAIL</span>
              </>
            )}
          </button>
        </div>

        {/* Location & Response Telemetry */}
        <div className="md:col-span-4 font-mono-tech text-xs text-neutral-400 space-y-1 md:text-right">
          <p className="text-neutral-200">{PERSONAL_INFO.location}</p>
          <p>TYPICAL RESPONSE TIME: &lt; 24 HOURS</p>
        </div>
      </div>

      {/* Social Network Links */}
      <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono-tech text-xs">
        <div className="flex items-center gap-6">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-[#e89e47] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GITHUB</span>
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-[#e89e47] transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            <span>LINKEDIN</span>
          </a>
          <a
            href={PERSONAL_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-[#e89e47] transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>INSTAGRAM</span>
          </a>
        </div>

        <div className="text-neutral-500">
          © {new Date().getFullYear()} NOVIN JOISHI. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
}
