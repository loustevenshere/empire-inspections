"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
