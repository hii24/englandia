'use client';

import AuthGuard from '@/components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Dashboard content</div>
    </AuthGuard>
  );
} 