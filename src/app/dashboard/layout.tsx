import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Eng-Landia",
  description: "Панель управления Eng-Landia - ваш личный кабинет для изучения английского языка",
  openGraph: {
    title: "Dashboard - Eng-Landia",
    description: "Панель управления Eng-Landia",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 