"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { UserProfile, Reward } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, rewardsRes] = await Promise.all([
          fetch("https://project-ppl-production.up.railway.app/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://project-ppl-production.up.railway.app/rewards", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok || !rewardsRes.ok) {
          throw new Error("Gagal memuat data halaman profil.");
        }

        const profileData = await profileRes.json();
        const rewardsData = await rewardsRes.json();

        setProfile(profileData);
        setRewards(rewardsData);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRedeem = async (rewardId: number) => {
    const token = localStorage.getItem("accessToken");
    const loadingToast = toast.loading("Memproses penukaran...");

    try {
      const response = await fetch(
        "https://project-ppl-production.up.railway.app/redeem",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reward_id: rewardId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.dismiss(loadingToast);
      toast.success(data.message);

      setProfile((prev) =>
        prev ? { ...prev, points: data.remainingPoints } : null
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error ? error.message : "Gagal menukarkan reward."
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

  if (!profile) {
    return (
      <MainLayout>
        <p className="text-center">Gagal memuat profil.</p>
      </MainLayout>
    );
  }

  const expForNextLevel = 100;
  const expProgress = ((profile.exp % expForNextLevel) / expForNextLevel) * 100;

  return (
    <MainLayout>
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-6">
            <Image
              src={profile.profile_picture || "/images/default-avatar.png"}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <div className="flex-grow">
              <h1 className="text-2xl font-bold">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-sm text-gray-500">{profile.bio}</p>
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">EXP</p>
                <Progress value={expProgress} className="h-2" />
              </div>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          </div>
        </Card>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Redeem</h2>
          <p className="font-semibold text-lg text-amber-500">
            {profile.points} Poin
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward.reward_id}
              className="text-center p-4 flex flex-col justify-between"
            >
              <Image
                src={reward.image_url}
                alt={reward.name}
                width={100}
                height={100}
                className="mx-auto mb-2 object-contain h-24"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{reward.name}</h3>
                <p className="text-amber-500 font-bold">
                  {reward.points_required} Poin
                </p>
              </div>
              <Button
                size="sm"
                className="w-full mt-4"
                onClick={() => handleRedeem(reward.reward_id)}
              >
                Tukar
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
