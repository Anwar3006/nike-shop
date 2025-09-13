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

  return <CollectionsClient filters={filters} />;
};

export default CategoryPage;
