import CollectionsClient from "../CollectionsClient";
import ShoesService from "@/lib/services/shoes.service";
import { ShoesQueryOptions } from "@/types/shoes";

interface KidsPageProps {
  searchParams: Promise<ShoesQueryOptions>;
}

const KidsPage = async ({ searchParams }: KidsPageProps) => {
  const params = await searchParams;
  const initialShoes = await ShoesService.getShoes({
    ...params,
  });
  return <CollectionsClient initialShoes={initialShoes} />;
};

export default KidsPage;

export const metadata = {
  title: "Kid's Collection",
  description: "Shop our kid's collection",
};
