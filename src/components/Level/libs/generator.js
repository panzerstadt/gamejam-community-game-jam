import { useEffect, useState } from "react";

export const hasTouch = () => {
  return (
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

export const remap = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

// gap widths ~= game difficulty
export const levelGenerator = (seed = 10, width, height, difficulty = 2) => {
  difficulty = clamp(Math.abs(difficulty), 2, 10);
  const heightSeed = new Math.seedrandom(seed)().toFixed(10);
  const gapSeed = new Math.seedrandom(seed + 1)().toFixed(10);

  const heights = Array.from(heightSeed.toString()).map(v =>
    remap(
      parseInt(v.replace(".", "0"), 10),
      0,
      10,
      0,
      (height * difficulty) / 10
    )
  );
  const gaps = Array.from(gapSeed.toString())
    .map(v => parseInt(v.replace(".", "0"), 10) * difficulty)
    .slice(1);

  return { heights, gaps };
};

const useLevelGenerator = (
  seed = 10,
  width = 300,
  height = 100,
  difficulty
) => {
  const [level, setLevel] = useState({ heights: [0], gaps: [0] });
  useEffect(() => {
    setLevel(levelGenerator(seed, width, height, difficulty));
  }, [seed, width, height]);

  return { heights: level.heights, gaps: level.gaps };
};

export default useLevelGenerator;
