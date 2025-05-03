"use client";
import { AuthForm } from '@/widgets/AuthForm';
import styles from './style.module.css';
export default function AuthPage() {
  return (
    <div className={styles.page}>
      <AuthForm />
    </div>
  );
}
