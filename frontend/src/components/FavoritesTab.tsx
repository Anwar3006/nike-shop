"use client";
import React, { useState } from "react";
import { useGetFavorites, useRemoveFavorite } from "@/hooks/api/use-favorites";
import { Button } from "./ui/button";
import { Heart, Trash2, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { DeleteDialog } from "./DeleteDialog";
import { useAddToCart, useRemoveFromCart } from "@/hooks/cache/use-cart";
import { AddToCartParams } from "@/types";
import AddToCartDialog from "./AddToCartDialog";
import { useRouter } from "next/navigation";

const FavoritesTab = () => {
  const { data: favoritesData, isLoading, error } = useGetFavorites();
  const { mutateAsync: removeFromCart } = useRemoveFromCart();
  const { mutateAsync: addToCart, isPending: addingToCart } = useAddToCart();
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isInCart, setIsInToCart] = useState(false);
  const removeFavorite = useRemoveFavorite();

  const handleRemoveFavorite = (favoriteId: string, shoeId: string) => {
    removeFavorite.mutate({ favoriteId, shoeId });
  };

  ///////////////////////// Handle Cart ///////////////////////////////////////////////////
  const handleAddToCart = async (params: AddToCartParams) => {
    if (addingToCart) return;

    try {
      setIsInToCart(true);
      await addToCart({
        cartItem: {
          shoeId: params.shoeId,
          name: params.name,
          image: params.image,
          price: params.price,
          quantity: params.quantity ?? 1,
          size: params.size,
          color: params.color,
        },
      });
    } catch (error) {
      setIsInToCart(false);
      console.error("Failed to add to cart:", error);
    }
  };
  // const handleRemoveFromCart = async (
  //   params: Pick<AddToCartParams, "shoeId" | "size" | "color">
  // ) => {
  //   if (addingToCart) return;

  //   try {
  //     setIsInToCart(false);
  //     await removeFromCart({
  //       cartItem: {
  //         shoeId: params.shoeId,
  //         size: params.size,
  //         color: params.color,
  //       },
  //     });
  //   } catch (error) {
  //     setIsInToCart(true);
  //     console.error("Failed to remove from cart:", error);
  //   }
  // };
  // const toggleCartItem = async (params: AddToCartParams) => {
  //   if (isInCart) {
  //     await handleRemoveFromCart({
  //       shoeId: params.shoeId,
  //       size: params.size,
  //       color: params.color,
  //     });
  //   } else {
  //     await handleAddToCart(params);
  //   }
  // };
  ////////////////////////////////////////////////////////////////////////////

  /////// handle Order Now /////
  const handleOrderNow = (data: AddToCartParams) => {
    // Add to cart and redirect to checkout
    handleAddToCart(data);
    router.push("/checkout");
  };
  //////////////////////////////

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">Favorites</h2>
        <p className="text-red-500 mb-4">Failed to load favorites</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const favorites = favoritesData?.data || [];
  console.log("Favorites: ", favorites);

  return (
    <div aria-hidden={dialogOpen}>
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5" />
        <h2 className="text-xl font-bold">Favorites</h2>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start browsing and save items you love to see them here.
          </p>
          <Button
            onClick={() => (window.location.href = "/collections")}
            className="bg-black text-white hover:bg-gray-800"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src={favorite.shoe.baseImage}
                  alt={favorite.shoe.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-shoe.jpg";
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {favorite.shoe.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {favorite.shoe.categoryName}
                </p>
                <p className="text-lg font-bold text-gray-900 mb-4">
                  ${(favorite.shoe.basePrice / 100).toFixed(2)}
                </p>

                <div className="flex gap-2">
                  <AddToCartDialog
                    open={dialogOpen}
                    toggleDialog={setDialogOpen}
                    shoeData={{
                      id: favorite.shoe.id,
                      name: favorite.shoe.name,
                      image: favorite.shoe.baseImage,
                      price: favorite.shoe.basePrice / 100,
                      availableSizes: favorite.shoe.availableSizes || [
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                      ],
                      availableColors: [
                        { id: "black", name: "Black", hex: "#000000" },
                        { id: "white", name: "White", hex: "#FFFFFF" },
                      ],
                    }}
                    onAddToCart={handleAddToCart}
                    onOrderNow={handleOrderNow}
                  />
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer"
                    onClick={() => setDialogOpen(true)}
                  >
                    {!isInCart ? (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Add to Cart</span>{" "}
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        <span>Remove from Cart</span>{" "}
                      </>
                    )}
                  </Button>

                  <DeleteDialog
                    toggleDialog={setOpenDeleteDialog}
                    open={openDeleteDialog}
                    resourceType="favorite"
                    resourceId={favorite.id}
                    handleDelete={() =>
                      handleRemoveFavorite(favorite.id, favorite.shoeId)
                    }
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenDeleteDialog(true)}
                    disabled={removeFavorite.isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
