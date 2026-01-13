import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card } from '../components/ui';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Ошибка входа. Проверьте логин и пароль.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card variant="elevated" className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Вход</h1>
          <p className="auth-subtitle">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            label="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваш логин"
            disabled={loading}
            fullWidth
            autoComplete="username"
            required
          />

          <Input
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
            disabled={loading}
            fullWidth
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !username || !password}
            fullWidth
            isLoading={loading}
            size="lg"
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
