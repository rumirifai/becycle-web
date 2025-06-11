// src/app/auth/check-email-verification/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { StatusCard } from '../StatusCard';
import { Suspense } from 'react';

function VerificationComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleResendVerification = async (): Promise<string> => {
    if (!email) return "Email tidak ditemukan untuk dikirim ulang.";

    const apiUrl = 'https://project-ppl-production.up.railway.app/auth/resend-email';
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.message || "Email verifikasi telah dikirim ulang.";
    } catch (error) {
      return "Gagal mengirim ulang email.";
    }
  };

  return (
    <StatusCard
      title="Check Your Email!"
      description="Kami telah mengirim link verifikasi ke email Anda. Silakan buka dan klik link tersebut untuk menyelesaikan proses pendaftaran."
      buttonText="Resend Email"
      iconSrc="/images/email-verification-icon.png"
      resendAction={handleResendVerification}
    />
  );
}

export default function CheckEmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationComponent />
    </Suspense>
  )
}