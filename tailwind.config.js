var config = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Dark Theme Colors (Default)
                // Backgrounds - Deep Space
                background: "#0A0A0F",
                "surface-dimmest": "#0e0e13",
                "surface-darker": "#131318",
                surface: "#131318",
                "surface-bright": "#39383e",
                "surface-container-lowest": "#0e0e13",
                "surface-container-low": "#1b1b20",
                "surface-container": "#1f1f25",
                "surface-container-high": "#2a292f",
                "surface-container-highest": "#35343a",
                "surface-variant": "#35343a",
                // Text - High Contrast
                "on-surface": "#e4e1e9",
                "on-surface-variant": "#c8c4d7",
                "text-primary": "#ffffff",
                "text-secondary": "#b8b8c0",
                "text-tertiary": "#787880",
                // Accents - Desaturated for Dark Mode
                primary: "#c5c0ff",
                "primary-container": "#8b80ff",
                "primary-fixed": "#e4dfff",
                "on-primary": "#2600a1",
                "on-primary-container": "#21008e",
                "on-primary-fixed": "#150067",
                "inverse-primary": "#5647d5",
                secondary: "#6edab4",
                "secondary-container": "#2fa280",
                "secondary-fixed": "#8af7cf",
                "on-secondary": "#003829",
                "on-secondary-container": "#003023",
                tertiary: "#ffb95d",
                "tertiary-container": "#c98100",
                "tertiary-fixed": "#ffddb7",
                "on-tertiary": "#462a00",
                "on-tertiary-container": "#3d2400",
                // Status
                success: "#6edab4",
                warning: "#ffb95d",
                error: "#ffb4ab",
                "error-container": "#93000a",
                "on-error": "#690005",
                "on-error-container": "#ffdad6",
                // Utility
                outline: "#928fa0",
                "outline-variant": "#474554",
                "inverse-surface": "#e4e1e9",
                "inverse-on-surface": "#303036",
                "on-background": "#e4e1e9",
                "surface-tint": "#c5c0ff"
            },
            fontFamily: {
                headline: ["Space Grotesk", "sans-serif"],
                body: ["Inter", "sans-serif"],
                label: ["Inter", "sans-serif"],
                mono: ["Geist Mono", "JetBrains Mono", "monospace"]
            },
            fontSize: {
                // Display
                display: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em" }],
                // Headlines
                "headline-2xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em" }],
                "headline-xl": ["24px", { lineHeight: "32px", letterSpacing: "0" }],
                "headline-lg": ["20px", { lineHeight: "28px", letterSpacing: "0" }],
                "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "0" }],
                "headline-sm": ["16px", { lineHeight: "24px", letterSpacing: "0" }],
                // Body
                "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0" }],
                "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0" }],
                "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0" }],
                // Label
                "label-lg": ["12px", { lineHeight: "16px", letterSpacing: "0.02em" }],
                "label-md": ["11px", { lineHeight: "16px", letterSpacing: "0.04em" }],
                "label-sm": ["10px", { lineHeight: "16px", letterSpacing: "0.1em" }]
            },
            spacing: {
                // 8px Grid System
                "1": "4px",
                "2": "8px",
                "3": "12px",
                "4": "16px",
                "5": "20px",
                "6": "24px",
                "8": "32px",
                "10": "40px",
                "12": "48px",
                "16": "64px",
                "20": "80px",
                "24": "96px"
            },
            borderRadius: {
                DEFAULT: "2px",
                sm: "4px",
                md: "6px",
                lg: "8px",
                xl: "12px",
                "2xl": "16px",
                "3xl": "24px",
                full: "9999px"
            },
            boxShadow: {
                // Subtle glows instead of harsh shadows
                "glow-primary": "0 0 20px rgba(197, 192, 255, 0.2)",
                "glow-secondary": "0 0 20px rgba(110, 218, 180, 0.2)",
                "glow-tertiary": "0 0 20px rgba(255, 185, 93, 0.2)",
                "glow-error": "0 0 20px rgba(255, 180, 171, 0.2)",
                // Elevation through ambient light
                "elevation-1": "0 0 10px rgba(0, 0, 0, 0.3)",
                "elevation-2": "0 0 20px rgba(0, 0, 0, 0.4)",
                "elevation-3": "0 0 40px rgba(0, 0, 0, 0.5)"
            },
            backgroundImage: {
                "gradient-primary": "linear-gradient(135deg, #c5c0ff 0%, #8b80ff 100%)",
                "gradient-surface": "radial-gradient(circle at 50% -20%, #1b1b20 0%, #0A0A0F 100%)"
            },
            transitionTimingFunction: {
                "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
                "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
                spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
            },
            transitionDuration: {
                "250": "250ms",
                "350": "350ms",
                "400": "400ms"
            }
        }
    },
    plugins: []
};
export default config;
