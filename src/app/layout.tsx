
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { SplashLoader } from '@/components/SplashLoader';

export const metadata: Metadata = {
  title: 'AlgoRhythm Tickets | University Events',
  description: 'The official platform for algoරිද්ම and university event tickets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <SplashLoader />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-3 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground mt-2">© {new Date().getFullYear()} IJSE Student Committee. All rights reserved.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
