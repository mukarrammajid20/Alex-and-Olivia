import { getWeddingData } from "@/lib/storage/wedding-store";
import { HeroPageClient } from "@/components/invite/HeroPageClient";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const data = await getWeddingData();
  return <HeroPageClient data={data} />;
};

export default HomePage;
