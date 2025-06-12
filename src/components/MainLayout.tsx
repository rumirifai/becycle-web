"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, History, Newspaper, User, LogOut } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const apiUrl = "https://project-ppl-production.up.railway.app/auth/logout";
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error(
        "Failed to logout on server, but proceeding with client-side logout:",
        error
      );
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/auth");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link href="/home">
            <Image
              src="/images/becycle-logo.png"
              alt="Logo"
              width={35}
              height={35}
            />
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/home"
              className="flex flex-col items-center text-xs text-gray-600 hover:text-primary"
            >
              <Home size={20} />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center text-xs text-gray-600 hover:text-primary"
            >
              <History size={20} />
              <span className="hidden md:inline">History</span>
            </Link>
            <Link
              href="/articles"
              className="flex flex-col items-center text-xs text-gray-600 hover:text-primary"
            >
              <Newspaper size={20} />
              <span className="hidden md:inline">Articles</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-primary">
              <User size={20} />
              <span className="hidden md:inline">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-xs text-red-500 hover:text-red-700"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
