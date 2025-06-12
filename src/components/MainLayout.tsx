import Image from 'next/image';
import Link from 'next/link';
import { Home, History, Newspaper, User } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link href="/home">
            <Image src="/images/becycle-logo.png" alt="Logo" width={35} height={35} />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex flex-col items-center text-xs text-gray-600 hover:text-primary">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center text-xs text-gray-600 hover:text-primary">
              <History size={20} />
              <span>History</span>
            </Link>
            <Link href="/articles" className="flex flex-col items-center text-xs text-gray-600 hover:text-primary">
              <Newspaper size={20} />
              <span>Articles</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-primary">
              <User size={20} />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="p-4">
        {children}
      </main>
    </div>
  );
}