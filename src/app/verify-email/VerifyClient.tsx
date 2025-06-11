'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Sedang memverifikasi email Anda...');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/auth');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

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
        const res = await fetch(`${apiUrl}?id=${id}&token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Proses verifikasi gagal.');
        setStatus('success');
        setMessage(data.message);
      } catch (err: unknown) {
        setStatus('error');
        if (err instanceof Error) setMessage(err.message);
        else setMessage('Terjadi kesalahan yang tidak diketahui.');
      }
    };

    if (searchParams.get('token')) {
      verifyToken();
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Memverifikasi...</h2>
            <div className="spinner"></div>
            <p className="text-slate-600 mt-4">{message}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Verifikasi Berhasil!</h2>
            <p className="text-slate-600">{message}</p>
            <p className="text-sm text-slate-500 mt-4">Anda akan diarahkan ke halaman login dalam 3 detik...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Verifikasi Gagal</h2>
            <p className="text-slate-600">{message}</p>
            <p className="text-sm text-slate-500 mt-4">Silakan coba lagi atau daftar ulang.</p>
          </div>
        );
      default: return null;
    }
  };

  return <>{renderContent()}</>;
}