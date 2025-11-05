import { Raleway } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { NextThemeProvider } from '@/components/theme-provider';
import LoadingWrapper from '@/components/loadingWrapper';

const fontRaleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
  variable: "--font-raleway",
});

export const metadata = {
  title: "InfraLens",
  description: "InfraLens - Infrastructure Reporting Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", fontRaleway.className)}>
        <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header />
            <LoadingWrapper>
            <main>{children}</main>
            </LoadingWrapper>
        </NextThemeProvider>
      </body>
    </html>
  );
}
