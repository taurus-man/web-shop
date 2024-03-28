"use client"
import { createContext, useContext, useEffect, useReducer } from 'react';
import { userReducer, initialState } from '../reducer/userReducer'
import { useRouter, usePathname } from 'next/navigation';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        if (user) {
            dispatch({ type: "USER", payload: user })
        } else {
            if (pathname != '/signin' && pathname != '/signup') {
                router.push("/signin");
            }
        }
    }, [])

    return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
}

// Custom hook to use user context
export function useUser() {
    return useContext(UserContext);
}