"use client"
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
    const { state: cartState, addItemToCart } = useCart();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                const response = await fetch(`http://localhost:5000/product/${productId}`);
                const data = await response.json();
                setProduct(data);
            };
            fetchProduct();
        }
    }, [productId]);

    useEffect(() => {
        const productInCart = cartState.cartItems.some(item => item.product_id == productId);
        setIsInCart(productInCart);
    }, [productId, cartState.cartItems]);


    const handleAddToCart = () => {
        if (!isInCart) {
            addItemToCart(product.id, 1);
        }
    };


    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg w-full sm:w-96 p-4 sm:p-6 lg:p-8 mt-5 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-6">
                <div className="p-4">
                    <div className='w-full h-96 relative'>
                        <Image
                            src={product.image_url ? product.image_url : '/images/fallback.png'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority={true}
                        />
                    </div>
                    <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
                    <p className="text-xl text-[#eb3e32]">${product.price}</p>
                    <p className="text-md mt-2">{product.description}</p>
                    {isInCart ?
                        <button onClick={() => window.location.href = '/cart'} className="w-full mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Go to Cart</button>
                        :
                        <button onClick={handleAddToCart} className="w-full mt-6 text-white bg-[#eb3e32] hover:bg-[#a2423b] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add to Cart</button>
                    }
                </div>
            </div>
        </div>
    );
}
