import { toast } from "react-hot-toast";

export const useToast = () => ({
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
  warning: (message: string) =>
    toast(message, {
      icon: "!",
      style: {
        background: "#2a292f",
        color: "#e4e1e9",
        border: "1px solid rgba(255, 185, 93, 0.24)"
      }
    })
});
