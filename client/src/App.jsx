import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import CartDrawer from './components/CartDrawer';
import Admin from './pages/Admin';
import MenuManager from './pages/MenuManager';
import CategoryManager from './pages/CategoryManager';
import AdminLayout from './components/AdminLayout';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
              <Toaster position="top-right" />
              <CartDrawer />
              <Routes>
                <Route path="/" element={
                  <>
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                      <Menu />
                    </main>
                  </>
                } />

                {/* Admin Routes with Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Admin />} />
                  <Route path="menu" element={<MenuManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                </Route>
              </Routes>
            </div>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
