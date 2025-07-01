'use client';

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useModal } from "@/hooks/useModal";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import ClassesSection from "@/components/home/ClassesSection";
import GiftBanner from "@/components/home/GiftBanner";
import VideoSection from "@/components/home/VideoSection";
import TeachersSection from "@/components/home/TeachersSection";
import FreeLessonSection from "@/components/home/FreeLessonSection";
import ResultsSection from "@/components/home/ResultsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import { Footer, PricingSection } from "@/components/home";
import { Suspense } from "react";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useUserStore();
  const { openPaymentSuccessModal, openPaymentCancelModal } = useModal();
  const modalOpenedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Проверяем URL параметры для оплаты
  useEffect(() => {
    if (modalOpenedRef.current) return;

    const paymentStatus = searchParams?.get('payment');
    const sessionId = searchParams?.get('session_id');

    if (paymentStatus === 'success') {
      openPaymentSuccessModal({ sessionId: sessionId || undefined });
      modalOpenedRef.current = true;
      // Очищаем URL от параметров
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.pathname);
    } else if (paymentStatus === 'cancel') {
      openPaymentCancelModal();
      modalOpenedRef.current = true;
      // Очищаем URL от параметров
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white ">
      <Header />
      <Hero />
      <ClassesSection id="lessons" />
      <GiftBanner />
      <VideoSection id="about" />
      <FreeLessonSection />
      <TeachersSection id="teachers" />
      <PricingSection id="pricing" />
      <ResultsSection />
      <ReviewsSection id="reviews" />
      <Footer id="contacts" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white flex items-center justify-center">Загрузка...</div>}>
      <HomePageContent />
    </Suspense>
  );
} 