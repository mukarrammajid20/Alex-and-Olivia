"use client";

import type { ThemeColors } from "@/lib/types/wedding";

type ThemeProviderProps = {
  theme: ThemeColors;
  children: React.ReactNode;
};

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
  <div
    style={
      {
        "--color-primary": theme.primary,
        "--color-accent": theme.accent,
        "--color-background": theme.background,
        "--color-foreground": theme.foreground,
        "--color-muted": theme.muted,
      } as React.CSSProperties
    }
  >
    {children}
  </div>
);
