import type { RegistrationData } from "@/types/registration";

export async function sendRegistration(data: RegistrationData) {
  const res = await fetch("/api/registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.error || "Ошибка регистрации");
  }

  return responseData;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.error || "Ошибка входа");
  }

  // Сохраняем токен в localStorage (пример)
  if (responseData.data && responseData.data.token) {
    localStorage.setItem('token', responseData.data.token);
  }

  return responseData;
} 