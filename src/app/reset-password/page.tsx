import { Suspense } from 'react';
import Image from 'next/image';
import ResetForm from './ResetForm';

function LoadingFallback() {
  return (
    <div className="text-center">
      <h2>Memuat Halaman...</h2>
      <div className="spinner"></div>
      <p>Mohon tunggu sebentar.</p>
    </div>
  );
}

export default function ResetPasswordPage() {
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
            <ResetForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}