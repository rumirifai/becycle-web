'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Sedang memverifikasi email Anda, mohon tunggu...');

  useEffect(() => {
    const verifyToken = async () => {
      const id = searchParams.get('id');
      const token = searchParams.get('token');

      if (!id || !token) {
        setStatus('error');
        setMessage('Link tidak valid. Informasi verifikasi tidak ditemukan.');
        return;
      }
      
      const apiUrl = 'https://project-ppl-production.up.railway.app/auth/verify-email';

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Proses verifikasi gagal.');
        }

        setStatus('success');
        setMessage(data.message);

      } catch (err: unknown) {
        setStatus('error');
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage('Terjadi kesalahan yang tidak diketahui.');
        }
      }
    };

    verifyToken();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <h2>Memverifikasi...</h2>
            <div className="spinner"></div>
            <p>{message}</p>
          </>
        );
      case 'success':
        return (
          <>
            <h2 style={{ color: '#28a745' }}>Verifikasi Berhasil!</h2>
            <p>{message}</p>
            <p>Anda sekarang dapat menutup halaman ini dan kembali ke aplikasi untuk login.</p>
          </>
        );
      case 'error':
        return (
          <>
            <h2 style={{ color: '#dc3545' }}>Verifikasi Gagal</h2>
            <p>{message}</p>
            <p>Silakan coba lagi atau hubungi support jika masalah berlanjut.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reset-form-container" style={{ textAlign: 'center' }}>
      {renderContent()}
    </div>
  );
}