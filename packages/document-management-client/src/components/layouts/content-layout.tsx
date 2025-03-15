'use client';

import { NavBar } from '@/components/ui/nav-bar';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect } from 'react';

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div style={{ background: '#F0F5FA', height: '100vh' }}>
      <NavBar />
      {children}
    </div>
  );
};

export default ContentLayout;
