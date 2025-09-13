import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeDetails from "@/app/(collections)/collections/[category]/[slug]/shoe-details";
import ShoesService from "@/lib/services/shoes.service";
import Image from "next/image";

interface ShoePageProps extends PageProps<"/collections/[category]/[slug]"> {
  params: Promise<{
    category: string;
    slug: string;
  }>;
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

const relatedShoes = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    price: 9830,
    image: "/shoes/shoe-1.jpg",
    colors: 6,
    isBestSeller: true,
    discount: null,
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    price: 9830,
    image: "/shoes/shoe-2.webp",
    colors: 4,
    isBestSeller: false,
    discount: "Extra 20% off",
  },
  {
    id: "3",
    name: "Nike Dunk Low Retro",
    price: 9830,
    image: "/shoes/shoe-3.webp",
    colors: 6,
    isBestSeller: false,
    discount: "Extra 10% off",
  },
];

function RelatedShoesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedShoes.map((shoe) => (
            <div key={shoe.id} className="group cursor-pointer">
              <div className="relative bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
                <div className="absolute top-4 left-4 z-10">
                  {shoe.isBestSeller && (
                    <span className="bg-white text-black text-xs px-3 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                  {shoe.discount && !shoe.isBestSeller && (
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {shoe.discount}
                    </span>
                  )}
                </div>
                <Image
                  src={shoe.image}
                  alt={shoe.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">{shoe.name}</h3>
                <p className="text-gray-600 text-sm">Men&apos;s Shoes</p>
                <p className="text-gray-600 text-sm">
                  {shoe.colors} Colour{shoe.colors !== 1 ? "s" : ""}
                </p>
                <p className="font-semibold text-gray-900 pt-2">
                  ${(shoe.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//"@ts-expect-error"
// function CustomerReviewsSection({ reviews }: { reviews: Review[] }) {
//   const averageRating =
//     reviews?.length > 0
//       ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
//       : 0;

//   return (
//     <section className="bg-white py-16">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Reviews ({reviews?.length || 0})
//           </h2>
//           {reviews?.length > 0 && (
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star
//                     key={star}
//                     className={`h-5 w-5 ${
//                       star <= averageRating
//                         ? "text-yellow-400 fill-yellow-400"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         {/* This is handled by the accordion now */}
//       </div>
//     </section>
//   );
// }

export default async function ShoePage({ params }: ShoePageProps) {
  const { slug } = await params;
  const shoe = await getShoeBySlug(slug);

  if (!shoe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ShoeDetails shoe={shoe} />
      <RelatedShoesSection />
    </div>
  );
}
