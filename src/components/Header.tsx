import { Sparkles, TrendingUp, Star, Menu, X, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import React from 'react';

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 mb-8 backdrop-blur-lg bg-linear-to-r">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-70 animate-pulse"></div>
              <div className="relative bg-linear-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-xl ring-2 ring-white/20 hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  <Link to="/">CryptoLive</Link>

                </h1>
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
                  <div className="absolute inset-0 animate-ping bg-yellow-400 rounded-full opacity-20"></div>
                </div>
              </div>
              <p className="text-gray-300 text-sm md:text-base font-medium tracking-wide">
                Real-time cryptocurrency tracker
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></span>
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/favorites"
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-gray-200 hover:text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold text-lg relative z-10">
                Favorites
              </span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-blue-400 to-purple-400 group-hover:w-4/5 transition-all duration-300"></span>
            </Link>


            <Link
              to="/profile"
              className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-200 hover:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <Link
                to="/favorites"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Favorites</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);