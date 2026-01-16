import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { cartCount, openCart } = useCart();

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-heading text-orange-600 tracking-tight">ProjectM</h1>
                <button onClick={openCart} className="p-2 hover:bg-orange-50 rounded-full relative transition-colors group">
                    <ShoppingBagIcon className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}
