import { weddingConfig } from "@/data/wedding.config";
import type { ThemeColors, WeddingConfig } from "@/lib/types/wedding";

const LEGACY_HERO_BACKGROUNDS = new Set([
  "/gallery/hero.svg",
  "/gallery/hero.jpg",
  "/gallery/hero-bg.png",
]);

const LEGACY_THEME_PRIMARIES = new Set(["#8B6F5E", "#5C2E3E"]);

export const isLegacyHeroBackground = (src?: string): boolean =>
  src !== undefined && LEGACY_HERO_BACKGROUNDS.has(src);

const isLegacyTheme = (theme?: Partial<ThemeColors>): boolean =>
  !!theme?.primary && LEGACY_THEME_PRIMARIES.has(theme.primary.toUpperCase());

const resolveTheme = (
  storedTheme?: Partial<ThemeColors>,
  storedHeroTheme?: Partial<ThemeColors>
): ThemeColors => {
  if (storedTheme && !isLegacyTheme(storedTheme)) {
    return { ...weddingConfig.theme, ...storedTheme };
  }
  if (storedHeroTheme && !isLegacyTheme(storedHeroTheme)) {
    return { ...weddingConfig.theme, ...storedHeroTheme };
  }
  return weddingConfig.theme;
};

export const needsWeddingDataMigration = (stored: Partial<WeddingConfig>): boolean =>
  !stored.hero?.theme ||
  !stored.theme?.foreground ||
  !stored.theme?.muted ||
  isLegacyHeroBackground(stored.hero?.backgroundImage) ||
  isLegacyTheme(stored.theme) ||
  isLegacyTheme(stored.hero?.theme);

export const normalizeWeddingConfig = (
  stored: Partial<WeddingConfig>
): WeddingConfig => {
  const storedHeroImage = stored.hero?.backgroundImage;
  const backgroundImage =
    storedHeroImage && !isLegacyHeroBackground(storedHeroImage)
      ? storedHeroImage
      : weddingConfig.hero.backgroundImage;

  const theme = resolveTheme(stored.theme, stored.hero?.theme);

  return {
    ...weddingConfig,
    ...stored,
    couple: { ...weddingConfig.couple, ...stored.couple },
    story: { ...weddingConfig.story, ...stored.story },
    theme,
    hero: {
      ...weddingConfig.hero,
      ...stored.hero,
      backgroundImage,
      ctaText: stored.hero?.ctaText ?? weddingConfig.hero.ctaText,
      theme,
    },
    gallery: {
      images: stored.gallery?.images ?? weddingConfig.gallery.images,
    },
    seo: { ...weddingConfig.seo, ...stored.seo },
    brand: { ...weddingConfig.brand, ...stored.brand },
    events: stored.events ?? weddingConfig.events,
    weddingDate: stored.weddingDate ?? weddingConfig.weddingDate,
    tagline: stored.tagline ?? weddingConfig.tagline,
  };
};
