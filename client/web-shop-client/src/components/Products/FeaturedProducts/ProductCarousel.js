import { useEffect, useState } from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


export default function ProductCarousel() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5000/product');
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const nextSet = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const prevSet = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    const productsPerPage = 4;


    const navigateToProduct = (productId) => {
        router.push(`/products/${productId}`);
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className='flex justify-between'>
                <h2 className="text-lg font-medium text-gray-900">DEALS OF THE DAY</h2>
                <div>
                    <button
                        onClick={prevSet}
                        disabled={currentIndex === 0}
                        className={`p-2 ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-900'}`}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={nextSet}
                        disabled={currentIndex === products.length - productsPerPage}
                        className={`p-2 ${currentIndex === products.length - productsPerPage ? 'text-gray-300' : 'text-gray-900'}`}
                    >
                        <FaChevronRight />

                    </button>
                </div>
            </div>
            <hr className="h-[2px] bg-[#eb3e32] border-0 w-16" />
            <div className="flex h-80 overflow-hidden mt-6 ">

                {products.slice(currentIndex, currentIndex + productsPerPage).map((product) => (
                    <div
                        key={product.id}
                        className="flex-none w-full sm:w-1/3 lg:w-1/4 p-2 cursor-pointer"
                        onClick={() => navigateToProduct(product.id)}
                    >
                        <div className='w-full h-[60%] relative'>
                            <Image
                                src={product.image_url ? product.image_url : '/images/fallback.png'}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                priority={true}
                            />
                        </div>

                        <h3 className="mt-2 text-sm text-center">{product.name}</h3>
                        <StarRating />

                        <div className="mt-1 text-sm font-medium text-center">
                            <span className="text-gray-400 line-through">
                                ${product.price + 1}
                            </span>
                            <span className="text-[#eb3e32] ml-2">
                                ${product.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
