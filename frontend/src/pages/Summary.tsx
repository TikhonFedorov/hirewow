import React, { useState } from 'react';
import HubLayout from '../components/HubLayout';
import { Button, Card } from '../components/ui';
import './Summary.css';

export default function Summary() {
  const [meetingText, setMeetingText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    setLoading(true);
    // TODO: Implement API call
    setTimeout(() => {
      setResult('Здесь будет отформатированный текст встречи и краткое резюме...');
      setLoading(false);
    }, 2000);
  };

  const inputPanel = (
    <div className="summary-inputs">
      <div className="input-group">
        <label className="input-label">Текст встречи</label>
        <textarea
          className="textarea"
          value={meetingText}
          onChange={(e) => setMeetingText(e.target.value)}
          placeholder="Вставьте текст встречи..."
          disabled={loading}
          rows={12}
        />
      </div>

      <Button
        onClick={handleProcess}
        disabled={loading || !meetingText}
        fullWidth
        isLoading={loading}
      >
        {loading ? 'Обработка...' : 'Обработать'}
      </Button>
    </div>
  );

  const outputPanel = result ? (
    <Card variant="elevated" className="summary-result">
      <div className="result-content">
        <pre className="result-text">{result}</pre>
      </div>
    </Card>
  ) : (
    <div className="summary-empty">
      <p>Введите текст встречи и нажмите "Обработать" для получения сводки</p>
    </div>
  );

  return (
    <HubLayout
      title="Итоги и отчеты"
      description="Форматирование текста встреч и краткое резюме"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    >
      <div />
    </HubLayout>
  );
}
