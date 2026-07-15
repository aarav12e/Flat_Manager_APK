// Design language: "building directory nameplate" — the app should feel like the
// engraved unit directory board in a housing society lobby, not a generic admin panel.

export const colors = {
  ink: "#0F172A",       // primary dark - headers, title text (slate-900)
  slate: "#475569",     // secondary text (slate-600)
  slateLight: "#94A3B8", // tertiary text (slate-400)
  cloud: "#F8FAFC",     // app background (slate-50)
  card: "#FFFFFF",      // card backgrounds
  line: "#E2E8F0",      // borders and dividers (slate-200)
  brand: "#2563EB",     // main brand color (blue-600)
  brandSoft: "#EFF6FF", // brand background highlight (blue-50)
  amber: "#D97706",     // accent - notices / announcements (amber-600)
  amberSoft: "#FEF3C7", // notice background (amber-100)
  sage: "#059669",      // rent/sale listings & resolved items (emerald-600)
  sageSoft: "#D1FAE5",  // success background (emerald-100)
  coral: "#DC2626",     // open issues & critical alerts (red-600)
  coralSoft: "#FEE2E2", // alert background (red-100)
  gold: "#CA8A04",      // yellow-600
  goldSoft: "#FEF9C3",  // yellow-100
};

export const fonts = {
  display: "Poppins_600SemiBold",
  displayBold: "Poppins_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
  plate: "RobotoMono_600SemiBold", // used for flat/unit numbers, like an engraved plate
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
};
