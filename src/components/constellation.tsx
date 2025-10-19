"use client";

export function Constellation() {
  const stars = [
    { x: 0, y: 0, size: 3 },
    { x: 15, y: -8, size: 2 },
    { x: 8, y: 12, size: 2.5 },
    { x: 22, y: 5, size: 2 },
    { x: 12, y: -2, size: 1.5 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 4, to: 3 },
  ];

  return <div className="group relative h-8 w-8"></div>;
}
