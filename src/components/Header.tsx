import { TrendingUp, Star, User, ArrowRightLeft, Home } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import React from 'react';

const navLinks = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/favorites" as const, label: "Favorites", icon: Star },
  { to: "/convert" as const, label: "Convert", icon: ArrowRightLeft },
  { to: "/profile" as const, label: "Profile", icon: User },
] as const;

const HeaderComponent = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-sm group-hover:bg-blue-500/30 transition-colors"></div>
                <div className="relative bg-blue-600 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  CryptoLive
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  Live Tracker
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-white bg-slate-800"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : ""}`} />
                    <span className="text-sm font-medium">{label}</span>
                    {isActive && (
                      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-px bg-blue-500 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center flex-1 py-2.5 transition-colors ${
                  isActive ? "text-blue-400" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export const Header = React.memo(HeaderComponent);