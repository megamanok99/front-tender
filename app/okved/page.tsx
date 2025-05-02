'use client';

import { $api } from '@/shared/api/axios';
import { OkvedTree } from '@/widgets/OkvedTree';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';

const { Content } = Layout;

interface UserData {
  name: string;
  lastname: string;
}

export default function OkpdPage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await $api.get<UserData>('/users/me');
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Content style={{ padding: '24px' }}>
      <h1>Справочник ОКВЕД</h1>
      <OkvedTree />
    </Content>
  );
}
