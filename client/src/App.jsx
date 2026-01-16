import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
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
    </BrowserRouter>
  );
}

export default App;
