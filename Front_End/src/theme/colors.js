export const DARK = {
 bg: "#f7f7f7",
  sidebar: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e2e2e2",
  accent: "#1f5de3",
  accentDim: "rgba(23, 64, 151, 0.1)",
  text: "#0f0f0f",
  textMuted: "#666666",
  textDim: "#0d0d0d",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#22c55e",
  info: "#2fd291",
  white: "#ffffff",
  icon : "#0f0f0f",
  iconDim : "#666666",
  iconMuted : "#888888",
};

export const LIGHT = {
  bg: "#0f0f0f",
  sidebar: "#141414",
  card: "#1a1a1a",
  cardBorder: "#252525",
  accent: "#1f5de3",
  accentDim: "rgba(22, 239, 232, 0.12)",
  text: "#f0f0f0",
  textMuted: "#888",
  textDim: "#555",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#22c55e",
  info: "#2fd291",
  white: "#ffffff",
};

// C is a single mutable object. Every component imports this SAME
// reference and reads C.bg, C.text, etc. at render time. We never
// reassign C itself — we mutate its keys in place via setTheme(),
// so existing `import { C } from ...` usage across the whole app
// keeps working unchanged.
export const C = { ...DARK };

export function setTheme(mode) {
  const source = mode === "light" ? LIGHT : DARK;
  Object.assign(C, source);
}
 