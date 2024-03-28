"use client"
import { useEffect, useState } from 'react';
import ProductCarousel from './ProductCarousel';

export default function ProductDeals() {
    return (
        <div className="ProductDeals">
            <ProductCarousel />
            {/* To add other deals ... */}
        </div>
    )
}