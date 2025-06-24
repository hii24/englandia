import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eng-Landia - Изучение английского языка",
  description: "Узнайте больше о команде Eng-Landia, нашей миссии и подходе к обучению английскому языку.",
  openGraph: {
    title: "Eng-Landia - Изучение английского языка",
    description: "Команда профессионалов, создающая лучшие инструменты для изучения английского языка",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 