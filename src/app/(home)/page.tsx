'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import ClassesSection from "@/components/home/ClassesSection";
import GiftBanner from "@/components/home/GiftBanner";
import VideoSection from "@/components/home/VideoSection";
import TeachersSection from "@/components/home/TeachersSection";
import PricingSection from "@/components/home/PricingSection";
import ResultsSection from "@/components/home/ResultsSection";
import ReviewsSection from "@/components/home/ReviewsSection";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <Header />
      <Hero />
      <ClassesSection />
      <GiftBanner />
      <VideoSection />
      <TeachersSection />
      <PricingSection />
      <ResultsSection />
      <ReviewsSection />
    </div>
  );
} 