'use client';

import { $api } from '@/shared/api/axios';
import { saveToken } from '@/shared/lib/storage/token';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await $api.post<{ access_token: string }>('/users/login', {
        email,
        password,
      });

      saveToken(data.access_token);
      router.push('/'); // Перенаправление после успешной авторизации
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
