'use client';

import { useState, useEffect, useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface ScrambledTextProps {
  text: string;
  isRolling: boolean;
  className?: string;
}

export function ScrambledText({ text, isRolling, className = "" }: ScrambledTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRolling) {
      const scramble = () => {
        // If we have text, we can use its length and structure (spaces)
        // while still completely masking the actual letters.
        // If text is empty (e.g. initial state), use a default length.
        const baseText = text || "NAMA PESERTA";
        
        let result = '';
        for (let i = 0; i < baseText.length; i++) {
          if (baseText[i] === ' ') {
            result += ' ';
          } else {
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplayText(result);
        
        timeoutRef.current = setTimeout(scramble, 60);
      };

      scramble();
    } else {
      setDisplayText(text);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRolling, text]);

  return (
    <span className={`${className} font-bold tracking-tight`}>
      {displayText}
    </span>
  );
}
