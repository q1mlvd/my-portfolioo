"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Terminal, CheckCircle2, XCircle } from "lucide-react";
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

interface Props {
  onVerify: (verified: boolean) => void;
}

export function MathCaptcha({ onVerify }: Props) {
  const [puzzle, setPuzzle] = useState(generate);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);

  const refresh = useCallback(() => {
    setPuzzle(generate());
    setInput("");
    setState("idle");
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    if (input === "") return;
    const val = parseInt(input, 10);
    if (isNaN(val)) return;

    if (val === puzzle.answer) {
      setState("correct");
      onVerify(true);
    } else if (input.length >= String(puzzle.answer).length + 1) {
      setState("wrong");
      onVerify(false);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        refresh();
      }, 800);
    }
  }, [input, puzzle.answer, onVerify, refresh]);

  const opColor =
    puzzle.op === "+"
      ? "text-blue-400"
      : puzzle.op === "-"
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <Terminal className="w-3.5 h-3.5 text-gray-500 ml-2" />
        <span className="text-gray-500 text-xs font-mono ml-1">captcha.js</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Code line */}
        <div className="font-mono text-sm leading-relaxed">
          <span className="text-purple-400">const </span>
          <span className="text-blue-300">answer</span>
          <span className="text-gray-400"> = </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={puzzle.a + puzzle.op + puzzle.b}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-baseline gap-1"
            >
              <span className="text-orange-300">{puzzle.a}</span>
              <span className={opColor}>{puzzle.op}</span>
              <span className="text-orange-300">{puzzle.b}</span>
            </motion.span>
          </AnimatePresence>
          <span className="text-gray-400">;</span>
        </div>

        {/* Input row */}
        <motion.div
          animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <span className="font-mono text-sm text-gray-500 shrink-0">
            &gt;&gt;&gt;
          </span>
          <div className="relative flex-1">
            <input
              type="number"
              value={input}
              onChange={(e) => {
                if (state !== "correct") setInput(e.target.value);
              }}
              disabled={state === "correct"}
              placeholder="type your answer..."
              className={cn(
                "w-full font-mono text-sm px-3 py-2 rounded-lg bg-white/5 border transition-all duration-300 outline-none placeholder:text-gray-600",
                "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                state === "correct"
                  ? "border-emerald-500/60 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : state === "wrong"
                  ? "border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                  : "border-white/10 text-gray-200 focus:border-blue-500/60 focus:shadow-[0_0_12px_rgba(59,130,246,0.15)]"
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
                  {state === "correct" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
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

        {/* Status line */}
        <AnimatePresence mode="wait">
          {state === "correct" && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-emerald-400"
            >
              <span className="text-gray-600">// </span>
              ✓ Verified. You are human.
            </motion.p>
          )}
          {state === "wrong" && (
            <motion.p
              key="err"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-red-400"
            >
              <span className="text-gray-600">// </span>
              ✗ Wrong answer. Generating new puzzle...
            </motion.p>
          )}
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-gray-600"
            >
              // Solve the expression above to verify
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
