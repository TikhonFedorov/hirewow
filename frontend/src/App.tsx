import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Calculator from "./pages/Calculator";
import JobGenerator from "./pages/JobGenerator";
import Summary from "./pages/Summary";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/job_generator" element={<JobGenerator />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}