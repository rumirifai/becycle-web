'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

export default function ResetPasswordPage() {
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
            setError('Token reset password tidak valid');
        }
    }, [searchParams]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        if (!token) {
            setError('Token tidak valid');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok');
            setIsLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('Password terdiri minimum dari 8 karakter');
            setIsLoading(false);
            return;
        }

        const apiUrl = 'https://project-ppl-production.up.railway.app/auth/reset-password/:token';

        try {
            const res = await fetch(`${apiUrl}/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Reset password gagal, coba lagi.');
            }
            setMessage(data.message || 'Password berhasil diubah!');
            setIsSuccess(true);
            setPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            let errorMessage = 'Terjadi kesalahan. Tidak dapat menghubungi server.';
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="reset-form-container">
                <h2>Berhasil!</h2>
                <p className="message success">{message}</p>
                <p>Anda dapat menutup halaman ini.</p>
            </div>
        );
    }

    if (!token && error) {
        return (
          <div className="reset-form-container">
            <h2>Error</h2>
            <p className="message error">{error}</p>
          </div>
        );
    }

    return (
        <div className="reset-form-container">
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password">Password Baru:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading || !token} />
            </div>
            <div>
              <label htmlFor="confirmPassword">Konfirmasi Password Baru:</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading || !token} />
            </div>
            {error && (token || isLoading) && <p className="message error">{error}</p>}
            <button type="submit" disabled={isLoading || !token}>
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </button>
          </form>
        </div>
    );

}