import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import CartDrawer from './components/CartDrawer';
import Admin from './pages/Admin';
import MenuManager from './pages/MenuManager';
import CategoryManager from './pages/CategoryManager';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import RequireAdmin from './components/RequireAdmin';
import OrderTracking from './pages/OrderTracking';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
                <Toaster position="top-right" />
                <CartDrawer />
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <main className="container mx-auto px-4 py-8">
                        <Menu />
                      </main>
                    </>
                  } />

                  {/* Order Tracking Routes (Public) */}
                  <Route path="/order" element={<OrderTracking />} />
                  <Route path="/order/:orderId" element={<OrderTracking />} />

                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Routes with Layout */}
                  <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                    <Route index element={<Admin />} />
                    <Route path="menu" element={<MenuManager />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="dashboard" element={<Dashboard />} />
                  </Route>

                  {/* 404 Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
