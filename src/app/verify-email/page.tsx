import { Suspense } from 'react';
import Image from 'next/image';
import VerifyClient from './VerifyClient';

function LoadingFallback() {
  return (
    <div className="text-center">
      <h2>Mempersiapkan...</h2>
      <div className="spinner"></div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="bg-shape-top"></div>
      <Image
        src="/images/leaves-background.png" alt="Hiasan daun" width={300} height={400}
        className="bg-leaves-bottom" style={{ objectFit: 'contain' }}
      />
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <Suspense fallback={<LoadingFallback />}>
            <VerifyClient />
          </Suspense>
        </div>
      </main>
    </div>
  );
}