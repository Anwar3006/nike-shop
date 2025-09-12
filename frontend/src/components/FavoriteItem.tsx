"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart } from "lucide-react";

import { Button } from "./ui/button";
import { DeleteDialog } from "./DeleteDialog";
import AddToCartDialog from "./AddToCartDialog";
import { useGetCart, useAddToCart } from "@/hooks/cache/use-cart";
import { useRemoveFavorite } from "@/hooks/api/use-favorites";
import { FavoriteItem as Favorite } from "@/types/favorites";
import { AddToCartParams, CartItem } from "@/types/cart";

type FavoriteItemProps = {
  favorite: Favorite;
};

export const FavoriteItem = ({ favorite }: FavoriteItemProps) => {
  const router = useRouter();
  const { data: cart } = useGetCart();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { mutate: removeFavorite, isPending: removing } = useRemoveFavorite();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isInCart =
    cart?.some(
      (item: { itemKey: string; value: CartItem }) =>
        item.value.shoeId === favorite.shoe.id
    ) || false;

  const handleRemoveFavorite = () => {
    removeFavorite({ favoriteId: favorite.id, shoeId: favorite.shoeId });
  };

  const handleAddToCart = async (params: AddToCartParams) => {
    try {
      await addToCart({
        cartItem: {
          shoeId: params.shoeId,
          name: favorite.shoe.name,
          image:
            favorite.shoe.variants
              .flatMap((v) => v.images)
              .find((img) => img.isPrimary)?.url ||
            favorite.shoe.variants[0]?.images[0]?.url ||
            "/placeholder.png",
          price: favorite.shoe.variants[0]?.price
            ? parseFloat(favorite.shoe.variants[0].price)
            : 0,
          quantity: params.quantity ?? 1,
          size: params.size,
          color: params.color,
        },
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleOrderNow = async (data: AddToCartParams) => {
    await handleAddToCart(data);
    router.push("/checkout");
  };

  const handleCartAction = () => {
    if (isInCart) {
      router.push("/cart");
    } else {
      setDialogOpen(true);
    }
  };

  const primaryImage =
    favorite.shoe.variants.flatMap((v) => v.images).find((img) => img.isPrimary)
      ?.url ||
    favorite.shoe.variants[0]?.images[0]?.url ||
    "/placeholder.png";

  const price = favorite.shoe.variants[0]?.price
    ? parseFloat(favorite.shoe.variants[0].price)
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={primaryImage}
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
          {favorite.shoe.category.name}
        </p>
        <p className="text-lg font-bold text-gray-900 mb-4">
          ${price.toFixed(2)}
        </p>

        <div className="flex gap-2">
          <AddToCartDialog
            open={dialogOpen}
            toggleDialog={setDialogOpen}
            shoeData={{
              id: favorite.shoe.id,
              name: favorite.shoe.name,
              image: primaryImage,
              price: price,
              availableSizes:
                favorite.shoe.variants?.map((v) => v.size.value) || [],
              availableColors:
                favorite.shoe.variants?.map((v) => ({
                  ...v.color,
                  hex: v.color.hexCode,
                })) || [],
            }}
            onAddToCart={handleAddToCart}
            onOrderNow={handleOrderNow}
          />
          <Button
            className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer"
            onClick={handleCartAction}
            disabled={isPending}
          >
            {isInCart ? (
              <>
                <span>Go to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span>Add to Cart</span>
              </>
            )}
          </Button>

          <DeleteDialog
            toggleDialog={setOpenDeleteDialog}
            open={openDeleteDialog}
            resourceType="favorite"
            resourceId={favorite.id}
            handleDelete={handleRemoveFavorite}
            isDeleting={removing}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenDeleteDialog(true)}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
