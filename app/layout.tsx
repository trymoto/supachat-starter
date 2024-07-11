import { ReactQueryClientProvider } from "@/components/ReactQueryProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import { DEFAULT_URL } from "../lib/utils";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: "Supachat",
  description: "Simple realtime chat with NextJS and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground flex flex-col items-center overflow-y-auto w-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <audio id="tap-audio" src="tap.mp3"></audio>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
