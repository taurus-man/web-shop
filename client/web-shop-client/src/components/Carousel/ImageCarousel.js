"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageCarousel() {
    const images = ['https://picsum.photos/seed/random101/400/500', 'https://picsum.photos/seed/random102/400/500', 'https://picsum.photos/seed/random103/400/500'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div className="flex flex-col items-center relative">
            <div className='w-36 h-64 relative lg:w-full'>
                <Image
                    src={images[currentIndex]}
                    alt="Featured"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={true}
                />
            </div>
            <div className="flex relative z-50 justify-center space-x-1 mt-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`block h-2 w-2 rounded-full ${index === currentIndex ? 'bg-red-600' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
            <div className='mt-2 mb-2 border-b-2 w-full'>
                <span className="text-xs font-bold uppercase">Featured Post</span>
            </div>
        </div>
    );
}
