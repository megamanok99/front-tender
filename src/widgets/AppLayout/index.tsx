'use client';

import { $api } from '@/shared/api/axios';
import { Header } from '@/widgets/Header';
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Content, Sider } = Layout;

interface UserData {
  name: string;
  lastname: string;
}

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  const menuItems = [
    {
      key: '/',
      label: 'Главная',
    },
    {
      key: '/okpd',
      label: 'Справочник ОКПД',
    },
    {
      key: '/check-by-inn',
      label: 'Проверка по ИНН',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header userData={userData} setUserData={setUserData} />
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode='inline'
            selectedKeys={pathname ? [pathname] : []}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
