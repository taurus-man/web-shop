"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formData.email)) {
            setErrorMessage('Email format is not correct!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful');
                router.push('/signin');
            } else {
                setErrorMessage(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg w-full sm:w-96 p-4 sm:p-6 lg:p-8 mt-8 sm:mt-[20vh] dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign Up</h3>
                {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required="" />
                </div>
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="John Doe" required="" />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your password</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required="" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Confirm your password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required="" />
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up</button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Already have an account? <Link href="/signin" className="text-blue-700 hover:underline dark:text-blue-500">Sign In</Link>
                </div>
            </form>
        </div>
    );
}
