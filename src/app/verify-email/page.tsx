import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

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