"use client"
import React from 'react';
import { useCart } from '@/context/CartContext'; // Adjust the import path as needed
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Cart() {
    const { state: { cartItems }, removeItemFromCart, updateCartItem } = useCart();
    const router = useRouter();

    const totalPrice = parseFloat(cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2));


    const handleRemoveItem = async (product_id) => {
        await removeItemFromCart(product_id);
    };

    const handleQuantityChange = async (product_id, newQuantity) => {
        if (newQuantity > 0) {
            await updateCartItem(product_id, newQuantity);
        }
    };

    const navigateToProduct = (product_id) => {
        router.push(`/products/${product_id}`);
    }

    if (cartItems.length === 0) {
        return <p className='mt-4'>Please add products to Cart</p>;
    }

    return (
        <div className="container mx-auto bg-white shadow overflow-hidden sm:rounded-md mt-5 p-5 max-w-[1200px]">
            <div className="space-y-6">
                <h2 className='font-bold'>Your Cart</h2>
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row align-center px-4 py-4 border-b border-gray-300">
                            <div className="flex flex-col items-center sm:flex-row align-center w-full mb-2 sm:mb-0" onClick={() => navigateToProduct(item.product_id)}>
                                <div className='w-12 h-12 relative'>
                                    <Image
                                        src={item.image_url ? item.image_url : '/images/fallback.png'}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        priority={true}
                                        className="rounded-full"
                                    />
                                </div>
                                <span className="ml-3 self-center">{item.name}</span>
                                <span className="ml-3 self-center">${item.price}</span>
                            </div>
                            <div className='flex justify-center items-center w-28 mr-4 mx-auto text-center ml-auto mr-auto'>
                                <div onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)} className="flex justify-center items-center border border-gray-200 bg-gray-200 w-8 h-6 rounded-l-md select-none cursor-pointer">-</div>
                                <span className='w-5 h-6 border-t-2 border-b-2'> {item.quantity} </span>
                                <div onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)} className="flex justify-center items-center border border-gray-200 bg-gray-200 w-8 h-6 rounded-r-md select-none cursor-pointer">+</div>

                            </div>
                            <div className="flex flex-col sm:flex-row w-full justify-center items-center mb-2 sm:mb-0">
                                {item.price &&
                                    <>
                                        {item.quantity &&
                                            <div className="ml-3">Item Total: {item.price * item.quantity}</div>
                                        }
                                    </>
                                }
                            </div>
                            <button onClick={() => handleRemoveItem(item.product_id)} className='flex justify-center sm:flex-col'>
                                <AiOutlineDelete />
                            </button>
                        </div>
                    ))}
                </div>
                <p className='mt-2 mb-4 text-center '>Max Total: {totalPrice}$</p>
            </div>
        </div>
    );
}
