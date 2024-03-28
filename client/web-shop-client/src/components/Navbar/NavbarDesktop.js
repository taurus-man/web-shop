import Image from 'next/image';
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { BsTelephoneFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { BsCart4 } from "react-icons/bs";
import Link from 'next/link';

function NavbarDesktop() {
    const { state, dispatch } = useUser();
    const { state: cartState } = useCart();
    const router = useRouter();

    let totalPrice
    if(state){
        totalPrice = parseFloat(cartState.cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2));
    } else {
        totalPrice = 0;
    }

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        dispatch({ type: "CLEAR" });
        router.push('/signin');
    };

    return (
        <div>
            <div className="flex justify-between bg-[#363f4d] text-white h-[30px]">
                <div className="flex flex-row items-center flex-wrap gap-2 justify-between text-sm ml-2 mr-2 lg:ml-auto lg:mr-auto w-[1200px]">
                    <div className="flex flex-row items-center flex-wrap gap-2">
                        <BsTelephoneFill />
                        + 00 123 456 789 |
                        <AiOutlineMail />
                        info@gmail.com
                    </div>
                    <div className="flex flex-row items-center flex-wrap gap-2">
                        {state ?
                            <>
                                <a onClick={handleLogout} className='cursor-pointer'>Logout</a>
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
                    </div>
                </div>
            </div>

            <div className="flex justify-between bg-white h-[70px]">
                <div className="flex flex-row items-center flex-wrap gap-2 justify-between text-sm ml-2 mr-2 lg:ml-auto lg:mr-auto w-[1200px]">
                    <div className="flex gap-3">
                        <Link href={state ? "/" : "/signin"} className="main-logo">
                            <div className="">
                                <Image
                                    src="/images/logo_nu.png"
                                    alt="logo image"
                                    width="203"
                                    height="69"
                                    className="w-32 h-auto"
                                    priority={true}
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="flex sm:w-80">
                        <input type="search" id="default-search" className="block w-full p-3 text-sm text-gray-900 border border-gray-300 bg-gray-50" placeholder="Search Product..." required />
                        <button type="submit" className="text-white bg-[#eb3e32] hover:bg-[#a2423b] focus:ring-4 focus:outline-none font-light text-sm px-4 py-2">Search</button>
                    </div>

                    <a onClick={() => window.location.href = '/cart'} className="cursor-pointer">
                        <div className="flex gap-2 h-full flex-wrap content-center font-bold">
                            <div className="relative text-[25px]">
                                <BsCart4 />
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#eb3e32] rounded-full flex justify-center items-center text-white text-xs">
                                    {(state &&cartState) ?
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
                </div>
            </div>

            <div className="flex justify-between bg-white h-[50px] border-t-2 border-b-2">
                <div className="flex flex-row items-center flex-wrap gap-2 justify-between text-sm font-bold ml-2 mr-2 lg:ml-auto lg:mr-auto w-[1200px]">
                    <div className="flex gap-8">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarDesktop;