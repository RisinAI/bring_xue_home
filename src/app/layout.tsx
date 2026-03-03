import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Support & Updates",
  description: "A hub for updates and testimonies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col`}>
        <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold text-xl tracking-tight text-blue-700">
              Support Hub
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Updates
              </Link>
              <Link href="/testimonies" className="text-slate-600 hover:text-slate-900 transition-colors">
                Testimonies
              </Link>
              <Link href="/donate" className="text-slate-600 hover:text-slate-900 transition-colors">
                Donate
              </Link>

              {session?.user ? (
                <div className="flex items-center space-x-4">
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                      Admin
                    </Link>
                  )}
                  <form action={async () => {
                    "use server"
                    const { signOut } = await import("@/auth")
                    await signOut()
                  }}>
                    <button type="submit" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/api/auth/signin" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white mt-auto border-t border-slate-200 text-center py-6 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Support Hub.
        </footer>
      </body>
    </html>
  );
}
