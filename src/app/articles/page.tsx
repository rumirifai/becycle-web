// src/app/articles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { Article } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      const apiUrl = "https://project-ppl-production.up.railway.app/articles";
      try {
        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal memuat artikel.");
        }
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center mt-10">
          <div className="spinner"></div>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    if (articles.length === 0) {
      return (
        <p className="text-center text-gray-500">
          Tidak ada artikel yang ditemukan saat ini.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <a
            href={article.url}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="block transform hover:-translate-y-1 transition-transform duration-300"
          >
            <Card className="h-full flex flex-col overflow-hidden">
              <div className="relative w-full h-48 bg-gray-200">
                {article.urlToImage ? (
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Gambar tidak tersedia
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <Badge variant="secondary" className="mb-2 self-start">
                  {article.source.name}
                </Badge>
                <h3 className="font-bold text-lg leading-tight flex-grow">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(article.publishedAt)}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Artikel Seputar Sampah & Daur Ulang
        </h1>
        {renderContent()}
      </div>
    </MainLayout>
  );
}
