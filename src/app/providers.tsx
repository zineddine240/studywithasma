"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ThemeProvider } from "next-themes";

// Suppress false-positive React 19 warnings caused by next-themes inline script tag
// or browser extensions injecting DOM attributes (e.g. Bitwarden bis_skin_checked, bis_register)
if (process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: any[]) => {
    const errorStr = args
      .map((a) => (typeof a === "string" ? a : a?.message || ""))
      .join(" ");

    if (
      errorStr.includes("Encountered a script tag while rendering React component") ||
      errorStr.includes("bis_skin_checked") ||
      errorStr.includes("bis_register")
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
