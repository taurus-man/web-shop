import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Web Shop",
	description: "Generated by Web Shop"
};

export default function RootLayout({ children }) {
	return (
		<UserProvider>
			<CartProvider>
				<html lang="en">
					<body className={`${inter.className} bg-white`}>
						<header>
							<Navbar />
						</header>
						<div className="flex flex-col items-center justify-between mt-[50px] mb-[50px] lg:mt-[150px] lg:mb-[50px]" style={{ minHeight: `calc(100vh - 200px)` }}>
							{children}
						</div>
					</body>
				</html>
			</CartProvider>
		</UserProvider>
	);
}
