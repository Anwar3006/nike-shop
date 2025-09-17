import CollectionsClient from "../CollectionsClient";
import ShoesService from "@/lib/services/shoes.service";
import { ShoesQueryOptions } from "@/types/shoes";

interface WomenPageProps {
  searchParams: ShoesQueryOptions;
}

const WomenPage = async ({ searchParams }: WomenPageProps) => {
  const params = await searchParams;
  const initialShoes = await ShoesService.getShoes({
    ...params,
  });
  return <CollectionsClient initialShoes={initialShoes} />;
};

export default WomenPage;

export const metadata = {
  title: "Women's Collection",
  description: "Shop our women's collection",
};
