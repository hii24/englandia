'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui";

const teachers = [
  { name: 'Анна', exp: '5 лет', desc: 'Дошкольники и младшие классы', emoji: '👩‍🏫' },
  { name: 'Давид', exp: '8 лет', desc: 'Подготовка к экзаменам', emoji: '👨‍🏫' },
  { name: 'Виктория', exp: '6 лет', desc: 'Игровые методики', emoji: '👩‍🏫' },
  { name: 'Елена', exp: '7 лет', desc: 'Работа с подростками', emoji: '👩‍🏫' },
];

const reviews = [
  { name: 'Мария', text: 'Дочка с радостью занимается, учителя находят подход!', child: 'София, 7 лет' },
  { name: 'Алексей', text: 'Сын стал увереннее говорить на английском, спасибо!', child: 'Максим, 10 лет' },
  { name: 'Елена', text: 'Очень современно и удобно, ребёнок ждёт уроков!', child: 'Анна, 8 лет' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { openLoginModal, openRegistrationModal } = useModal();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegisterClick = () => {
    openRegistrationModal();
  };

  const handleLoginClick = () => {
    openLoginModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex gap-40 flex-col">
      {/* Header */}
      <header className="w-full border-b bg-white/90 backdrop-blur-sm sticky top-0 z-20 m-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Eng-Landia</span>
          </div>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <a href="#how" className="hover:text-purple-500 transition">Как проходят занятия</a>
            <a href="#teachers" className="hover:text-purple-500 transition">Учителя</a>
            <a href="#reviews" className="hover:text-purple-500 transition">Отзывы</a>
            <a href="#pricing" className="hover:text-purple-500 transition">Тарифы</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleLoginClick} className="text-gray-600 hover:text-purple-600 px-4 py-2">Войти</Button>
            <Button onClick={handleRegisterClick} className="bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white px-6 py-2 rounded-full font-semibold shadow-none">Записаться</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 gap-40">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Английский для детей <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">4–12 лет</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Современные онлайн-занятия с профессиональными педагогами. Ярко, интересно, результативно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button onClick={handleRegisterClick} className="bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md">Записаться на бесплатный урок</Button>
            <Button variant="outline" onClick={handleLoginClick} className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold">Войти</Button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-orange-300 flex items-center justify-center mb-4">
              <span className="text-2xl">🎲</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Игровой формат</h3>
            <p className="text-gray-500 text-sm text-center">Обучение через современные игры и интерактив</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-orange-300 flex items-center justify-center mb-4">
              <span className="text-2xl">👩‍🏫</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Педагоги–эксперты</h3>
            <p className="text-gray-500 text-sm text-center">Только опытные преподаватели, любящие детей</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-orange-300 flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Быстрый результат</h3>
            <p className="text-gray-500 text-sm text-center">Видимый прогресс уже через 1 месяц занятий</p>
          </div>
        </div>

        {/* How it works */}
        <section id="how" className="max-w-4xl w-full mx-auto mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Как проходят занятия</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-lg font-bold">1</div>
              <h3 className="font-semibold mb-3 text-center">Знакомство и диагностика</h3>
              <p className="text-gray-500 text-sm text-center">Определяем уровень, знакомимся, мотивируем ребёнка</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-lg font-bold">2</div>
              <h3 className="font-semibold mb-3 text-center">Игровое обучение</h3>
              <p className="text-gray-500 text-sm text-center">Уроки проходят в формате игры, с песнями, заданиями и мини-квестами</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-lg font-bold">3</div>
              <h3 className="font-semibold mb-3 text-center">Обратная связь</h3>
              <p className="text-gray-500 text-sm text-center">Родители получают отчёт о прогрессе, рекомендации и поддержку</p>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section id="teachers" className="max-w-4xl w-full mx-auto mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Наши учителя</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teachers.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center">
                <div className="w-20 h-20 text-5xl rounded-full bg-gradient-to-tr from-purple-200 to-orange-100 flex items-center justify-center mb-4">{t.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Опыт: {t.exp}</p>
                <p className="text-xs text-gray-500 text-center">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="max-w-4xl w-full mx-auto mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Отзывы родителей</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 text-center">"{r.text}"</p>
                <div className="text-xs text-gray-500">{r.name}, <span className="text-purple-500">{r.child}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-4xl w-full mx-auto mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Тарифы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center">
              <h3 className="font-bold text-lg mb-3">Пробный</h3>
              <div className="text-3xl font-bold text-purple-500 mb-3">$0</div>
              <p className="text-gray-500 text-sm mb-6 text-center">Первое занятие бесплатно</p>
              <Button variant="outline" onClick={handleRegisterClick} className="w-full border-purple-300 text-purple-600">Записаться</Button>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-orange-400 text-white rounded-2xl border border-purple-200 p-10 flex flex-col items-center shadow-lg scale-105">
              <h3 className="font-bold text-lg mb-3">Стандарт</h3>
              <div className="text-3xl font-bold mb-3">$19</div>
              <p className="text-white/90 text-sm mb-6 text-center">4 занятия в месяц, доступ к платформе</p>
              <Button onClick={handleRegisterClick} className="w-full bg-white text-purple-600 font-bold">Выбрать</Button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center">
              <h3 className="font-bold text-lg mb-3">Премиум</h3>
              <div className="text-3xl font-bold text-purple-500 mb-3">$34</div>
              <p className="text-gray-500 text-sm mb-6 text-center">8 занятий в месяц, индивидуальный куратор</p>
              <Button variant="outline" onClick={handleRegisterClick} className="w-full border-purple-300 text-purple-600">Выбрать</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white/90 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-2 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Eng-Landia</span>
            <span>© 2024</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-purple-500">Контакты</a>
            <a href="#" className="hover:text-purple-500">Политика</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 