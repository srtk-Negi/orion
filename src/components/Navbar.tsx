"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [];

  if (session?.user) {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
    navItems.push({ name: "Analytics", href: "/analytics" });
    navItems.push({ name: "Accounts", href: "/accounts" });
  }

  const SignInOutBtn = () => {
    return (
      <button
        className="btn-custom text-1xl px-9 py-3"
        onClick={() => {
          if (session?.user) {
            router.push("/auth/signout");
          } else {
            router.push("/auth/signin");
          }
        }}
      >
        {session?.user ? session.user.name : "Sign In"}
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b border-[#FFDC6A] bg-[#1E113D]`}
    >
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 w-full items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="group relative flex items-center">
              <Image
                src="/img/NovaLogo.png"
                alt="Nova Logo"
                width={100}
                height={100}
                draggable={false}
                className="select-none"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-out hover:text-[#FFDC6A]"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div
                    className="absolute inset-0 scale-0 rounded-full border border-white/20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-100 dark:border-white/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"
                    style={{
                      backdropFilter: "blur(10px) saturate(150%)",
                      WebkitBackdropFilter: "blur(10px) saturate(150%)",
                    }}
                  />
                  <div className="absolute inset-0 scale-0 rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-lg transition-all duration-700 ease-out group-hover:scale-150" />
                </Link>
              ))}

              <SignInOutBtn />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="space-y-2 border-t border-white/10 bg-white/5 px-4 py-6 dark:border-white/5 dark:bg-black/5"
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative block rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-all duration-300 ease-out hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={toggleMenu}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <span className="relative z-10">{item.name}</span>
              {/* Liquid hover effect for mobile */}
              <div
                className="absolute inset-0 scale-95 rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 dark:border-white/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"
                style={{
                  backdropFilter: "blur(10px) saturate(150%)",
                  WebkitBackdropFilter: "blur(10px) saturate(150%)",
                }}
              />
              {/* Mobile glow effect */}
              <div className="absolute inset-0 scale-75 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 blur-lg transition-all duration-500 ease-out group-hover:scale-125 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
