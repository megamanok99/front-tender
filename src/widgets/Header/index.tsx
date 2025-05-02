'use client';

import { Avatar, Button, Layout, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';
const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header = ({
  userData,
  setUserData,
}: {
  userData: { name: string; lastname: string } | null;
  setUserData: any;
}) => {
  const router = useRouter();
  return (
    <AntHeader className={styles.header}>
      <img src='/logo.png' alt='logo' style={{ width: '64px' }} />
      {userData ? (
        <Space>
          <Avatar>{userData.name[0]}</Avatar>
          <Text className={styles.text}>
            {userData.name} {userData.lastname}
          </Text>
          <Button
            onClick={() => {
              localStorage.removeItem('token');
              setUserData(null);
            }}>
            Выйти
          </Button>
        </Space>
      ) : (
        <Button onClick={() => router.push('/auth')}>Войти</Button>
      )}
    </AntHeader>
  );
};
