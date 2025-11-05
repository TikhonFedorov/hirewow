import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Link, Box } from '@gravity-ui/uikit';

// Импорт правильных стилей Gravity UI
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Calculator from './pages/Calculator';
import JobGenerator from './pages/JobGenerator';
import Summary from './pages/Summary';

export default function App() {
  return (
    <ThemeProvider theme="light">
      <BrowserRouter>
        <Box padding="20px" style={{ backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
          <Link href="/" style={{ marginRight: '15px' }}>Главная</Link>
          <Link href="/login" style={{ marginRight: '15px' }}>Вход</Link>
          <Link href="/register" style={{ marginRight: '15px' }}>Регистрация</Link>
          <Link href="/calculator" style={{ marginRight: '15px' }}>Калькулятор</Link>
          <Link href="/job_generator" style={{ marginRight: '15px' }}>Генератор вакансий</Link>
          <Link href="/summary" style={{ marginRight: '15px' }}>Итоги</Link>
        </Box>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/job_generator" element={<JobGenerator />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}