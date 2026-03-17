import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User, Menu, X, ChevronRight, Star, Plus, Minus, Trash2, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { products } from './data';
import { Product, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sparrows_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'pdp'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sparrows_recent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sparrows_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sparrows_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExitIntent]);

  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item.cartItemId === existing.cartItemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, cartItemId: Math.random().toString(36).substr(2, 9), selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateToPDP = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('pdp');
    window.scrollTo(0, 0);
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 3);
    });
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 mr-2 md:hidden text-white">
                <Menu className="w-6 h-6" />
              </button>
              <button onClick={navigateToHome} className="flex items-center gap-2 group">
                <svg className="w-6 h-6 text-white group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
                <span className="font-display font-bold text-xl tracking-wider uppercase">Sparrow's</span>
              </button>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={navigateToHome} className="text-sm font-medium text-white hover:text-accent transition-colors">Shop All</button>
              <button onClick={navigateToHome} className="text-sm font-medium text-white hover:text-accent transition-colors flex items-center gap-1">
                New Drops <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">NEW</span>
              </button>
              <button onClick={navigateToHome} className="text-sm font-medium text-white hover:text-accent transition-colors">Collections</button>
              <button onClick={navigateToHome} className="text-sm font-medium text-success hover:text-success/80 transition-colors">Sale</button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-white hover:text-accent transition-colors hidden sm:block">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:text-accent transition-colors hidden sm:block">
                <User className="w-5 h-5" />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="p-2 text-white hover:text-accent transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-secondary z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/10">
                <span className="font-display font-bold text-xl uppercase">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="flex flex-col space-y-2 px-4">
                  <button onClick={() => { navigateToHome(); setIsMobileMenuOpen(false); }} className="text-left py-3 text-lg font-medium border-b border-white/5">Shop All</button>
                  <button onClick={() => { navigateToHome(); setIsMobileMenuOpen(false); }} className="text-left py-3 text-lg font-medium border-b border-white/5 flex items-center justify-between">
                    New Drops <span className="bg-accent text-white text-xs px-2 py-1 rounded-sm font-bold">NEW</span>
                  </button>
                  <button onClick={() => { navigateToHome(); setIsMobileMenuOpen(false); }} className="text-left py-3 text-lg font-medium border-b border-white/5">Collections</button>
                  <button onClick={() => { navigateToHome(); setIsMobileMenuOpen(false); }} className="text-left py-3 text-lg font-medium text-success border-b border-white/5">Sale</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Home navigateToPDP={navigateToPDP} addToCart={addToCart} />
            </motion.div>
          ) : (
            <motion.div key="pdp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedProduct && <PDP product={selectedProduct} navigateToHome={navigateToHome} addToCart={addToCart} recentlyViewed={recentlyViewed} navigateToPDP={navigateToPDP} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-display font-bold text-2xl uppercase mb-4">Join the Sparrow's flock.</h3>
              <p className="text-gray-400 mb-6 max-w-md">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 bg-primary border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-accent" required />
                <button type="submit" className="bg-white text-primary font-bold px-6 py-2 rounded-md hover:bg-gray-200 transition-colors">Subscribe</button>
              </form>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hoodies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tees</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 Sparrow's Shop. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-secondary z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/10 bg-secondary">
                <span className="font-display font-bold text-xl uppercase">Your Bag ({cartCount})</span>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-white hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                    <p>Your bag is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="bg-white text-primary font-bold px-6 py-3 rounded-md hover:bg-gray-200 transition-colors mt-4">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="flex gap-4">
                        <div className="w-24 h-32 bg-primary rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm">{item.name}</h4>
                              <p className="text-gray-400 text-xs mt-1">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-500 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex justify-between items-end">
                            <div className="flex items-center border border-white/20 rounded-md">
                              <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1.5 text-gray-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                              <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1.5 text-gray-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                            </div>
                            <div className="font-bold">
                              ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-secondary">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-6 text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-bold">{cartTotal > 100 ? 'Free' : 'Calculated at checkout'}</span>
                  </div>
                  <button className="w-full bg-success text-white font-bold py-4 rounded-md hover:bg-success/90 transition-colors uppercase tracking-wider">
                    Proceed to Checkout • ${cartTotal.toFixed(2)}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
              onClick={() => setShowExitIntent(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-secondary max-w-lg w-full rounded-xl overflow-hidden shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setShowExitIntent(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 h-48 md:h-auto bg-primary relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" alt="Fashion" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent md:hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary hidden md:block"></div>
                  </div>
                  <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                    <h2 className="font-display font-bold text-3xl uppercase mb-2">Wait!</h2>
                    <p className="text-accent font-bold text-xl mb-4">Take 10% OFF your first order.</p>
                    <p className="text-gray-400 text-sm mb-6">Join the flock and get exclusive access to drops and sales.</p>
                    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); setShowExitIntent(false); }}>
                      <input type="email" placeholder="Enter your email" className="bg-primary border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-accent" required />
                      <button type="submit" className="bg-white text-primary font-bold py-3 rounded-md hover:bg-gray-200 transition-colors">Claim My 10% Off</button>
                    </form>
                    <button onClick={() => setShowExitIntent(false)} className="mt-4 text-xs text-gray-500 hover:text-white underline text-center">No thanks, I prefer paying full price.</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home({ navigateToPDP, addToCart }: { navigateToPDP: (p: Product) => void, addToCart: (p: Product, s: string, c: string) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary to-primary z-0"></div>
        <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 50%)' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-center md:text-left pt-20 md:pt-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tighter text-white mb-6"
            >
              Streetwear<br/>For The<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Modern Rebel.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-md mx-auto md:mx-0 mb-8"
            >
              Limited Edition Drops. Unmatched Comfort. Gear up for the season.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button className="bg-accent text-white font-bold px-8 py-4 rounded-md hover:bg-accent-hover transition-colors hover:scale-105 transform duration-200 uppercase tracking-wider">
                Shop New Arrivals
              </button>
              <button className="bg-transparent border border-white text-white font-bold px-8 py-4 rounded-md hover:bg-white/10 transition-colors uppercase tracking-wider">
                Explore Collections
              </button>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center perspective-1000">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-64 h-80 md:w-80 md:h-96 animate-float"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-xl transform -rotate-6 scale-105 blur-lg"></div>
              <div className="absolute inset-0 bg-secondary rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                <img src={products[0].image} alt="Featured Product" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-accent font-bold text-sm uppercase tracking-wider mb-1">Featured Drop</p>
                  <h3 className="text-white font-display font-bold text-xl">{products[0].name}</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-accent text-white py-3 overflow-hidden border-y border-white/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 mx-4 text-sm font-bold uppercase tracking-widest">
              <span>★ As seen in Hypebeast</span>
              <span>★ Secure Checkout</span>
              <span>★ Free Shipping Over $100</span>
              <span>★ 30-Day Returns</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bestsellers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-bold text-4xl uppercase tracking-tight">Bestsellers</h2>
            <p className="text-gray-400 mt-2">The pieces everyone is talking about.</p>
          </div>
          <button className="hidden md:flex items-center text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigateToPDP(product)} onQuickAdd={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]); }} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-96 group overflow-hidden rounded-xl cursor-pointer">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800" alt="Hoodies" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="font-display font-bold text-4xl uppercase text-white mb-4">Hoodies</h3>
              <span className="bg-white text-primary font-bold px-6 py-2 rounded-md opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Shop Now</span>
            </div>
          </div>
          <div className="relative h-96 group overflow-hidden rounded-xl cursor-pointer">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" alt="Tees" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="font-display font-bold text-4xl uppercase text-white mb-4">Tees</h3>
              <span className="bg-white text-primary font-bold px-6 py-2 rounded-md opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Shop Now</span>
            </div>
          </div>
          <div className="relative h-96 group overflow-hidden rounded-xl cursor-pointer">
            <img src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="font-display font-bold text-4xl uppercase text-white mb-4">Accessories</h3>
              <span className="bg-white text-primary font-bold px-6 py-2 rounded-md opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Shop Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-secondary border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl uppercase text-center mb-12">What The Flock Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alex M.", text: "The quality of the puff print hoodie is insane. Best fit I've found in years." },
              { name: "Jordan T.", text: "Shipping was fast and the packaging felt premium. Definitely coming back for more." },
              { name: "Sam R.", text: "Finally a brand that understands oversized fits. The joggers are my new daily uniform." }
            ].map((review, i) => (
              <div key={i} className="bg-primary p-8 rounded-xl border border-white/5">
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-6 italic">"{review.text}"</p>
                <p className="font-bold uppercase text-sm tracking-wider">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onClick, onQuickAdd }: { key?: string | number, product: Product, onClick: () => void, onQuickAdd: (e: React.MouseEvent) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group cursor-pointer min-w-[260px] md:min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] bg-secondary rounded-xl overflow-hidden mb-4">
        <img 
          src={isHovered ? product.hoverImage : product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-success text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
            Sale
          </div>
        )}
        <button 
          onClick={onQuickAdd}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold py-3 rounded-md opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white md:block hidden"
        >
          Quick Add
        </button>
        <button 
          onClick={onQuickAdd}
          className="absolute bottom-3 right-3 bg-white text-primary p-3 rounded-full shadow-lg md:hidden"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div>
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.salePrice ? (
            <>
              <span className="text-success font-bold">${product.salePrice}</span>
              <span className="text-gray-500 line-through text-sm">${product.price}</span>
            </>
          ) : (
            <span className="font-bold">${product.price}</span>
          )}
        </div>
        <div className="flex gap-1 mt-3">
          {product.colors.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PDP({ product, navigateToHome, addToCart, recentlyViewed, navigateToPDP }: { product: Product, navigateToHome: () => void, addToCart: (p: Product, s: string, c: string, q: number) => void, recentlyViewed: Product[], navigateToPDP: (p: Product) => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [viewers] = useState(Math.floor(Math.random() * 15) + 3);
  const [stock] = useState(Math.floor(Math.random() * 5) + 1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setActiveImage(product.image);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-400">
        <button onClick={navigateToHome} className="hover:text-white transition-colors">Home</button>
        <span className="mx-2">/</span>
        <span className="hover:text-white transition-colors cursor-pointer">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Gallery */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scrollbar">
              {[product.image, product.hoverImage].map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-accent' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-secondary rounded-xl overflow-hidden">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-6">
              <h1 className="font-display font-bold text-3xl md:text-4xl uppercase mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 text-xl">
                {product.salePrice ? (
                  <>
                    <span className="text-success font-bold">${product.salePrice}</span>
                    <span className="text-gray-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="font-bold">${product.price}</span>
                )}
              </div>
            </div>

            <div className="bg-secondary/50 border border-white/5 rounded-lg p-4 mb-8 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent text-sm font-bold">
                <span className="animate-pulse">🔥</span> {viewers} people are viewing this right now
              </div>
              <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                <span>⚠️</span> Low stock: Only {stock} left
              </div>
            </div>

            {/* Color */}
            <div className="mb-8">
              <h3 className="font-bold uppercase tracking-wider text-sm mb-3">Color: <span className="text-gray-400 font-normal ml-1">{product.color}</span></h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <div className="w-2 h-2 bg-white rounded-full mix-blend-difference"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h3 className="font-bold uppercase tracking-wider text-sm">Size</h3>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-gray-400 hover:text-white underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-md font-bold transition-colors border ${selectedSize === size ? 'bg-white text-primary border-white' : 'bg-transparent text-white border-white/20 hover:border-white/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-10">
              <div className="flex items-center border border-white/20 rounded-md bg-secondary">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                <span className="px-2 font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-colors uppercase tracking-wider text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                Add To Bag
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-white/10">
              <details className="group border-b border-white/10" open>
                <summary className="flex justify-between items-center font-bold uppercase tracking-wider py-4 cursor-pointer list-none">
                  Details & Fit
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 text-sm pb-4 space-y-2">
                  <p>Premium heavyweight cotton blend designed for ultimate comfort and durability.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Oversized, dropped shoulder fit</li>
                    <li>High-density puff print graphic</li>
                    <li>Kangaroo pocket</li>
                    <li>Ribbed cuffs and hem</li>
                  </ul>
                  <p className="pt-2">Model is 6'1" wearing size L.</p>
                </div>
              </details>
              <details className="group border-b border-white/10">
                <summary className="flex justify-between items-center font-bold uppercase tracking-wider py-4 cursor-pointer list-none">
                  Shipping & Returns
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 text-sm pb-4 space-y-2">
                  <p>Free standard shipping on all orders over $100.</p>
                  <p>Orders are processed within 1-2 business days. Standard shipping takes 3-5 business days.</p>
                  <p>We accept returns within 30 days of delivery for a full refund or exchange. Items must be unworn and unwashed.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-md border-t border-white/10 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 truncate">
            <p className="font-bold text-sm truncate">{product.name}</p>
            <p className="text-accent font-bold text-sm">${product.salePrice || product.price}</p>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-accent text-white font-bold px-6 py-3 rounded-md uppercase tracking-wider text-sm flex-shrink-0"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map(p => (
              <ProductCard key={`recent-${p.id}`} product={p} onClick={() => navigateToPDP(p)} onQuickAdd={(e) => { e.stopPropagation(); addToCart(p, p.sizes[0], p.colors[0], 1); }} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-secondary p-8 rounded-xl max-w-2xl w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowSizeGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-display font-bold text-2xl uppercase mb-6">Size Guide</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 font-bold uppercase text-sm text-gray-400">Size</th>
                      <th className="py-3 font-bold uppercase text-sm text-gray-400">Chest (in)</th>
                      <th className="py-3 font-bold uppercase text-sm text-gray-400">Length (in)</th>
                      <th className="py-3 font-bold uppercase text-sm text-gray-400">Sleeve (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold">S</td>
                      <td className="py-3 text-gray-300">38-40</td>
                      <td className="py-3 text-gray-300">27</td>
                      <td className="py-3 text-gray-300">33</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold">M</td>
                      <td className="py-3 text-gray-300">40-42</td>
                      <td className="py-3 text-gray-300">28</td>
                      <td className="py-3 text-gray-300">34</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 font-bold">L</td>
                      <td className="py-3 text-gray-300">42-44</td>
                      <td className="py-3 text-gray-300">29</td>
                      <td className="py-3 text-gray-300">35</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">XL</td>
                      <td className="py-3 text-gray-300">44-46</td>
                      <td className="py-3 text-gray-300">30</td>
                      <td className="py-3 text-gray-300">36</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

