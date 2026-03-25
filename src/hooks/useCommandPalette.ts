import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export const useCommandPalette = (): void => {
  const isOpen = useUIStore((state) => state.isCommandPaletteOpen);
  const setCommandPaletteOpen = useUIStore(
    (state) => state.setCommandPaletteOpen
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const key = event.key.toLowerCase();
      const isToggle = (event.metaKey || event.ctrlKey) && key === "k";

      if (isToggle) {
        event.preventDefault();
        setCommandPaletteOpen(!isOpen);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setCommandPaletteOpen]);
};
