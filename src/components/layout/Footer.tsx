"use client";

import Link from "next/link";
import Logo from "./Logo";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="TikTok"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.19 2.09 2.37 2.26.96.16 1.99-.08 2.74-.72.68-.56 1.09-1.39 1.14-2.28.05-3.87.02-7.74.03-11.61z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Instagram"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="YouTube"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="LinkedIn"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6 sm:py-7 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Left: Study with Asma Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 group"
          aria-label="Study With Asma"
        >
          <Logo className="h-7 sm:h-8 w-auto text-[#0B1536] group-hover:text-indigo-600 transition-colors" />
        </Link>

        {/* Center: Social Media Icons */}
        <div className="flex items-center gap-5 text-slate-700">
          <a
            href="https://tiktok.com/@studywithasma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-indigo-600 transition-colors p-1"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/studywithasma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-indigo-600 transition-colors p-1"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@studywithasma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-indigo-600 transition-colors p-1"
          >
            <YouTubeIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/company/studywithasma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-indigo-600 transition-colors p-1"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Signature Tagline */}
        <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono">
          <span>IELTS</span>
          <span className="mx-2 text-slate-300">|</span>
          <span>STUDY ABROAD</span>
          <span className="mx-2 text-slate-300">|</span>
          <span>YOUR FUTURE</span>
        </div>
      </div>
    </footer>
  );
}
