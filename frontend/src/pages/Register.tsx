import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuth } from '../api/client';
import { Button, Input, Select, Card } from '../components/ui';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscription_type, setSubscriptionType] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/register`, {
        username,
        email,
        password,
        subscription_type,
      });

      try {
        const form = new URLSearchParams();
        form.append('username', username);
        form.append('password', password);
        const loginResponse = await axios.post(`${API_BASE}/login`, form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const token = loginResponse.data.access_token as string;
        localStorage.setItem('access_token', token);
        setAuth(token);

        navigate('/hub', { replace: true });
      } catch (loginErr) {
        navigate('/login', {
          state: { message: 'Регистрация успешна! Войдите в систему.' },
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Ошибка регистрации. Попробуйте снова.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim() && email.trim() && password.trim();

  return (
    <div className="auth-container">
      <Card variant="elevated" className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Регистрация</h1>
          <p className="auth-subtitle">Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            label="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин"
            disabled={loading}
            fullWidth
            autoComplete="username"
            required
          />

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            disabled={loading}
            fullWidth
            autoComplete="email"
            required
          />

          <Input
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            disabled={loading}
            fullWidth
            autoComplete="new-password"
            required
          />

          <Select
            label="Тип подписки"
            value={subscription_type}
            onChange={(value) => setSubscriptionType(value)}
            options={[
              { value: 'free', label: 'Бесплатный' },
              { value: 'premium', label: 'Премиум' },
            ]}
            disabled={loading}
            fullWidth
          />

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !isFormValid}
            fullWidth
            isLoading={loading}
            size="lg"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
