"use client";
import { motion } from "framer-motion";

export function IndustrialSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-4 rounded border border-zinc-800 bg-zinc-900/50 p-3">
      <span
        className={`font-mono text-sm ${checked ? "text-red-400" : "text-zinc-500"}`}
      >
        {label}
      </span>

      <button
        onClick={onChange}
        className={`relative h-7 w-14 rounded-full p-1 transition-colors duration-300 ${
          checked
            ? "bg-red-900 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            : "bg-zinc-800"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`h-5 w-5 rounded-full shadow-md ${
            checked ? "bg-red-500" : "bg-zinc-600"
          }`}
        />
      </button>
    </div>
  );
}
