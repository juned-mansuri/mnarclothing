import React, { useContext, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CoinBalance from "./CoinBalance";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.mnarlogo2} className="w-28 sm:w-36" alt="" />
      </Link>
      
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
      </ul>

      <div className="flex items-center gap-3 sm:gap-6">
        <img
          onClick={() => { navigate('/collection'); setShowSearch(true);}}
          src={assets.search_icon}
          className="w-4 sm:w-5 cursor-pointer"
          alt=""
        />
        
        {/* Coin Balance Display - Hidden on mobile, shown in sidebar */}
        <div className="hidden sm:block">
          <CoinBalance />
        </div>
        
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-4 sm:w-5 cursor-pointer"
            alt=""
          />
          {/* dropDown - Hidden on mobile */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={()=>navigate('/profile')} className="cursor-pointer hover:text-black">My Profile </p>
                <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
                <p onClick={()=>navigate('/coins')} className="cursor-pointer hover:text-black flex items-center gap-2 text-sm">
                  MNAR Coins
                </p>
                <p onClick={()=>navigate('/my-redemptions')} className="cursor-pointer hover:text-black flex items-center gap-2 text-sm">
                 My Redemptions
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-4 sm:w-5 min-w-4 sm:min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-4 sm:w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* Mobile Sidebar Menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-[999] ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          
          {/* Navigation Links */}
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-50"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-50"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-50"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-50"
            to="/contact"
          >
            CONTACT
          </NavLink>
          
          {/* User Account Section */}
          {token ? (
            <div className="flex flex-col">
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 pl-6 border-b hover:bg-gray-50"
                to="/profile"
              >
                My Profile
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 pl-6 border-b hover:bg-gray-50"
                to="/orders"
              >
                Orders
              </NavLink>
              <div className="py-3 pl-6 border-b">
                <NavLink
                  onClick={() => setVisible(false)}
                  className="hover:text-black flex items-center gap-2 mb-2"
                  to="/coins"
                >
                  <span>🪙</span> MNAR Coins
                </NavLink>
                {/* Mobile Coin Balance */}
                <div className="ml-6">
                  <CoinBalance />
                </div>
              </div>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 pl-6 border-b hover:bg-gray-50 flex items-center gap-2"
                to="/my-redemptions"
              >
                <span>🎁</span> My Redemptions
              </NavLink>
              <p 
                onClick={() => {
                  setVisible(false);
                  logout();
                }}
                className="py-3 pl-6 border-b hover:bg-gray-50 cursor-pointer text-red-600"
              >
                Logout
              </p>
            </div>
          ) : (
            <NavLink
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border-b hover:bg-gray-50"
              to="/login"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
