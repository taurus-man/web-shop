"use client"
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUser } from './UserContext';

// Initial state of the cart
const initialState = {
    cartItems: [],
};

const CartContext = createContext();

// Helper functions to get the token
const getAuthToken = () => {
    return localStorage.getItem('jwt');
};

// Cart Api call functions
const addItemToCartBackend = async (product_id, quantity) => {
    const token = getAuthToken();
    const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
    });
    return response.json();
};

const removeItemFromCartBackend = async (product_id) => {
    const token = getAuthToken();
    const response = await fetch('http://localhost:5000/cart/remove', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id }),
    });
    return response.json();
};

const updateCartItemBackend = async (product_id, quantity) => {
    const token = getAuthToken();
    const response = await fetch('http://localhost:5000/cart/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
    });
    return response.json();
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'SET_CART_ITEMS':
            return { ...state, cartItems: action.payload };
        case 'ADD_ITEM':
            // Check if the item is already in the cart
            const existingItemIndex = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
            if (existingItemIndex > -1) {
                // Increase the quantity of the existing item
                const updatedCartItems = state.cartItems.map((item, index) => {
                    if (index === existingItemIndex) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });
                return { ...state, cartItems: updatedCartItems };
            } else {
                // Item is not in the cart, add it
                return { ...state, cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }] };
            }

        case 'REMOVE_ITEM':
            return { ...state, cartItems: state.cartItems.filter(item => item.product_id !== action.payload) };
        case 'UPDATE_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map(item => item.product_id === action.payload.product_id ? { ...item, quantity: action.payload.quantity } : item),
            };
        default:
            return state;
    }
}

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { state: userState } = useUser()

    // to set the initial state with backend data
    useEffect(() => {
        if (userState) {
            const fetchCartItems = async () => {
                const token = getAuthToken();
                const response = await fetch('http://localhost:5000/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const items = await response.json();
                dispatch({ type: 'SET_CART_ITEMS', payload: items });
            };

            fetchCartItems().catch(error => console.error("Failed to fetch cart items", error));
        }
    }, [userState]);

    // functions to execute Cart changes to state and backend
    const addItemToCart = async (product_id, quantity) => {
        const item = await addItemToCartBackend(product_id, quantity);
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItemFromCart = async (product_id) => {
        await removeItemFromCartBackend(product_id);
        dispatch({ type: 'REMOVE_ITEM', payload: product_id });
    };

    const updateCartItem = async (product_id, quantity) => {
        const item = await updateCartItemBackend(product_id, quantity);
        dispatch({ type: 'UPDATE_ITEM', payload: item });
    };

    return (
        <CartContext.Provider value={{ state, dispatch, addItemToCart, removeItemFromCart, updateCartItem }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);