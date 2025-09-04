import { useSession } from "@/lib/auth-client";
import UserInfoService from "@/lib/services/userInfo.service";
import { UserProfileSchemaType } from "@/schemas/auth.schema";
import { ToastID } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetUserInfo = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => UserInfoService.getUserInfo(),
    enabled: !!userId,
    // refetchOnWindowFocus: false,
  });
};

export const useUpdateInfo = (data: UserProfileSchemaType) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const userData = { ...data, userId: userId! };
  return useMutation({
    mutationKey: ["userInfo", userId],
    mutationFn: () => UserInfoService.updateInfo(userData),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
      toast.success("User info updated successfully", {
        id: ToastID.UPDATE_USER_INFO_SUCCESS,
      });
    },
    onError: (error: Error) => {
      toast.error("Error updating user info", {
        id: ToastID.UPDATE_USER_INFO_ERROR,
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};

export const useUpsertAddress = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationKey: ["userInfo", userId],
    mutationFn: (data: any) =>
      UserInfoService.upsertAddress({ ...data, userId }),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
      toast.success("Address upserted successfully", {
        id: ToastID.UPSERT_ADDRESS_SUCCESS,
      });
    },
    onError: (error: Error) => {
      toast.error("Error upserting address", {
        id: ToastID.UPSERT_ADDRESS_ERROR,
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};

export const useDeleteAddress = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationKey: ["userInfo", userId],
    mutationFn: (addressId: string) => UserInfoService.deleteAddress(addressId),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
      toast.success("Address deleted successfully", {
        id: ToastID.DELETE_ADDRESS_SUCCESS,
      });
    },
    onError: (error: Error) => {
      toast.error("Error deleting address", {
        id: ToastID.DELETE_ADDRESS_ERROR,
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
};
