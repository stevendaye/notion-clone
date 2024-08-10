import { toast } from "sonner";

export const handleToast = (
  promise: Promise<string | void | null>,
  loading: string,
  success: string,
  error: string
) => {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
};
