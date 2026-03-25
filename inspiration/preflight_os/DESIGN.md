# Design System Specification: The Developer Cockpit

## 1. Overview & Creative North Star
**Creative North Star: The Intelligent HUD**
This design system is not a static interface; it is a high-performance instrument. Inspired by advanced aerospace telemetry and "Iron Man’s Workshop," the aesthetic moves away from flat, generic "SaaS Blue" layouts toward a sophisticated, multi-layered "Developer Cockpit." 

To break the "template" look, we employ **Intentional Asymmetry**. Dashboards should feel like a custom-built workshop—where the most critical data "floats" closer to the user, and secondary information recedes into the deep space of the background. By using high-contrast typography scales and overlapping glass surfaces, we create a sense of focused intelligence and technical mastery.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the "Deep Space" spectrum, utilizing the Material Design convention to manage functional roles with high-tech precision.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for layout sectioning. In this system, boundaries are defined through **Tonal Shifting**. A section is differentiated from the background by moving from `surface` (#131318) to `surface_container_low` (#1b1b20). This creates a sophisticated, seamless transition that feels etched rather than drawn.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of technical glass. 
*   **Base Layer:** `surface` (#131318) — The vast cockpit floor.
*   **Primary Panels:** `surface_container_low` (#1b1b20) — Integrated instrumentation panels.
*   **Floating Modules:** `surface_container_high` (#2a292f) — Active tools requiring focus.
*   **The "Glass & Gradient" Rule:** Floating elements must use `surface_bright` at 60% opacity with a `backdrop-filter: blur(12px)`. To provide "soul," primary CTAs must use a linear gradient: `primary` (#c5c0ff) to `primary_container` (#8b80ff) at a 135° angle.

### Signature Accents
*   **Electric Violet (`primary`):** The pulse of the system. Used for core interactions and "living" elements.
*   **Teal (`secondary`):** System health, active processes, and successful deployments.
*   **Amber (`tertiary`):** Critical telemetry warnings and high-priority prompts.

---

## 3. Typography
The typographic voice is technical, clear, and authoritative. We pair the humanistic clarity of **Inter/Geist** with the mechanical precision of **Space Grotesk** for display elements.

*   **Display & Headlines (Space Grotesk):** Large, wide-tracking headers that feel like HUD readouts. These should be set in `headline-lg` (2rem) for major sections to command immediate attention.
*   **UI & Body (Inter):** Optimized for long-form legibility during deep work. Use `body-md` (0.875rem) for standard text to maintain a high information density without clutter.
*   **Monospace Utility (Geist Mono):** Every line of code or terminal prompt must use the Mono scale. This creates a clear visual distinction between "System UI" and "User Data."

---

## 4. Elevation & Depth
In a cockpit, distance matters. We achieve depth through **Tonal Layering** rather than drop shadows.

*   **The Layering Principle:** Instead of shadows, stack containers. Place a `surface_container_lowest` card inside a `surface_container_high` panel to create an "inset" technical look.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, it must be an "Atmospheric Glow." Use the `primary` color at 5% opacity with a 40px blur—simulating the light bleed from a high-tech screen.
*   **The "Ghost Border" Fallback:** For containment on dark backgrounds, use a `px` stroke of `outline_variant` at **10% opacity**. This creates a "sub-pixel" feel that looks sharp on Retina displays but remains nearly invisible to the casual eye.
*   **Subtle Noise:** Apply a 2% grain texture over the `background` layer to eliminate digital banding and provide a tactile, "workshop" feel.

---

## 5. Components

### Primary Action Buttons
*   **Style:** `primary_container` background with a `primary` border glow.
*   **Interaction:** On hover, the border-glow should animate—a rotating gradient using `primary` and `secondary`. 
*   **Rounding:** `md` (0.375rem) to maintain a technical, slightly aggressive edge.

### The "Telemetry" Chip
*   **Style:** Ghost borders (10% opacity) with a small leading dot using the `secondary` (Teal) color for "Active" states.
*   **Spacing:** `0.5` (0.1rem) vertical, `2.5` (0.5rem) horizontal.

### Input Fields (The "Terminal" Style)
*   **Style:** No background fill. Only a bottom border using `outline_variant` at 20% opacity. 
*   **Focus State:** The bottom border transforms into a `primary` gradient, and the label (`label-sm`) shifts to `primary` color.

### Cockpit Cards & Lists
*   **Rule:** **Zero Dividers.** Separate list items using `Spacing: 2` (0.4rem) and alternating background tiers between `surface_container_low` and `surface_container_lowest`. 
*   **Additional Component - The "Status HUD":** A persistent, glassmorphic floating bar at the bottom of the viewport using `backdrop-filter: blur(20px)` to show real-time system metrics.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** Use `Spacing: 10` (2.25rem) to separate major functional blocks. 
*   **Use Subtle Transitions:** All state changes (hover, focus, active) must use a `300ms cubic-bezier(0.4, 0, 0.2, 1)` transition for a "fluid machinery" feel.
*   **Layer Glass:** Overlap glass containers slightly to show off the `backdrop-blur` and depth.

### Don't:
*   **No Pure Black:** Never use `#000000`. Use the `surface_container_lowest` (#0e0e13) for the deepest blacks to maintain tonal depth.
*   **No High-Contrast Borders:** Never use 100% opaque borders. They break the "Iron Man Workshop" immersion.
*   **No Standard Shadows:** Avoid the "Material 1.0" look. Depth comes from color and blur, not black offsets.
*   **No Rounded Corners over 0.75rem:** Keep the aesthetic precise. Use `xl` (0.75rem) for main containers and `sm` or `md` for internal components.