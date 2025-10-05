import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Главная</Link> | <Link to="/calculator">Калькулятор</Link> | <Link to="/job_generator">Генератор</Link> | <Link to="/summary">Сводка</Link> | <Link to="/login">Вход</Link> | <Link to="/register">Регистрация</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}