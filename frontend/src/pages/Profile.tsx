import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import HubLayout from '../components/HubLayout';
import { Button, Input, Card } from '../components/ui';
import './Profile.css';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  subscription_type: string;
}

interface HistoryItem {
  id: number;
  module_name: string;
  query: string;
  response: string;
  timestamp: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    loadProfile();
    loadHistory();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get<UserProfile>('/profile');
      setProfile(response.data);
      setFullName(response.data.full_name || '');
      setEmail(response.data.email || '');
    } catch (err: any) {
      setError('Ошибка загрузки профиля');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (module?: string) => {
    try {
      const params = module && module !== 'all' ? { module_name: module } : {};
      const response = await api.get<HistoryItem[]>('/history', { params });
      setHistory(response.data);
    } catch (err: any) {
      console.error('Ошибка загрузки истории:', err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await api.put<UserProfile>('/profile', {
        full_name: fullName || null,
        email: email,
      });
      setProfile(response.data);
      alert('Профиль успешно обновлен');
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Ошибка обновления профиля';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    if (!confirm('Удалить эту запись из истории?')) return;
    try {
      await api.delete(`/history/${id}`);
      loadHistory(selectedModule !== 'all' ? selectedModule : undefined);
    } catch (err: any) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Очистить всю историю?')) return;
    try {
      const params = selectedModule !== 'all' ? { module_name: selectedModule } : {};
      await api.delete('/history', { params });
      loadHistory(selectedModule !== 'all' ? selectedModule : undefined);
    } catch (err: any) {
      console.error('Ошибка очистки:', err);
    }
  };

  const filteredHistory = selectedModule === 'all'
    ? history
    : history.filter(item => item.module_name === selectedModule);

  const modules = Array.from(new Set(history.map(item => item.module_name)));

  if (loading) {
    return (
      <HubLayout title="Profile" description="Your profile and request history">
        <div className="profile-loading">Loading...</div>
      </HubLayout>
    );
  }

  return (
    <HubLayout title="Profile" description="Your profile and request history">
      <div className="profile-container">
        {/* Profile Section */}
        <Card variant="elevated" className="profile-card">
          <h2 className="profile-section-title">Profile Information</h2>
          {error && <div className="profile-error">{error}</div>}
          <div className="profile-form">
            <Input
              label="Username"
              value={profile?.username || ''}
              disabled
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              fullWidth
            />
            <Input
              label="Subscription"
              value={profile?.subscription_type || 'free'}
              disabled
              fullWidth
            />
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              isLoading={saving}
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </Card>

        {/* History Section */}
        <Card variant="elevated" className="profile-card">
          <div className="history-header">
            <h2 className="profile-section-title">Request History</h2>
            <div className="history-controls">
              <select
                className="history-filter"
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  loadHistory(e.target.value !== 'all' ? e.target.value : undefined);
                }}
              >
                <option value="all">All Modules</option>
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
              {filteredHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="history-empty">No history found</div>
          ) : (
            <div className="history-list">
              {filteredHistory.map((item) => (
                <Card key={item.id} variant="default" className="history-item">
                  <div className="history-item-header">
                    <div>
                      <span className="history-module">{item.module_name}</span>
                      <span className="history-date">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteHistory(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="history-query">
                    <strong>Query:</strong>
                    <pre>{item.query}</pre>
                  </div>
                  <div className="history-response">
                    <strong>Response:</strong>
                    <pre>{item.response.substring(0, 500)}{item.response.length > 500 ? '...' : ''}</pre>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </HubLayout>
  );
}

