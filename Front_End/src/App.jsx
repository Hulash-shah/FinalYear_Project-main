import React, { useState } from 'react';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/Dashboard/index.jsx';
import EmployeesPage from './pages/Employees/index.jsx';
import SettingsPage from './pages/Settings/index.jsx';
import StorePage from './store/index.jsx';
import FinancePage from './pages/Finance/index.jsx';
import CustomersPage from './pages/Customers/index.jsx';
import AppShell from './components/layout/AppShell';
import { useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';
import { useTheme } from './hooks/useTheme';
import ReportsPage from './pages/Reports/index.jsx';

function MainApp({ user, setUser, logout, isDark, toggleTheme }) {
  const { data, setData } = useAppData();
  const [activePage, setActivePage] = useState("dashboard");

  const pageProps = { data, setData, user, setUser, setActivePage };

  return (
    <AppShell
      key={isDark}
      activePage={activePage}
      setActivePage={setActivePage}
      user={user}
      onLogout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
    >
      {activePage === "dashboard" && <DashboardPage {...pageProps} />}
      {activePage === "employees" && <EmployeesPage {...pageProps} />}
      {activePage === "settings" && <SettingsPage {...pageProps} />}
      {activePage === "store" && <StorePage {...pageProps} />}
      {activePage === "finance" && <FinancePage {...pageProps} />}
      {activePage === "customers" && <CustomersPage {...pageProps} />}
      {activePage === "reports" && <ReportsPage />}
    </AppShell>
  );
}

export default function App() {
  const { user, setUser, page, setPage, login, register, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = async (...args) => {
    await login(...args);
  };

  const handleRegister = async (...args) => {
    await register(...args);
  };

  if (page === "login") return <LoginPage key={isDark} onLogin={handleLogin} onNavigate={setPage} isDark={isDark} toggleTheme={toggleTheme} />;
  if (page === "register") return <RegisterPage key={isDark} onRegister={handleRegister} onNavigate={setPage} isDark={isDark} toggleTheme={toggleTheme} />;

  return (
    <MainApp
      key={user?.id || user?._id}
      user={user}
      setUser={setUser}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
    />
  );
}