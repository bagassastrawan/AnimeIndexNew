'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) { // Menentukan titik scroll
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={`p-4 flex justify-between items-center text-white transition-all duration-300 fixed top-0 left-0 w-full z-50 ${scrolled ? 'bg-black' : 'bg-transparent'
                }`}
        >
            <div className="text-2xl font-bold flex items-center text-gray-300">
                AnimeIndex
            </div>
            <div className="flex space-x-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-all duration-300">
                    Home
                </Link>
                <Link href="/anime" className="text-gray-400 hover:text-white transition-all duration-300">
                    Anime
                </Link>
                <Link href="/character" className="text-gray-400 hover:text-white transition-all duration-300">
                    Character
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
