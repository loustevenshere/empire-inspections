"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

interface MobileMenuDrawerProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileMenuDrawer({ menuOpen, setMenuOpen }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastLinkRef = useRef<HTMLAnchorElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    // Return focus to hamburger button
    setTimeout(() => {
      const hamburgerButton = document.querySelector('[aria-label*="navigation menu"]') as HTMLButtonElement;
      hamburgerButton?.focus();
    }, 100);
  };

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Handle ESC key and body scroll
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      // Focus the close button when menu opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Focus management for keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab - going backwards
        if (document.activeElement === closeButtonRef.current) {
          event.preventDefault();
          lastLinkRef.current?.focus();
        }
      } else {
        // Tab - going forwards
        if (document.activeElement === lastLinkRef.current) {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }
      }
    }
  };

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/pay", label: "Pay" },
    { href: "/contact", label: "Contact" },
  ];

  if (!menuOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 md:hidden"
      onKeyDown={handleKeyDown}
    >
      {/* Fullscreen backdrop with 50% opacity */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={closeMenu}
        aria-hidden="true"
      />
      
      {/* Drawer panel - slides in from right */}
      <div 
        className={`fixed right-0 top-0 h-full w-[84vw] max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{ height: '100dvh' }}
      >
        <div className="flex flex-col h-full">
          {/* Screen reader heading */}
          <h2 className="sr-only">Navigation</h2>
          
          {/* Header with close button */}
          <div className="flex items-center justify-end p-6">
            <button
              ref={closeButtonRef}
              onClick={closeMenu}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-slate-900 dark:text-white" />
            </button>
          </div>
          
          {/* Navigation Links with guaranteed contrast */}
          <nav className="flex-1 p-6" role="navigation" aria-label="Main navigation">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block min-h-[48px] py-3 px-4 rounded-xl text-lg font-medium leading-7 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors duration-200"
                    ref={index === navLinks.length - 1 ? lastLinkRef : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Empire Inspection Agency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
