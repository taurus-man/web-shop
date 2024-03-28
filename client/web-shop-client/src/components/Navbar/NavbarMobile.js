import React, { useRef, useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import Link from 'next/link';
import { BsCart4, BsTelephoneFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { IoIosArrowDown } from "react-icons/io";
import { useCart } from "@/context/CartContext";

function NavbarMobile() {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { state, dispatch } = useUser();
    const router = useRouter();
    const { state: cartState } = useCart();

    const totalPrice = parseFloat(cartState.cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2));

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        dispatch({ type: "CLEAR" });
        router.push('/signin');
    };

    return (
        <div ref={dropdownRef}>
            <div className="flex justify-between bg-white">
                <Link href={state ? "/" : "/signin"} className="main-logo mt-1 ml-1">
                    <Image
                        src="/images/logo_nu.png"
                        alt="logo image"
                        width="203"
                        height="69"
                        className="w-32 h-auto"
                        priority={true}
                    />
                </Link>
                <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-0 shadow-4xl right-0 p-5 pt-0 bg-[#363f4d] border-b border-b-white/20 rounded-b"
                    >
                        <ul className="grid gap-2 mt-2">
                            <motion.li
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + 1 / 10,
                                }}
                                key="1"
                                className="w-full p-3 rounded-xl bg-gradient-to-tr bg-white text-black"
                            >
                                <div className="flex flex-row items-center flex-wrap gap-2">
                                    <BsTelephoneFill />
                                    + 00 123 456 789 |
                                    <AiOutlineMail />
                                    info@gmail.com
                                </div>
                            </motion.li>

                            <motion.li
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + 2 / 10,
                                }}
                                key="2"
                                className="w-full p-3 rounded-xl bg-gradient-to-tr bg-white text-black"
                            >
                                {state ?
                                    <>
                                        <a onClick={handleLogout}>Logout</a>
                                    </>
                                    :
                                    <>
                                        <Link href="/signin" className="">Login</Link>
                                    </>
                                }
                                |
                                <Link href="/" className="">
                                    Whishlist
                                </Link>
                                |
                                <Link href="/" className="">
                                    {state ?
                                        <>
                                            {state?.name}
                                        </>
                                        :
                                        <>
                                            My Account
                                        </>
                                    }
                                </Link>
                            </motion.li>
                            <motion.li
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + 3 / 10,
                                }}
                                key="3"
                                className="w-full p-3 rounded-xl bg-gradient-to-tr bg-white text-black"
                            >
                                <div className="flex sm:w-80">
                                    <input type="search" id="default-search" className="block w-full p-3 text-sm text-gray-900 border border-gray-300 bg-gray-50" placeholder="Search Product..." required />
                                    <button type="submit" className="text-white bg-[#eb3e32] hover:bg-[#a2423b] focus:ring-4 focus:outline-none font-light text-sm px-4 py-2">Search</button>
                                </div>
                            </motion.li>
                            <motion.li
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + 4 / 10,
                                }}
                                key="4"
                                className="w-full p-3 rounded-xl bg-gradient-to-tr bg-white text-black"
                            >
                                <a onClick={() => window.location.href = '/cart'} className="cursor-pointer">
                                    <div className="flex gap-2 h-full flex-wrap content-center font-bold">
                                        <div className="relative text-[25px]" >
                                            <BsCart4 />
                                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#eb3e32] rounded-full flex justify-center items-center text-white text-xs">
                                                {cartState ?
                                                    <span>
                                                        {cartState.cartItems.length}
                                                    </span>
                                                    :
                                                    <span>
                                                        0
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        <div className="pt-1 flex items-center gap-1">
                                            ${totalPrice}<IoIosArrowDown />
                                        </div>
                                    </div>
                                </a>
                            </motion.li>
                            <motion.li
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + 5 / 10,
                                }}
                                key="5"
                                className="w-full p-3 rounded-xl bg-gradient-to-tr bg-white text-black"
                            >
                                <Link href="/" className="flex items-center gap-1">
                                    Home <IoIosArrowDown />
                                </Link>
                                <Link href="/">
                                    About us
                                </Link>
                                <Link href="/" className="flex items-center gap-1">
                                    Pages <IoIosArrowDown />
                                </Link>
                                <Link href="/" className="flex items-center gap-1">
                                    Products <IoIosArrowDown />
                                </Link>
                                <Link href="/" className="flex items-center gap-1">
                                    Sport <IoIosArrowDown />
                                </Link>
                                <Link href="/" className="flex items-center gap-1">
                                    Blog <IoIosArrowDown />
                                </Link>
                                <Link href="/">
                                    Contact
                                </Link>
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default NavbarMobile;