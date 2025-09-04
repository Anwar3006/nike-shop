import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteDialogProps = {
  toggleDialog: (open: boolean) => void;
  open: boolean;
  resourceType: string;
  resourceId: string;
  isDeleting: boolean;
  handleDelete: (id: string) => void;
};

export function DeleteDialog({
  toggleDialog,
  open,
  resourceType,
  isDeleting,
  resourceId,
  handleDelete,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={() => toggleDialog(!open)}>
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete your
            ${resourceType} and remove the data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => handleDelete(resourceId)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
