"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    // { name: "Pricing", href: "/pricing" },
    // { name: "About", href: "/about" },
  ];

  if (session?.user) {
    navItems.push({ name: "Teams", href: "/tenants" });
  }

  const SignInOutBtn = () => {
    return (
      <Button
        variant={"default"}
        onClick={() => {
          if (session?.user) {
            router.push("/auth/signout");
          } else {
            router.push("/auth/signin");
          }
        }}
      >
        {session?.user ? session.user.name : "SignIn"}
      </Button>
    );
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "border-white/20 bg-white/10 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/10 dark:shadow-white/5"
          : "border-white/10 bg-white/5 backdrop-blur-lg dark:border-white/5 dark:bg-black/5"
      } border-b`}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="group relative text-xl font-bold tracking-tighter text-gray-900 transition-all duration-300 ease-out hover:scale-105 dark:text-white"
            >
              GloFlow
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 ease-out hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="group relative ml-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
                aria-label="Toggle dark mode"
                style={{
                  backdropFilter: "blur(10px) saturate(150%)",
                  WebkitBackdropFilter: "blur(10px) saturate(150%)",
                }}
              >
                <div className="relative z-10">
                  {mounted && theme === "dark" ? (
                    <Sun size={18} className="text-yellow-400" />
                  ) : (
                    <Moon size={18} className="text-blue-400" />
                  )}
                </div>
                <div className="absolute inset-0 scale-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-blue-400/20 blur-lg transition-all duration-500 ease-out group-hover:scale-150" />
              </Button>

              <SignInOutBtn />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
              aria-label="Toggle dark mode"
              style={{
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(10px) saturate(150%)",
              }}
            >
              {mounted && theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-400" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
              aria-label="Open menu"
              style={{
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(10px) saturate(150%)",
              }}
            >
              <div
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </Button>
            <SignInOutBtn />
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
