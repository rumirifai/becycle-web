'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('accessToken', token);
      window.location.href = '/home';
    } else {
      router.push('/auth');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="spinner"></div>
      <p className="mt-4">Mengarahkan Anda, mohon tunggu...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
        <Suspense>
            <CallbackComponent />
        </Suspense>
    )
}