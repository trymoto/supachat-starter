import "@/app/globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReactQueryClientProvider } from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { DEFAULT_URL } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: "Supachat",
  description: "Simple realtime chat with NextJS and Supabase",
};

type RootLayoutProps = PropsWithChildren<{}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className="no-scrollbar" suppressHydrationWarning>
        <body className="bg-background text-foreground flex flex-col items-center overflow-y-auto w-full">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ErrorBoundary>{children}</ErrorBoundary>
            <audio id="tap-audio" src="/tap.mp3"></audio>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
