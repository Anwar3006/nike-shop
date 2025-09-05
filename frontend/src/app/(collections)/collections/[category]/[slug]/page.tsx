import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeDetails from "@/components/ShoeDetails";
import ShoesService from "@/lib/services/shoes.service";

interface ShoePageProps {
  params: {
    category: string;
    slug: string;
  };
}

const getShoeBySlug = async (slug: string): Promise<Shoe | null> => {
  try {
    const shoe = await ShoesService.getShoeBySlug(slug);
    return shoe;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return null;
  }
};

export default async function ShoePage({ params }: ShoePageProps) {
  const shoe = await getShoeBySlug(params.slug);

  if (!shoe) {
    notFound();
  }

  return <ShoeDetails shoe={shoe} />;
}
