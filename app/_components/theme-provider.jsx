"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children, ...props }) {
  const pathname = usePathname();
  const isHome = pathname === "/"; 
   const { setTheme } = useTheme(); 

    useEffect(() => {
    if (isHome) {
      setTheme("dark"); 
      document.documentElement.classList.add("dark"); 
    }
  }, [isHome, setTheme]);

   

  return <NextThemesProvider attribute="class"
      defaultTheme={isHome ? "dark" : "system"} 
      enableSystem={!isHome}
      disableTransitionOnChange
      {...props}>{children}</NextThemesProvider>;
}
