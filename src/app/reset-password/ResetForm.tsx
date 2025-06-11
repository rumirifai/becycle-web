'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    } else {
      setError('Token reset password tidak valid atau tidak ditemukan di URL.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!token) {
      setError('Token tidak valid atau tidak bisa diproses.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      setIsLoading(false);
      return;
    }

    const apiUrl = 'https://project-ppl-production.up.railway.app/auth/reset-password';

    try {
      const res = await fetch(`${apiUrl}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }), 
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mereset password.');
      }
      setMessage(data.message || 'Password berhasil diubah!');
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 text-green-600">Berhasil!</h2>
        <p className="text-slate-600">{message}</p>
        <p className="text-sm text-slate-500 mt-4">Anda sekarang bisa login dengan password baru Anda.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 text-red-600">Error</h2>
        <p className="text-slate-600">{error || 'Token tidak ditemukan.'}</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password Baru</label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
          <Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
        </div>
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Reset Password'}
        </Button>
      </form>
    </>
  );
}