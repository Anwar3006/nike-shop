import { useSession } from "@/lib/auth-client";
import { redisClient } from "@/lib/cache/redis-client";
import { ToastID } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

// GET cart items
export const useGetCart = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await axios.get("/api/cart");
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<
    { success: boolean; message: string },
    Error,
    {
      cartItem: {
        shoeId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        size: string;
        color?: string;
        variantId: string;
      };
    }
  >({
    mutationFn: async ({ cartItem }) => {
      const response = await axios.post("/api/cart", cartItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      queryClient.invalidateQueries({ queryKey: ["cartSize", userId] });

      toast.success("Added to cart", {
        id: ToastID.ADD_TO_CART_SUCCESS,
        description: "Item has been added to your cart.",
        duration: 4000,
        descriptionClassName: "text-green-800 font-medium",
      });
    },

    onError: (error: unknown) => {
      console.error("Error with useAddToCart hook: ", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.warning(
            "Item already in cart, increase quantity from cart page"
          );
          return;
        }

        toast.error("Failed to add to cart", {
          id: ToastID.ADD_TO_CART_ERROR,
          description:
            error.response?.data?.error ||
            "Something went wrong. Please try again.",
          duration: 8000,
        });
      } else {
        toast.error("Failed to add to cart", {
          id: ToastID.ADD_TO_CART_ERROR,
          description: "Something went wrong. Please try again.",
          duration: 8000,
        });
      }
    },
  });
};

// REMOVE from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<
    { success: boolean },
    Error,
    {
      cartItem: {
        shoeId: string;
        size: string;
        color?: string;
      };
    }
  >({
    mutationFn: async ({ cartItem }) => {
      try {
        const response = await axios.delete("/api/cart", { data: cartItem });
        return response.data;
      } catch (error) {
        console.error("Error removing item from cart: ", error);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      queryClient.invalidateQueries({ queryKey: ["cartSize", userId] });

      toast.success("Removed from cart", {
        id: ToastID.REMOVE_FROM_CART_SUCCESS,
        description: "Item has been removed from your cart.",
        duration: 4000,
        descriptionClassName: "text-green-800 font-medium",
      });
    },

    onError: (error: unknown) => {
      console.error("Error with useRemoveFromCart hook: ", error);
      if (error instanceof AxiosError) {
        toast.error("Failed to remove from cart", {
          id: ToastID.REMOVE_FROM_CART_ERROR,
          description:
            error.response?.data?.error ||
            "Something went wrong. Please try again.",
          duration: 8000,
        });
      } else {
        toast.error("Failed to remove from cart", {
          id: ToastID.REMOVE_FROM_CART_ERROR,
          description: "Something went wrong. Please try again.",
          duration: 8000,
        });
      }
    },
  });
};

// GET cart size
export const useCartSize = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["cartSize", userId],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/cart");
        return Array.isArray(response.data) ? response.data.length : 0;
      } catch (error) {
        console.error("Error fetching cart size:", error);
        return 0;
      }
    },
    enabled: !!userId,
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("User must be logged in to clear cart");
      }

      const cartInstance = await redisClient();
      if (!cartInstance) {
        throw new Error("Redis client not initialized");
      }

      const cartKey = `cart:${userId}`;
      const itemsKey = `cart:${userId}:items`;

      // Delete both the hash and sorted set
      await Promise.all([
        cartInstance.del(cartKey),
        cartInstance.del(itemsKey),
      ]);

      return { success: true };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      queryClient.invalidateQueries({ queryKey: ["cartSize", userId] });

      toast.success("Cart cleared", {
        id: ToastID.EMPTY_CART_SUCCESS,
        description: "All items have been removed from your cart.",
        duration: 4000,
        descriptionClassName: "text-green-800 font-medium",
      });
    },
    onError: (error) => {
      toast.error("Failed to clear cart", {
        id: ToastID.EMPTY_CART_ERROR,
        description: error.message || "Something went wrong. Please try again.",
        duration: 8000,
      });
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<
    void,
    Error,
    {
      shoeId: string;
      quantity: number;
      size: string;
      color?: string;
    }
  >({
    mutationFn: async ({ shoeId, quantity, size, color }) => {
      const response = await axios.patch("/api/cart/update", {
        shoeId,
        quantity,
        size,
        color,
      });
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });

      // Show success toast
      toast.success("Updated cart item quantity successfully", {
        id: ToastID.UPDATE_CART_SUCCESS,
        description: "Item has been added to your cart.",
        duration: 4000,
        descriptionClassName: "text-green-800 font-medium",
      });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      // Show error toast
      toast.error("❌Failed to update cart item quantity😪", {
        id: ToastID.UPDATE_CART_ERROR,
        description: error.message || "Something went wrong. Please try again.",
        duration: 8000,
      });
    },
  });
};
