// "use client";

// import Link from "next/link";
// import React, { useEffect } from "react";
// import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";
// import { ThemeToggle } from "./ThemeToggle";

// const Navbar = () => {
//     const { user, isLoaded } = useUser();

//      useEffect(() => {
//         const storeUser = async () => {
//             if (!user || !isLoaded) return;

//             try {
//                 await fetch("/api/auth/store-user");
//                 console.log("User stored in database successfully.");
//             } catch (error) {
//                 console.error("Error storing user:", error);
//             }
//         };

//         storeUser();
//     }, [user, isLoaded]);
//     return (
//         <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
//             <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
//                 <Link href="/" className="items-center gap-1 lg:gap-2 sm:flex">
//                     <p className="rounded-lg border-2 border-b-4 border-r-4 border-black bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 px-2 lg:px-4 py-2 text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl md:block dark:border-white dark:from-green-500 dark:via-emerald-600 dark:to-teal-700 -ml-8">
//                         Sarthi
//                     </p>
//                 </Link>

//                 <div className="flex items-center">
//                     <SignedIn>
//                         <Link href="/dashboard" className="mr-5">
//                             Create
//                         </Link>
//                         <Link href="/explore" className="mr-5 hidden md:block lg:block">
//                             Gallery
//                         </Link>
//                         <Link href="/views" className="mr-5">
//                             Canvas
//                         </Link>
//                         <Link href="/idea" className="mr-5">
//                             Ideas
//                         </Link>
//                         <Link href="/onboarding" className="mr-5">
//                             Trends
//                         </Link>
//                         <Link href="/chatbot" className="mr-5">
//                             ChatBot
//                         </Link>
//                         <ThemeToggle className="mr-5" />
//                         <UserButton afterSignOutUrl="/" />
//                     </SignedIn>
//                     <SignedOut>
//                         <SignInButton mode="modal">
//                             <button className="rounded-lg border-2 border-black px-2 py-1 text-sm font-medium transition-all hover:-translate-y-[2px] dark:border-white">
//                                 Sign In
//                             </button>
//                         </SignInButton>
//                     </SignedOut>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

// // 'use client'

// // import { useState } from "react";
// // import Link from "next/link";
// // import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
// // import { ThemeToggle } from "./ThemeToggle";
// // import { disablePageScroll, enablePageScroll } from "scroll-lock";
// // import { MenuSvg } from "./MenuSvg"; // Import MenuSvg if not already done

// // const Navbar = () => {
// //   const [openNavigation, setOpenNavigation] = useState(false);

// //   const toggleNavigation = () => {
// //     if (openNavigation) {
// //       setOpenNavigation(false);
// //       enablePageScroll();
// //     } else {
// //       setOpenNavigation(true);
// //       disablePageScroll();
// //     }
// //   };

// //   return (
// //     <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
// //       <div className="flex items-center justify-between px-8 mx-auto sm:justify-between max-w-7xl">
// //         {/* Original logo */}
// //         <Link href="/" className="items-center gap-1 lg:gap-2 sm:flex">
// //           <p className="rounded-lg border-2 border-b-4 border-r-4 border-black bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 px-4 py-2 text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl md:block dark:border-white dark:from-green-500 dark:via-emerald-600 dark:to-teal-700">
// //             Sarthi
// //           </p>
// //         </Link>

// //         <div className="hidden sm:flex items-center">
// //           <SignedIn>
// //             <Link href="/dashboard" className="mr-5">
// //               Create
// //             </Link>
// //             <Link href="/explore" className="mr-5">
// //               Gallery
// //             </Link>
// //             <Link href="/Settings" className="mr-5">
// //               Settings
// //             </Link>
// //             <ThemeToggle className="mr-5" />
// //             <UserButton afterSignOutUrl="/" />
// //           </SignedIn>
// //           <SignedOut>
// //             <SignInButton mode="modal">
// //               <button className="rounded-lg border-2 border-black px-2 py-1 text-sm font-medium transition-all hover:-translate-y-[2px] dark:border-white">
// //                 Sign In
// //               </button>
// //             </SignInButton>
// //           </SignedOut>
// //         </div>

// //         {/* Mobile Hamburger Button */}
// //         <button
// //           className="block sm:hidden ml-auto p-3"
// //           onClick={toggleNavigation}
// //         >
// //           <MenuSvg openNavigation={openNavigation} />
// //         </button>
// //       </div>

        
// //       {/* Mobile Navigation Menu */}
// //       <div
// //         className={`${
// //           openNavigation ? "flex" : "hidden"
// //         } fixed top-[5rem] left-0 right-0 bottom-0 z-20 flex-col items-center lg:hidden`}
// //       >
// //         <div className="flex flex-col items-center w-full">
// //           <Link href="/dashboard" className="px-6 py-4 ">
// //             Create
// //           </Link>
// //           <Link href="/explore" className="px-6 py-4 ">
// //             Gallery
// //           </Link>
// //           <Link href="/Settings" className="px-6 py-4 ">
// //             Settings
// //           </Link>
// //           <ThemeToggle className="px-6 py-4 " />
// //           <SignedIn>
// //             <UserButton afterSignOutUrl="/" />
// //           </SignedIn>
// //           <SignedOut>
// //             <SignInButton mode="modal">
// //               <button className="rounded-lg border-2 border-white px-2 py-1  transition-all hover:-translate-y-[2px]">
// //                 Sign In
// //               </button>
// //             </SignInButton>
// //           </SignedOut>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { ThemeToggle } from './ThemeToggle';
import { HiMenu, HiX } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { user, isLoaded } = useUser();
    const [openNavigation, setOpenNavigation] = useState(false);
     const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const storeUser = async () => {
            if (!user || !isLoaded) return;
            try {
                await fetch('/api/auth/store-user');
                console.log('User stored in database successfully.');
            } catch (error) {
                console.error('Error storing user:', error);
            }
        };
        storeUser();
    }, [user, isLoaded]);

    const toggleNavigation = () => {
        setOpenNavigation((prev) => !prev);
    };

    return (
        <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
            <div className="flex items-center justify-between px-8 mx-auto max-w-7xl h-full">
                <Link href="/" className="items-center gap-1 lg:gap-2 sm:flex">
                    <p className="rounded-lg border-2 border-b-4 border-r-4 border-black bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 px-2 lg:px-4 py-2 text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl dark:border-white dark:from-green-500 dark:via-emerald-600 dark:to-teal-700">
                        Mindcraft
                    </p>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center">
                    <SignedIn>
                        <Link href="/dashboard" className="mr-5">Create</Link>
                        <Link href="/explore" className="mr-5">Gallery</Link>
                        <Link href="/views" className="mr-5">Canvas</Link>
                        <Link href="/idea" className="mr-5">Ideas</Link>
                        <Link href="/onboarding" className="mr-5">Trends</Link>
                        <Link href="/chatbot" className="mr-5">ChatBot</Link>
                        <Link href="/quiz" className="mr-5">Quiz</Link>
                        {/* <ThemeToggle className="mr-5" /> */}
                        {!isHome && <ThemeToggle className="mr-5" />}
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="rounded-lg border-2 border-black px-2 py-1 text-sm font-medium transition-all hover:-translate-y-[2px] dark:border-white">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>

                {/* Mobile Hamburger Button */}
                <button className="block md:hidden p-3" onClick={toggleNavigation}>
                    {openNavigation ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Slide-out Navigation Menu */}
            <div className={`fixed top-0 left-0 w-3/4 h-full bg-white dark:bg-gray-900 z-50 transform ${openNavigation ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden shadow-lg`}
                style={{ boxShadow: openNavigation ? '2px 0 10px rgba(0,0,0,0.2)' : 'none' }}>
                <div className="flex flex-col h-full py-5 px-6">
                    {/* Close Button */}
                    <button className="self-end mb-4 p-2" onClick={toggleNavigation}>
                        <HiX size={32} />
                    </button>
                    <SignedIn>
                        <Link href="/dashboard" className="py-3 text-lg" onClick={toggleNavigation}>Create</Link>
                        <Link href="/explore" className="py-3 text-lg" onClick={toggleNavigation}>Gallery</Link>
                        <Link href="/views" className="py-3 text-lg" onClick={toggleNavigation}>Canvas</Link>
                        <Link href="/idea" className="py-3 text-lg" onClick={toggleNavigation}>Ideas</Link>
                        <Link href="/onboarding" className="py-3 text-lg" onClick={toggleNavigation}>Trends</Link>
                        <Link href="/chatbot" className="py-3 text-lg" onClick={toggleNavigation}>ChatBot</Link>
                        {/* <ThemeToggle className="py-3" /> */}
                        {!isHome && <ThemeToggle className="py-3" />}
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="mt-3 rounded-lg border-2 border-black px-5 py-3 text-lg font-medium transition-all hover:-translate-y-[2px] dark:border-white">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

