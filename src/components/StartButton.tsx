'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function StartButton() {
  const [href, setHref] = useState('/auth'); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setHref('/home');
    }
    setIsLoading(false);
  }, []); 

  if (isLoading) {
    return (
      <Button size="lg" className="px-10 py-6 text-lg" disabled>
        Memuat...
      </Button>
    );
  }

  return (
    <Link href={href}>
      <Button size="lg" className="px-10 py-6 text-lg">
        Mulai Sekarang
      </Button>
    </Link>
  );
}