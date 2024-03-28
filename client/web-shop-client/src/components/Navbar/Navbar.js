"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";


const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {   // to add shadow under the navbar, when user scrolls the page
        const handleScroll = () => {
            const isUserScrolled = window.scrollY > 50;
            setIsScrolled(isUserScrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className={`fixed top-0 left-0 right-0 z-[9999999] transition-all ease-in-out duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
            <div className="sm:hidden">
                <NavbarMobile />
            </div>
            <div className="hidden sm:block">
                <NavbarDesktop />
            </div>
        </div>
    );
};

export default NavBar;
