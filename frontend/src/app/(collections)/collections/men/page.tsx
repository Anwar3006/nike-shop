import CollectionsClient from "../CollectionsClient";
import ShoesService from "@/lib/services/shoes.service";
import { ShoesQueryOptions } from "@/types/shoes";

interface MenPageProps {
  searchParams: ShoesQueryOptions;
}

const MenPage = async ({ searchParams }: MenPageProps) => {
  const params = await searchParams;
  const initialShoes = await ShoesService.getShoes({
    ...params,
  });
  return <CollectionsClient initialShoes={initialShoes} />;
};

export default MenPage;

export const metadata = {
  title: "Men's Collection",
  description: "Shop our men's collection",
};
