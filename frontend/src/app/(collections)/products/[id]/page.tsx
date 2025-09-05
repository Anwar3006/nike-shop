import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeDetails from "./shoe-details";
import ShoesService from "@/lib/services/shoes.service";

interface ShoePageProps {
  params: {
    id: string;
  };
}

const getShoeById = async (id: string): Promise<Shoe | null> => {
  try {
    const shoe = await ShoesService.getShoeById(id);
    return shoe;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return null;
  }
};

export default async function ShoePage({ params }: ShoePageProps) {
  const shoe = await getShoeById(params.id);

  if (!shoe) {
    notFound();
  }

  return <ShoeDetails shoe={shoe} />;
}
