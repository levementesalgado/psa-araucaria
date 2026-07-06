import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContractsPage } from './pages/ContractsPage';
import { TreesPage } from './pages/TreesPage';
import { NewTreePage } from './pages/NewTreePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/contratos" element={<PrivateRoute><ContractsPage /></PrivateRoute>} />
        <Route path="/arvores" element={<PrivateRoute><TreesPage /></PrivateRoute>} />
        <Route path="/arvores/nova" element={<PrivateRoute><NewTreePage /></PrivateRoute>} />
        <Route path="/pagamentos" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}
