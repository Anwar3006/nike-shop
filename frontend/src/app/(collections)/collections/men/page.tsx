import CollectionsClient from "../CollectionsClient";
import ShoesService from "@/lib/services/shoes.service";
import { ShoesQueryOptions } from "@/types/shoes";

interface MenPageProps {
  searchParams: ShoesQueryOptions;
}

const MenPage = async ({ searchParams }: MenPageProps) => {
  const initialShoes = await ShoesService.getShoes({
    ...searchParams,
    category: "men",
  });
  return <CollectionsClient initialShoes={initialShoes} />;
};

export default MenPage;

export const metadata = {
  title: "Men's Collection",
  description: "Shop our men's collection",
};
