import type { WeddingConfig } from "@/lib/types/wedding";

type FooterProps = {
  brand: WeddingConfig["brand"];
};

export const Footer = ({ brand }: FooterProps) => (
  <footer className="border-t border-accent/20 px-5 py-10 text-center">
    <p className="text-xs text-muted">
      Crafted by{" "}
      <span className="font-medium text-primary">{brand.name}</span>
    </p>
  </footer>
);
