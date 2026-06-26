import type { Metadata } from "next";
import { getWeddingData } from "@/lib/storage/wedding-store";
import { getCoupleDisplayName } from "@/lib/helpers/getCoupleDisplayName";
import { DetailsPageClient } from "@/components/invite/DetailsPageClient";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getWeddingData();
  const coupleName = getCoupleDisplayName(data.couple);

  return {
    title: `${coupleName} — Wedding Details`,
    description: data.seo.description,
  };
};

const DetailsPage = async () => {
  const data = await getWeddingData();
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return <DetailsPageClient data={data} mapsApiKey={mapsApiKey} />;
};

export default DetailsPage;
