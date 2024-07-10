import { ThemeProvider } from "../components/ThemeProvider";
import { DEFAULT_URL } from "../lib/utils";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: "Supachat starter",
  description: "Simple realtime chat with NextJS and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-[100dvh] flex flex-col items-center">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
