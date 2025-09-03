"use client";
import React from "react";
import { useGetFavorites } from "@/hooks/api/use-favorites";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { FavoriteItem } from "./FavoriteItem";

const FavoritesTab = () => {
  const { data: favoritesData, isLoading, error } = useGetFavorites();

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

  return (
    <div>
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
            <FavoriteItem key={favorite.id} favorite={favorite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
