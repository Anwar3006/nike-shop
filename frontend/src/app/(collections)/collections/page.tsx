import CollectionsClient from "./CollectionsClient";
import { Suspense } from "react";
import ShoesService from "@/lib/services/shoes.service";
import { ShoesQueryOptions } from "@/types/shoes";

interface CollectionsPageProps {
  searchParams: Promise<ShoesQueryOptions>;
}

const CollectionsPage = async ({ searchParams }: CollectionsPageProps) => {
  const params = await searchParams;
  const initialShoes = await ShoesService.getShoes(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">Loading...</div>
      }
    >
      <CollectionsClient initialShoes={initialShoes} />
    </Suspense>
  );
};

export default CollectionsPage;
