import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({
  children
}: ToastProviderProps): JSX.Element => {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f1f25",
            color: "#e4e1e9",
            border: "1px solid rgba(71, 69, 84, 0.24)"
          }
        }}
      />
    </>
  );
};
