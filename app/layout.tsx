import type { Metadata } from "next";
import { serifFont, sansFont } from "@/lib/fonts";
import { getWeddingData } from "@/lib/storage/wedding-store";
import { getCoupleDisplayName } from "@/lib/helpers/getCoupleDisplayName";
import { getCoupleInitials } from "@/lib/helpers/getCoupleInitials";
import { getSiteUrl } from "@/lib/helpers/getSiteUrl";
import "./globals.css";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getWeddingData();
  const coupleName = getCoupleDisplayName(data.couple);
  const siteUrl = getSiteUrl();

  return {
    title: data.seo.title,
    description: data.seo.description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      type: "website",
      siteName: coupleName,
      images: [
        {
          url: data.seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${coupleName} wedding invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo.title,
      description: data.seo.description,
      images: [data.seo.ogImage],
    },
  };
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const data = await getWeddingData();
  const initials = getCoupleInitials(data.couple);

  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`}>
      <head>
        <link rel="icon" href={`data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${data.theme.background}"/><text x="50" y="58" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="${data.theme.primary}">${initials}</text></svg>`
        )}`} />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
