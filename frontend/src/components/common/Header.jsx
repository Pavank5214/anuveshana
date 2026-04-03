import React from 'react';
import Topbar from '../layout/Topbar';
import Navbar from './Navbar';

const Header = () => {
  const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);

  return (
    <header className="border-b border-gray-200 ">
      <Topbar isNavOpen={navDrawerOpen} />
      <Navbar navDrawerOpen={navDrawerOpen} setNavDrawerOpen={setNavDrawerOpen} />
    </header>
  );
};

export default Header;
