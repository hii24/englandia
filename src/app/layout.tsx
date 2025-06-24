import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import "./styles/main.scss";
import { ModalProvider } from "../providers/ModalProvider";


const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "Eng-Landia - Изучение английского языка",
    template: "%s | Eng-Landia"
  },
  description: "Платформа для изучения английского языка с интерактивными упражнениями и персонализированным подходом",
  keywords: ["английский язык", "изучение", "образование", "онлайн курсы"],
  authors: [{ name: "Eng-Landia Team" }],
  creator: "Eng-Landia",
  publisher: "Eng-Landia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://eng-landia.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://eng-landia.com",
    title: "Eng-Landia - Изучение английского языка",
    description: "Платформа для изучения английского языка с интерактивными упражнениями",
    siteName: "Eng-Landia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eng-Landia - Изучение английского языка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eng-Landia - Изучение английского языка",
    description: "Платформа для изучения английского языка с интерактивными упражнениями",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={rubik.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans ">
        <div id="root">
          <ModalProvider>
            {children}
          </ModalProvider>
        </div>
      </body>
    </html>
  );
}
