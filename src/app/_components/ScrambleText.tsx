"use client";
import { useEffect, useState } from "react";

const CHARS = "-_~XYZ0123[]!@#";

export function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    // Reseta se o texto mudar
    setIteration(0);
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iteration >= text.length) clearInterval(interval);
      setIteration((prev) => prev + 1 / 2); // Velocidade (aumente para ser mais lento)
    }, 30);

    return () => clearInterval(interval);
  }, [text, iteration]);

  return <span className={className}>{displayText}</span>;
}
