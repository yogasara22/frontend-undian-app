'use client';

import { useState, useEffect } from 'react';

const gradients = [
  { from: '#e8192c', via: '#c01020', to: '#900a10' }, // Red
  { from: '#1a5bcc', via: '#154aa3', to: '#0d327a' }, // Blue
  { from: '#7c3aed', via: '#6d28d9', to: '#4c1d95' }, // Purple
  { from: '#0d9488', via: '#0f766e', to: '#134e4a' }, // Teal
  { from: '#4a3721', via: '#382a19', to: '#261c11' }, // Premium Brown
  { from: '#be123c', via: '#9f1239', to: '#881337' }, // Rose
];

export function useDynamicBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % gradients.length);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return gradients[index];
}
