"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, RotateCcw, Terminal } from "lucide-react";

const LINES = [
  { text: "Initializing request...", delay: 0 },
  { text: "Resolving path...", delay: 0.4 },
  { text: "Searching filesystem...", delay: 0.8 },
  { text: "ERROR: Resource not found", delay: 1.2, error: true },
  { text: "Stack trace:", delay: 1.6 },
  { text: "  at Router.resolve (next/dist/server/router.js)", delay: 1.9, dim: true },
  { text: "  at Server.handleRequest (next/dist/server/base.js)", delay: 2.1, dim: true },
  { text: "Exit code: 404", delay: 2.4, error: true },
];

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative select-none">
      <span
        className={`font-space font-black text-[clamp(7rem,20vw,14rem)] leading-none bg-gradient-to-br from-blue-400 via-violet-400 to-blue-600 bg-clip-text text-transparent transition-all duration-75 ${
          glitch ? "opacity-0" : "opacity-100"
        }`}
      >
        {text}
      </span>
      {/* glitch layers */}
      <span
        aria-hidden
        className={`absolute inset-0 font-space font-black text-[clamp(7rem,20vw,14rem)] leading-none text-blue-400 transition-all duration-75 ${
          glitch ? "opacity-80 translate-x-[3px] -translate-y-[2px]" : "opacity-0"
        }`}
        style={{ clipPath: "inset(20% 0 60% 0)" }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 font-space font-black text-[clamp(7rem,20vw,14rem)] leading-none text-violet-400 transition-all duration-75 ${
          glitch ? "opacity-80 -translate-x-[3px] translate-y-[2px]" : "opacity-0"
        }`}
        style={{ clipPath: "inset(60% 0 10% 0)" }}
      >
        {text}
      </span>
    </div>
  );
}

function TerminalLine({
  text,
  delay,
  error,
  dim,
}: {
  text: string;
  delay: number;
  error?: boolean;
  dim?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`font-mono text-xs sm:text-sm leading-relaxed ${
        error
          ? "text-red-400"
          : dim
          ? "text-gray-600"
          : "text-gray-400"
      }`}
    >
      {error ? "✗ " : dim ? "" : "› "}
      {text}
    </motion.div>
  );
}

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a10] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/8 blur-[80px] pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">

        {/* 404 glitch number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-2"
        >
          <GlitchText text="404" />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-gray-500 text-lg font-mono tracking-widest uppercase text-sm">
            Page not found
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden mb-8"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <Terminal className="w-3.5 h-3.5 text-gray-500 ml-2" />
            <span className="text-gray-500 text-xs font-mono ml-1">error.log</span>
          </div>

          {/* Terminal body */}
          <div className="p-5 space-y-1.5">
            {LINES.map((line, i) => (
              <TerminalLine key={i} {...line} />
            ))}
            {/* Cursor line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="font-mono text-xs sm:text-sm text-gray-400 flex items-center gap-1 pt-1"
            >
              <span className="text-blue-400">~</span>
              <span className="text-gray-600">$</span>
              <span
                className={`inline-block w-2 h-4 bg-blue-400 ml-1 transition-opacity duration-100 ${
                  cursor ? "opacity-100" : "opacity-0"
                }`}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-sm transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
