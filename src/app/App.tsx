import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';
import HomePage from '@/pages/public/HomePage';
import ServicesPage from '@/pages/public/ServicesPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/admin/LoginPage';
import PlaceholderAdminPage from '@/pages/admin/PlaceholderAdminPage';

/**
 * Route shell for Anupam Creations.
 *
 * Public marketing routes are built out in Phase 3. Admin auth guarding
 * (redirecting unauthenticated users away from /admin/*) is added in
 * Phase 4 once Firebase Authentication is wired up — for now /admin
 * renders a placeholder so the route exists and the shell is testable.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={<PlaceholderAdminPage />} />
    </Routes>
  );
}
