import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import CartDrawer from '../layout/CartDrawer';
import logo from '../../assets/logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/portfolio', label: 'Portfolio' },
  // { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const navDrawerRef = useRef(null);
  const cartDrawerRef = useRef(null);
  const lastScrollY = useRef(0);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClickOutside = (e) => {
    if (navDrawerRef.current && !navDrawerRef.current.contains(e.target)) {
      setNavDrawerOpen(false);
    }
    if (cartDrawerRef.current && !cartDrawerRef.current.contains(e.target)) {
      setDrawerOpen(false);
    }
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
  className={`fixed left-0 w-full z-40 bg-[#0a1a2f] text-white shadow-lg
  transition-all duration-300 ease-in-out
  ${atTop ? "top-9" : "top-0"}`}
>



        <div className="container mx-auto flex items-center justify-between py-3 px-4 mr-60">
          {/* Left: Logo and Site Name */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Anuveshana Logo" className="h-12 w-auto" />
            {/* --- CORRECTED THIS LINE --- */}
            <span className="uppercase text-lg sm:text-xl font-bold tracking-tight">
              Anuveshana Technologies
            </span>
          </Link>

          {/* Middle: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 mr-30">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase transition-colors hover:text-[#ff6200] ${
                    isActive ? 'text-[#ff6200]' : 'text-gray-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Icons and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && user.role === "admin" && (<Link to="/admin" className='block bg-white px-2 rounded text-sm text-black font-semibold'>Admin</Link>)}
{/*             
            <Link to="/profile" className="hover:text-[#ff6200] transition-colors">
              <HiOutlineUser className="h-6 w-6" />
            </Link>
            <button onClick={toggleCartDrawer} className="relative hover:text-[#ff6200] transition-colors">
              <HiOutlineShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && ( <span className="absolute -top-1 -right-2 bg-[#ff6200] text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItemCount}
              </span>)}
            </button>
            <div className="hidden lg:block">
              <SearchBar />
            </div> */}
            <button onClick={toggleNavDrawer} className="md:hidden p-2">
              <HiBars3BottomRight className="h-6 w-6" />
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
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button onClick={toggleNavDrawer}><IoMdClose className="h-6 w-6 text-gray-700" /></button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
            <SearchBar />
        </div>
        
        <nav className="p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
             <NavLink
             key={link.href}
             to={link.href}
             onClick={toggleNavDrawer}
             className={({ isActive }) =>
                 `text-lg font-semibold block p-2 rounded-md transition-colors ${
                   isActive ? 'bg-orange-100 text-[#ff6200]' : 'text-gray-700 hover:bg-gray-100'
                 }`
               }
           >
             {link.label}
           </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;