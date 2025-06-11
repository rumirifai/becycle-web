'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';

interface StatusCardProps {
  title: string;
  description: string;
  buttonText: string;
  iconSrc: string;
  resendAction: () => Promise<string>;
}

export function StatusCard({ title, description, buttonText, iconSrc, resendAction }: StatusCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setIsLoading(true);
    setMessage('');
    const resultMessage = await resendAction();
    setMessage(resultMessage);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="bg-shape-top"></div>
      <Image
        src="/images/leaves-background.png" alt="Hiasan daun" width={300} height={400}
        className="bg-leaves-bottom" style={{ objectFit: 'contain' }}
      />

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <Image src={iconSrc} alt="Status Icon" width={80} height={80} className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-sm text-slate-600 mb-6">{description}</p>
          <Button className="w-full" onClick={handleResend} disabled={isLoading}>
            {isLoading ? 'Mengirim...' : buttonText}
          </Button>
          {message && <p className="text-sm text-slate-600 mt-4">{message}</p>}
        </div>
      </main>
    </div>
  );
}