"use client";
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Signin() {
    const router = useRouter();
    const { state, dispatch } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formData.email)) {
            setError('Email format is not correct!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Sign-in successful');
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({ type: "USER", payload: data.user })
                router.push('/');
            } else {
                setError(data.message || data.error || 'Sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg w-full sm:w-96 p-4 sm:p-6 lg:p-8 mt-8 sm:mt-[20vh] dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign In</h3>
                {error && <p className="text-red-500">{error}</p>}
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Password</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-700 hover:underline dark:text-blue-500">Sign Up
                    </Link>
                </div>
            </form>

        </div>
    );
}
