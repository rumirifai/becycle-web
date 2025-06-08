// src/app/verify-email/page.tsx
import { Suspense } from 'react';
import VerifyClient from './VerifyClient'; // Impor komponen klien

// Komponen Fallback untuk loading awal
function LoadingFallback() {
  return (
    <div className="reset-form-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Mempersiapkan Halaman Verifikasi...</h2>
      <div className="spinner"></div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyClient />
    </Suspense>
  );
}