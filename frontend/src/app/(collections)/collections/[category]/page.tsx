import ShoesService from "@/lib/services/shoes.service";
import CollectionsClient from "../CollectionsClient";

interface CategoryPageProps extends PageProps<"/collections/[category]"> {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { category } = await params;
  const searchParams_ = await searchParams;
  const filters = { ...searchParams_, category };

  const initialShoes = await ShoesService.getShoes(searchParams_);

  return <CollectionsClient initialShoes={initialShoes} filters={filters} />;
};

export default CategoryPage;
