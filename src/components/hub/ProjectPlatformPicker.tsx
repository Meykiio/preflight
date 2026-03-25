import { NEW_PROJECT_PLATFORM_OPTIONS } from "@/components/hub/newProjectConfig";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types";

interface ProjectPlatformPickerProps {
  onTogglePlatform: (platform: Platform) => void;
  selectedPlatforms: Platform[];
}

export const ProjectPlatformPicker = ({
  onTogglePlatform,
  selectedPlatforms
}: ProjectPlatformPickerProps): JSX.Element => {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
        Target platforms
      </label>
      <div className="flex flex-wrap gap-2">
        {NEW_PROJECT_PLATFORM_OPTIONS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => onTogglePlatform(platform)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition",
                isSelected
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-outline-variant/15 bg-surface text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              {platform}
            </button>
          );
        })}
      </div>
    </div>
  );
};
