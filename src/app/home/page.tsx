// src/app/home/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, RefreshCw, X, Recycle, PackageCheck, AlertCircle } from 'lucide-react';
import { DetectionResult } from '@/types'; // Impor tipe data kita yang sudah direvisi

export default function HomePage() {
  const router = useRouter();

  // State untuk alur halaman
  const [pageState, setPageState] = useState<'initial' | 'previewing' | 'loading' | 'results'>('initial');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cek otentikasi saat halaman dimuat
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  // Fungsi untuk menangani pemilihan gambar
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setPageState('previewing');
      setError(null);
    }
  };

  // Fungsi untuk membatalkan dan kembali ke awal
  const handleCancel = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setDetectionResult(null);
    setPageState('initial');
    setError(null);
  };

  // Fungsi untuk submit gambar ke backend
  const handleSubmit = async () => {
    if (!imageFile) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Sesi Anda telah habis. Silakan login kembali.");
      router.push('/auth');
      return;
    }

    setPageState('loading');
    setError(null);

    const formData = new FormData();
    formData.append('file', imageFile); // Pastikan key adalah 'file'

    const apiUrl = 'https://project-ppl-production.up.railway.app/recycling-predict';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal mendeteksi gambar.');
      }

      const result: DetectionResult = await response.json();
      
      setImagePreviewUrl(result.image_url);
      setDetectionResult(result);
      setPageState('results');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
      setPageState('previewing');
    }
  };

  // Fungsi untuk merender konten utama di dalam kartu
  const renderContent = () => {
    switch (pageState) {
      case 'initial':
        return (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Scan Sampahmu</h2>
            <div className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 p-4">
              <Camera size={48} className="text-slate-400" />
              <p className="text-slate-500 mt-2 text-sm">Ambil foto atau upload gambar dari galeri Anda.</p>
            </div>
            <label htmlFor="image-upload" className="w-full inline-block mt-4">
              <Button asChild className="w-full cursor-pointer">
                <span><Upload className="mr-2 h-4 w-4" /> Upload Gambar</span>
              </Button>
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        );

      case 'previewing':
      case 'loading':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Preview Gambar</h2>
            {imagePreviewUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 bg-slate-100">
                <Image src={imagePreviewUrl} alt="Preview" layout="fill" objectFit="contain" />
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="w-full" onClick={handleCancel} disabled={pageState === 'loading'}>
                <X className="mr-2 h-4 w-4" /> Batal
              </Button>
              <Button className="w-full" onClick={handleSubmit} disabled={pageState === 'loading'}>
                {pageState === 'loading' ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : ( 'Deteksi Sampah' )}
                {pageState === 'loading' && <span className="ml-2">Mendeteksi...</span>}
              </Button>
            </div>
          </div>
        );

      case 'results':
        if (!detectionResult) return <div>Error: Hasil tidak ditemukan.</div>;
        return (
          <div className="animate-in fade-in-50">
            {/* Hasil Deteksi */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-100">
              <Image src={imagePreviewUrl!} alt="Detected Item" layout="fill" objectFit="contain" />
            </div>
            <h2 className="text-center font-bold text-2xl mb-1 text-slate-800">{detectionResult.material_type}</h2>
            {detectionResult.can_be_recycled ? (
              <p className="text-center text-sm font-medium text-green-600 mb-4">Dapat Didaur Ulang</p>
            ) : (
              <p className="text-center text-sm font-medium text-red-600 mb-4">Sulit Didaur Ulang</p>
            )}

            {/* Informasi Detail */}
            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 text-left">
              <div>
                <h3 className="font-semibold text-lg flex items-center mb-1"><Recycle className="mr-2 h-5 w-5 text-primary" /> Proses Daur Ulang</h3>
                <p className="text-sm text-slate-600">{detectionResult.recycle_process}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center mb-1"><PackageCheck className="mr-2 h-5 w-5 text-primary" /> Contoh Produk</h3>
                {/* Kita ubah string jadi daftar list */}
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {detectionResult.possible_products.split(',').map((product, i) => (
                    <li key={i}>{product.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-6" onClick={handleCancel}>
              Scan Lagi
            </Button>
          </div>
        );

      default:
        return <div>Terjadi kesalahan, silakan muat ulang halaman.</div>;
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
        <Card className="w-full max-w-sm rounded-2xl p-6 shadow-2xl">
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}