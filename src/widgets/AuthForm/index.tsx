import { useAuth } from '@/features/auth/model/useAuth';
import { Button, Card, Form, Input } from 'antd';
import styles from './style.module.css'
export const AuthForm = () => {
  const { login, isLoading } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    await login(values.email, values.password);
  };

  return (
    <Card title='Авторизация' className={styles.card}>
      <Form name='auth' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical'>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш email' },
            { type: 'email', message: 'Пожалуйста, введите корректный email' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Пароль'
          name='password'
          rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='ghost' htmlType='submit' loading={isLoading} >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
