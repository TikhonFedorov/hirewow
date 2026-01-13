import React, { useState } from 'react';
import { api } from '../api/client';
import HubLayout from '../components/HubLayout';
import { Button, Input, Card } from '../components/ui';
import './JobGenerator.css';

interface JobGeneratorRequest {
  job_title: string;
  company: string;
  tasks: string;
  requirements: string;
  conditions: string;
}

interface JobGeneratorResponse {
  result?: string;
  error?: string;
}

export default function JobGenerator() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [tasks, setTasks] = useState('');
  const [requirements, setRequirements] = useState('');
  const [conditions, setConditions] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const requestData: JobGeneratorRequest = {
        job_title: jobTitle,
        company: company,
        tasks: tasks,
        requirements: requirements,
        conditions: conditions,
      };

      const response = await api.post<JobGeneratorResponse>('/job_generator', requestData);
      
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.result) {
        setResult(response.data.result);
        
        // Save to history
        try {
          await api.post('/history', {
            module_name: 'job_generator',
            query: JSON.stringify(requestData),
            response: response.data.result,
          });
          console.log('History saved successfully');
        } catch (historyErr: any) {
          // Don't fail the request if history save fails
          console.error('Failed to save history:', historyErr);
          console.error('Error details:', historyErr?.response?.data);
        }
      } else {
        setError('Неожиданный формат ответа от сервера');
      }
    } catch (err: any) {
      console.error('Job generator error:', err);
      if (err?.response?.status === 401) {
        setError('Сессия истекла, пожалуйста, войдите снова');
      } else {
        // Try multiple ways to extract error message
        const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Ошибка генерации. Проверьте введенные данные.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputPanel = (
    <div className="generator-inputs">
      <Input
        label="Название должности"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Например: Frontend разработчик"
        disabled={loading}
        fullWidth
      />

      <Input
        label="Название компании"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Например: ООО Технологии"
        disabled={loading}
        fullWidth
      />

      <div className="input-group">
        <label className="input-label">Задачи и обязанности</label>
        <textarea
          className="textarea"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder="Опишите основные задачи и обязанности..."
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Требования к кандидату</label>
        <textarea
          className="textarea"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Опишите требования к кандидату..."
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Условия работы</label>
        <textarea
          className="textarea"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="Опишите условия работы..."
          disabled={loading}
          rows={3}
        />
      </div>

      {error && (
        <div className="generator-error" role="alert">
          {error}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading || !jobTitle || !company}
        fullWidth
        isLoading={loading}
        className="generator-submit"
      >
        {loading ? 'Генерация...' : 'Сгенерировать'}
      </Button>
    </div>
  );

  const formatResult = (text: string) => {
    // Split by lines and format
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check if line is a header (contains ":" and is not a list item)
      if (line.includes(':') && !line.trim().startsWith('•')) {
        return (
          <React.Fragment key={index}>
            <h3 className="result-header">{line}</h3>
          </React.Fragment>
        );
      }
      // Regular line
      return (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const outputPanel = result ? (
    <div className="generator-results">
      <Card variant="elevated" className="generator-result">
        <div className="result-content">
          <div className="result-text">{formatResult(result)}</div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="generator-empty">
      <p>Введите параметры и нажмите "Сгенерировать" для создания вакансии</p>
    </div>
  );

  return (
    <HubLayout
      title="Генератор вакансий"
      description="Создавайте описания вакансий с помощью искусственного интеллекта"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    >
      <div />
    </HubLayout>
  );
}
