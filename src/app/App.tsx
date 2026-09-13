import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';
import HomePage from '@/pages/public/HomePage';
import ServicesPage from '@/pages/public/ServicesPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/admin/LoginPage';
import PlaceholderAdminPage from '@/pages/admin/PlaceholderAdminPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminLayout from '@/app/components/AdminLayout';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { AuthProvider } from '@/app/auth/AuthProvider';

/**
 * Route shell for Anupam Creations.
 *
 * Public routes and the protected admin route tree share one basename-aware
 * router so navigation behaves consistently on GitHub Pages.
 */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="orders/*" element={<PlaceholderAdminPage />} />
          <Route path="customers/*" element={<PlaceholderAdminPage />} />
          <Route path="payments" element={<PlaceholderAdminPage />} />
          <Route path="services" element={<PlaceholderAdminPage />} />
          <Route path="settings" element={<PlaceholderAdminPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
