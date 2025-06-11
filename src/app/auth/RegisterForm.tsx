'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password minimal harus 8 karakter.");
      setIsLoading(false);
      return;
    }

    const apiUrl = 'https://project-ppl-production.up.railway.app/auth/register';

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
      
      router.push(`/auth/check-email-verification?email=${email}`);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginUrl = 'https://project-ppl-production.up.railway.app/auth/google';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in-50 duration-300">
      <div className="flex flex-col gap-2">
        <label htmlFor="username">Username</label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirm-password">Confirm Password</label>
        <Input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-center text-red-500 bg-red-100 p-2 rounded-md">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign Up'}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or sign in with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          window.location.href = googleLoginUrl;
        }}
      >
        <Image
          src="/images/google.png"
          alt="Google"
          width={24}
          height={24}
        />
        <span className="ml-2">Sign in with Google</span>
      </Button>
    </form>
  );
}