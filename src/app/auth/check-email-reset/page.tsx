// src/app/auth/check-email-reset/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { StatusCard } from '../StatusCard';
import { Suspense } from 'react';

function ResetComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleResendReset = async (): Promise<string> => {
    if (!email) return "Email tidak ditemukan untuk dikirim ulang.";

    const apiUrl = 'https://project-ppl-production.up.railway.app/auth/resend-reset';
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.message || "Email reset password telah dikirim ulang.";
    } catch (error) {
      return "Gagal mengirim ulang email.";
    }
  };

  return (
    <StatusCard
      title="Check Your Email!"
      description="Kami telah mengirim link untuk mereset password Anda. Setelah membuat password baru, Anda bisa login kembali ke aplikasi."
      buttonText="Resend Email"
      iconSrc="/images/email-reset-icon.png"
      resendAction={handleResendReset}
    />
  );
}

export default function CheckEmailResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetComponent />
    </Suspense>
  )
}