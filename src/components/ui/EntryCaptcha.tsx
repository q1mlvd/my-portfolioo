"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, RefreshCw, CheckCircle2, XCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Op = "+" | "-" | "*";

function generate(): { a: number; b: number; op: Op; answer: number } {
  const ops: Op[] = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  }

  return { a, b, op, answer };
}

const BOOT_LINES = [
  { text: "Booting secure environment...", delay: 100 },
  { text: "Loading portfolio assets...", delay: 400 },
  { text: "Verifying visitor...", delay: 700 },
  { text: "Awaiting human confirmation.", delay: 1000 },
];

export function EntryCaptcha() {
  const [visible, setVisible] = useState(false);
  const [puzzle, setPuzzle] = useState<ReturnType<typeof generate> | null>(null);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("entry_verified")) return;
    setVisible(true);
    setPuzzle(generate());

    // Boot sequence
    BOOT_LINES.forEach(({ text, delay }) => {
      setTimeout(() => setBootLines((prev) => [...prev, text]), delay);
    });
  }, []);

  const refresh = useCallback(() => {
    setPuzzle(generate());
    setInput("");
    setState("idle");
  }, []);

  useEffect(() => {
    if (!puzzle || !input) return;
    const val = parseInt(input, 10);
    if (isNaN(val)) return;

    if (val === puzzle.answer) {
      setState("correct");
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          sessionStorage.setItem("entry_verified", "1");
          setVisible(false);
        }, 600);
      }, 800);
    } else if (input.length >= String(puzzle.answer).length + 1) {
      setState("wrong");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        refresh();
      }, 700);
    }
  }, [input, puzzle, refresh]);

  const opColor =
    puzzle?.op === "+" ? "text-blue-400" :
    puzzle?.op === "-" ? "text-red-400" :
    "text-yellow-400";

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="entry-captcha"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060a10]"
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
            }}
          />

          <div className="relative z-10 w-full max-w-md px-4">

            {/* Shield icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border border-blue-500/40"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="font-space text-2xl font-bold text-white mb-1">
                Human Verification
              </h1>
              <p className="text-gray-500 text-sm">
                Solve the expression to enter
              </p>
            </motion.div>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <Terminal className="w-3.5 h-3.5 text-gray-500 ml-2" />
                <span className="text-gray-500 text-xs font-mono ml-1">
                  verify.js
                </span>
              </div>

              {/* Boot sequence */}
              <div className="px-5 pt-4 space-y-1">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "font-mono text-xs",
                      i === bootLines.length - 1
                        ? "text-blue-400"
                        : "text-gray-600"
                    )}
                  >
                    {i === bootLines.length - 1 ? "› " : "✓ "}
                    {line}
                  </motion.div>
                ))}
              </div>

              {/* Puzzle */}
              <AnimatePresence>
                {puzzle && bootLines.length === BOOT_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.1 }}
                    className="px-5 py-4 space-y-3"
                  >
                    {/* Expression */}
                    <div className="font-mono text-sm">
                      <span className="text-purple-400">const </span>
                      <span className="text-blue-300">result</span>
                      <span className="text-gray-400"> = </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={puzzle.a + puzzle.op + puzzle.b}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="inline-flex items-baseline gap-1"
                        >
                          <span className="text-orange-300">{puzzle.a}</span>
                          <span className={opColor}>{puzzle.op}</span>
                          <span className="text-orange-300">{puzzle.b}</span>
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-gray-400">;</span>
                    </div>

                    {/* Input */}
                    <motion.div
                      animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <span className="font-mono text-sm text-gray-500 shrink-0">&gt;&gt;&gt;</span>
                      <div className="relative flex-1">
                        <input
                          autoFocus
                          type="number"
                          value={input}
                          onChange={(e) => {
                            if (state !== "correct") setInput(e.target.value);
                          }}
                          disabled={state === "correct"}
                          placeholder="your answer..."
                          className={cn(
                            "w-full font-mono text-sm px-3 py-2 rounded-lg bg-white/5 border transition-all duration-300 outline-none placeholder:text-gray-600",
                            "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            state === "correct"
                              ? "border-emerald-500/60 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
                              : state === "wrong"
                              ? "border-red-500/60 text-red-400"
                              : "border-white/10 text-gray-200 focus:border-blue-500/60 focus:shadow-[0_0_16px_rgba(59,130,246,0.2)]"
                          )}
                        />
                        <AnimatePresence>
                          {state !== "idle" && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            >
                              {state === "correct"
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                : <XCircle className="w-4 h-4 text-red-400" />
                              }
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        type="button"
                        onClick={refresh}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                        title="New puzzle"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </motion.div>

                    {/* Status */}
                    <AnimatePresence mode="wait">
                      {state === "correct" && (
                        <motion.p
                          key="ok"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-mono text-xs text-emerald-400"
                        >
                          <span className="text-gray-600">// </span>
                          ✓ Access granted. Welcome.
                        </motion.p>
                      )}
                      {state === "wrong" && (
                        <motion.p
                          key="err"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-mono text-xs text-red-400"
                        >
                          <span className="text-gray-600">// </span>
                          ✗ Wrong. New puzzle generated.
                        </motion.p>
                      )}
                      {state === "idle" && (
                        <motion.p
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-mono text-xs text-gray-600"
                        >
                          // Type the result and press Enter — or just type the number
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
