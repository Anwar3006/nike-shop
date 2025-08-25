import { products } from "@/lib/data";
import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";

interface SearchParams {
  gender?: string;
  size?: string;
  color?: string;
  price?: string;
  sort?: string;
}

const CollectionsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  let filteredProducts = [...products];

  // Filtering
  if (searchParams.gender) {
    const genders = searchParams.gender.split(",");
    filteredProducts = filteredProducts.filter((product) =>
      genders.includes(product.gender)
    );
  }

  if (searchParams.size) {
    const sizes = searchParams.size.split(",");
    filteredProducts = filteredProducts.filter((product) =>
      product.sizes.some((size) => sizes.includes(size))
    );
  }

  if (searchParams.color) {
    const colors = searchParams.color.split(",");
    filteredProducts = filteredProducts.filter((product) =>
      product.colors.some((color) => colors.includes(color.name))
    );
  }

  if (searchParams.price) {
    const [min, max] = searchParams.price.split("-").map(Number);
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= min && product.price <= max
    );
  }

  // Sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "newest":
        // Assuming higher id is newer
        filteredProducts.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // featured - no specific sorting for now
        break;
    }
  }

  const activeFilters = Object.entries(searchParams).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Sort />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Filters />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(
              (filter) =>
                filter.value && (
                  <span
                    key={filter.key}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {filter.key}: {filter.value}
                  </span>
                )
            )}
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  imgSrc={product.images[0]}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  colorCount={product.colors.length}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-500">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
