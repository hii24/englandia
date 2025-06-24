import { ComponentExamples } from "@/components/examples/ComponentExamples";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "О нас - Eng-Landia",
  description: "Узнайте больше о команде Eng-Landia, нашей миссии и подходе к обучению английскому языку.",
  openGraph: {
    title: "О нас - Eng-Landia",
    description: "Команда профессионалов, создающая лучшие инструменты для изучения английского языка",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <h1>Home</h1>
      <ComponentExamples />
    </div>
  );
} 