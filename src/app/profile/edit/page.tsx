"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({}); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://project-ppl-production.up.railway.app/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Gagal memuat profil.");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        "https://project-ppl-production.up.railway.app/profile/edit",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: profile.full_name,
            bio: profile.bio,
            address: profile.address,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Profil berhasil diperbarui!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePictureUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Mengupload gambar...");
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await fetch(
        "https://project-ppl-production.up.railway.app/profile/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProfile((prev) => ({ ...prev, profile_picture: data.imageUrl }));
      toast.dismiss(loadingToast);
      toast.success("Foto profil berhasil diubah!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error ? error.message : "Gagal upload gambar."
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center mt-10">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Toaster />
      <div className="container mx-auto max-w-2xl">
        <form onSubmit={handleFormSubmit}>
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>
            <div className="flex flex-col items-center gap-6">
              {/* Bagian Upload Foto */}
              <div className="relative">
                <Image
                  src={profile.profile_picture || "/images/default-avatar.png"}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary/90"
                >
                  <Camera size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <label htmlFor="full_name">Nama Lengkap</label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profile.full_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="bio">Bio</label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    value={profile.bio || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="address">Alamat</label>
                  <Input
                    id="address"
                    name="address"
                    value={profile.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
