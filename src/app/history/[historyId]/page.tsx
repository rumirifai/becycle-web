'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import { HistoryItem } from '@/types';
import { Card } from '@/components/ui/card';

interface HistoryDetailPageProps {
  params: {
    historyId: string;
  };
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const router = useRouter();
  const { historyId } = params;
  const [detail, setDetail] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) {
        setIsLoading(false);
        setError("History ID tidak ditemukan di URL.");
        return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      const apiUrl = `https://project-ppl-production.up.railway.app/history/${historyId}`;
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal memuat detail riwayat.');
        }
        const data: HistoryItem = await response.json();
        setDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [historyId, router]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center mt-10">
          <div className="spinner"></div>
        </div>
      );
    }

    if (error || !detail) {
      return (
        <p className="text-center text-red-500">{error || 'Data tidak ditemukan.'}</p>
      );
    }

    return (
      <div className="container mx-auto max-w-2xl">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">{detail.prediction_result}</h1>
          <p className="text-md text-gray-500 mb-6">
            Di-scan pada{' '}
            {new Date(detail.created_at).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden bg-gray-200">
            <Image
              src={detail.image_url}
              alt={detail.prediction_result}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="mt-6 space-y-4">
            {detail.recycle_process && (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">Proses Daur Ulang</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{detail.recycle_process}</p>
                </div>
            )}
            {detail.possible_products && (
                <div>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">
                        Contoh Produk Hasil Daur Ulang
                    </h2>
                    <ul className="list-disc list-inside text-gray-700">
                    {detail.possible_products
                        ?.split(',')
                        .map((product, i) => <li key={i}>{product.trim()}</li>)}
                    </ul>
                </div>
            )}
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <MainLayout>
        {renderContent()}
    </MainLayout>
  );
}