'use client';
import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export const ReactLenis = ({ children, root }) => {
  const lenisRef = useRef();

  useEffect(() => {
    lenisRef.current = new Lenis({
      // Customize Lenis options here if needed
    });

    const animate = (time) => {
      lenisRef.current.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => lenisRef.current.destroy();
  }, []);

  return root ? <div data-lenis-root>{children}</div> : <>{children}</>;
};
