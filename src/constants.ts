// JIGI Brand Colors
export const COLORS = {
  violet: "#3D1B5C",
  terracotta: "#C85A3A",
  cream: "#FFF8F0",
  teal: "#D4F0EC",
  dark: "#1A1A2E",
  white: "#FFFFFF",
} as const;

// Video specs
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_SECONDS = 20;
export const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 600

// Scene timing (in frames)
export const SCENES = {
  hook: { start: 0, duration: 3 * FPS },         // 0-3s
  stat: { start: 3 * FPS, duration: 2 * FPS },    // 3-5s
  transition: { start: 5 * FPS, duration: 3 * FPS }, // 5-8s
  demo: { start: 8 * FPS, duration: 8 * FPS },    // 8-16s
  prix: { start: 16 * FPS, duration: 2 * FPS },   // 16-18s
  cta: { start: 18 * FPS, duration: 2 * FPS },    // 18-20s
} as const;
