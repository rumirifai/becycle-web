'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const apiUrl = 'https://project-ppl-production.up.railway.app/auth/forgot-password';

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim email reset.');
      }

      router.push(`/auth/check-email-reset?email=${email}`);

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

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="bg-shape-top"></div>
      <Image
        src="/images/leaves-background.png" alt="Hiasan daun" width={300} height={400}
        className="bg-leaves-bottom" style={{ objectFit: 'contain' }}
      />

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 z-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Lupa Password?</h2>
          <p className="text-sm text-slate-600 mb-6">
            Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan link untuk mereset password Anda.
          </p>

          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <Button className="w-full mt-6" disabled={isLoading}>
            {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
          </Button>
        </form>
      </main>
    </div>
  );
}