import { notFound } from "next/navigation";
import { Shoe } from "@/types/shoes";
import ShoeDetails from "./shoe-details";
import ShoesService from "@/lib/services/shoes.service";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ShoePageProps {
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

// Mock data for "You Might Also Like" section
const relatedShoes = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    price: 9830,
    image: "/api/placeholder/300/300",
    colors: 6,
    isNewArrival: false,
    discount: null,
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    price: 9830,
    image: "/api/placeholder/300/300",
    colors: 4,
    isNewArrival: false,
    discount: "Extra 20% off",
  },
  {
    id: "3",
    name: "Nike Dunk Low Retro",
    price: 9830,
    image: "/api/placeholder/300/300",
    colors: 6,
    isNewArrival: false,
    discount: "Extra 10% off",
  },
  {
    id: "4",
    name: "Nike Air Max 97",
    price: 17000,
    image: "/api/placeholder/300/300",
    colors: 3,
    isNewArrival: true,
    discount: null,
  },
];

function RelatedShoesSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            You Might Also Like
          </h2>
          <p className="text-gray-600">
            Discover more styles that complement your taste
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedShoes.map((shoe) => (
            <div key={shoe.id} className="group cursor-pointer">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4">
                {shoe.isNewArrival && (
                  <span className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded z-10">
                    New
                  </span>
                )}
                {shoe.discount && (
                  <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded z-10">
                    {shoe.discount}
                  </span>
                )}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Shoe Image</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {shoe.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {shoe.colors} Colour{shoe.colors !== 1 ? "s" : ""}
                </p>
                <p className="font-semibold text-gray-900">
                  ${shoe.price / 100}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Similar Products
          </Button>
        </div>
      </div>
    </section>
  );
}

function CustomerReviewsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2">
              4.8 out of 5 (2,847 reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              &quot;Amazing comfort and style! These are my go-to sneakers for
              everything from workouts to casual outings.&quot;
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Jessica K.</span> • Verified
              Purchase
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              &quot;Perfect fit and the quality is outstanding. Nike never
              disappoints with their Air Max line!&quot;
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Marcus T.</span> • Verified Purchase
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              &quot;Love the retro vibe and the cushioning is incredible. Highly
              recommend for anyone looking for style and comfort.&quot;
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Riley M.</span> • Verified Purchase
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Read All Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Stay In The Know
          </h2>
          <p className="text-gray-300 mb-8">
            Be the first to hear about new releases, exclusive offers, and the
            latest Nike news.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-white focus:outline-none"
            />
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            By signing up, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function ShoePage({ params }: ShoePageProps) {
  const { slug } = await params;
  const shoe = await getShoeBySlug(slug);

  if (!shoe) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ShoeDetails shoe={shoe} />
      <RelatedShoesSection />
      <CustomerReviewsSection />
      <NewsletterSection />
    </div>
  );
}
