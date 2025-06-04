import { Suspense } from 'react';
import ResetForm from './ResetForm'; 

function LoadingFallback() {
  return (
    <div className="reset-form-container" style={{ textAlign: 'center', padding: '40px 20px' }}> 
      <h2>Memuat Halaman...</h2>
      <div className="spinner"></div> 
      <p style={{ marginTop: '0', fontSize: '1em', color: '#555' }}>
        Mohon tunggu sebentar, sedang memproses permintaan Anda.
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetForm />
    </Suspense>
  );
}