import { useSession } from "@/lib/auth-client";
import UserInfoService from "@/lib/services/userInfo.service";
import { AddressFormData, UserProfileSchemaType } from "@/schemas/auth.schema";
import { ToastID } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetUserInfo = () => {
  const { data: session, isPending } = useSession();
  console.log("Session: ", session);
  if (isPending) console.log("Query is Pending? ", isPending);
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => UserInfoService.getUserInfo(),
    // enabled: !!userId,
    // refetchOnWindowFocus: false,
  });
};

export const useUpdateInfo = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileSchemaType) =>
      UserInfoService.updateInfo({ ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddressFormData) => UserInfoService.upsertAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => UserInfoService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
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
