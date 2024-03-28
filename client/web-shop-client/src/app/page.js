import Image from "next/image";
import { FaTruck } from "react-icons/fa6";
import { FaHeadphones } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { IoMdTrophy } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import ImageCarousel from "@/components/Carousel/ImageCarousel";
import ProductDeals from "@/components/Products/FeaturedProducts/ProductDeals";


export default function Home() {
	return (
		<div className="w-full">
			<div className="flex w-full">
				<div className="flex flex-col gap-3 lg:flex-row mt-5 lg:ml-auto lg:mr-auto w-[1200px]">
					<div className="lg:w-3/4 w-full">
						<div className="">
							<Image
								src="/images/main_main.png"
								alt="logo image"
								width="590"
								height="356"
								className="w-full h-auto"
								priority={true}
							/>
						</div>
					</div>
					<div className="lg:w-1/4 w-full border-2 divide-y lg:mt-0 mt-4">
						<div className="flex items-center p-5 h-1/4 gap-3">
							<FaTruck className="scale-x-[-1] text-[33px]" />
							<div>
								<div className="font-bold">
									FREE DELIVERY
								</div>
								<div className="text-sm">
									Worldwide
								</div>
							</div>
						</div>
						<div className="flex items-center p-5 h-1/4 gap-3">
							<FaHeadphones className="text-[33px]" />
							<div>
								<div className="font-bold">
									24/7 SUPPORT
								</div>
								<div className="text-sm">
									CUSTOMER SUPPORT
								</div>
							</div>
						</div>
						<div className="flex items-center p-5 h-1/4 gap-3">
							<FaCcMastercard className="text-[33px]" />
							<div>
								<div className="font-bold">
									PAYMENT
								</div>
								<div className="text-sm">
									SECURE SYSTEM
								</div>
							</div>
						</div>
						<div className="flex items-center p-5 h-1/4 gap-3">
							<IoMdTrophy className="text-[33px]" />
							<div>
								<div className="font-bold">
									TRUSTED
								</div>
								<div className="text-sm">
									ENUINE PRODUCTS
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex w-full">
				<div className="flex flex-col gap-3 lg:flex-row mt-5 lg:ml-auto lg:mr-auto w-full sm:w-[1200px]">
					<div className="lg:w-3/4 w-full">
						<ProductDeals />
					</div>
					<div className="lg:w-1/4 w-full lg:mt-0 mt-4">
						<div className="w-full border-2">
							<div className="bg-[#eb3e32] text-white p-3">
								<h2 className="flex items-center justify-center gap-2 uppercase"> <CiViewList className="text-[33px]" />All Categories</h2>
							</div>
							<ul className="divide-y divide-gray-300 font-bold">
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Shirt</span>
									<button className="hover:text-gray-500">+</button>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>T-shirt</span>
									<button className="hover:text-gray-500">+</button>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Party Suit</span>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Women&apos;s Fashion</span>
									<button className="hover:text-gray-500">+</button>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Men&apos;s Fashion</span>
									<button className="hover:text-gray-500">+</button>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Summer Cloths</span>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Monsoon Cloths</span>
								</li>
								<li className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
									<span>Winter Cloths</span>
								</li>
							</ul>
						</div>
						<div className="mt-5">
							<ImageCarousel />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
