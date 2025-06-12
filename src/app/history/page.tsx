'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import { HistoryItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      const apiUrl = 'https://project-ppl-production.up.railway.app/history';
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Gagal memuat riwayat.');
        }
        const data: HistoryItem[] = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (isLoading) {
    return <MainLayout><div className="flex justify-center mt-10"><div className="spinner"></div></div></MainLayout>;
  }

  if (error) {
    return <MainLayout><p className="text-center text-red-500">{error}</p></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Riwayat Scan</h1>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">Anda belum memiliki riwayat scan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Link href={`/history/${item.history_id}`} key={item.history_id}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden bg-gray-200">
                      <Image src={item.image_url} alt={item.prediction_result} layout="fill" objectFit="cover" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.prediction_result}</h3>
                    <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}