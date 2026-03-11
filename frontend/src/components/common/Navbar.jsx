import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { setCartOpen, clearCart } from '../../redux/slices/cartSlice';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import CartDrawer from '../layout/CartDrawer';
import logo from '../../assets/logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/upload', label: 'Get Quote' },
  { href: '/contact', label: 'Contact' },
];

const Header = ({ navDrawerOpen, setNavDrawerOpen }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setNavDrawerOpen(false);
    navigate("/login");
  };

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const navDrawerRef = useRef(null);
  const cartDrawerRef = useRef(null);
  const lastScrollY = useRef(0);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    const next = !drawerOpen;
    setDrawerOpen(next);
    dispatch(setCartOpen(next));
  };

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY.current && currentScroll > 50) {
        setShowTopbar(false); // scrolling down
      } else {
        setShowTopbar(true); // scrolling up
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 w-full z-40 transition-all duration-300 ease-in-out border-b border-white/5
        ${atTop ? "top-9 bg-transparent py-4" : "top-0 bg-[#0B0F19]/90 backdrop-blur-md shadow-lg py-3"}`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-1">

          {/* Left: Logo and Site Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Anuveshana Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="uppercase text-lg md:text-xl font-bold tracking-tight text-white leading-none">
                Anuveshana
              </span>
              <span className="text-[10px] md:text-xs tracking-[0.2em] text-orange-500 font-semibold uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* Middle: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 ">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-bold uppercase tracking-widest relative py-1 transition-colors duration-300 group ${isActive ? 'text-[#ff6200]' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#ff6200] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Cart + Account + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile / Login */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 border-l border-white/5 pl-3 ml-1">
                <Link
                  to="/profile"
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                  title="My Profile"
                >
                  <User size={18} />
                </Link>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Account</span>
                  <Link to="/profile" className="text-[11px] font-bold text-white uppercase tracking-tight hover:text-orange-400">Settings</Link>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex px-5 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
              >
                Login
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={toggleCartDrawer}
              className="relative p-2 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#ff6200] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-orange-500/40">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleNavDrawer}
              className="md:hidden p-2 text-white hover:text-orange-500 transition-colors"
            >
              <HiBars3BottomRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div ref={cartDrawerRef}>
        <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        ref={navDrawerRef}
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-[#0B0F19] border-l border-white/10 shadow-2xl transform transition-all duration-300 z-[100] ${navDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight">Menu</h2>
          <button onClick={toggleNavDrawer} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <IoMdClose className="h-7 w-7 text-slate-400 hover:text-white" />
          </button>
        </div>

        <nav className="p-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={toggleNavDrawer}
              className={({ isActive }) =>
                `text-lg font-medium block px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user && user.role === "admin" && (
            <Link to="/admin" onClick={toggleNavDrawer} className='mt-4 block text-center bg-slate-800 text-white py-3 rounded-xl font-bold text-sm tracking-widest uppercase'>
              Admin Dashboard
            </Link>
          )}

          {/* User Section in Mobile Drawer */}
          <div className="mt-8 pt-8 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">User Account</p>
                <Link
                  to="/profile"
                  onClick={toggleNavDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <User size={20} className="text-orange-500" />
                  <span className="font-bold">My Profile</span>
                </Link>
                <Link
                  to="/my-orders"
                  onClick={toggleNavDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <ShoppingCart size={20} className="text-orange-500" />
                  <span className="font-bold">My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="px-4">
                <Link
                  to="/login"
                  onClick={toggleNavDrawer}
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                >
                  Login to Account
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">© 2025 Anuveshana Technologies</p>
        </div>
      </div>

      {/* Mobile Overlay Backdrop */}
      {navDrawerOpen && (
        <div
          onClick={toggleNavDrawer}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
        />
      )}
    </>
  );
};

export default Header;