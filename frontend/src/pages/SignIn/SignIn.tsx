import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './SignIn.css';
import {AUTH_ENDPOINTS} from "../../utils/endpoints.tsx";
import { useNavigate } from 'react-router-dom';



const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(AUTH_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.validated) {
                // ✅ Navigate on successful login
                toast.success('Login successful!');
                // Store token or user data if needed
                localStorage.setItem('token', data.token); // Assuming the token is returned
                localStorage.setItem('firstName', data.firstName);
                localStorage.setItem('lastName', data.lastName);
                localStorage.setItem('accountType', data.accountType);
                navigate('/dashboard');
            } else {
                // ❌ Show toast for invalid login
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            {/* Left Side - Welcome Section */}
            <div className="relative hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
                <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('/img.png')" }} />
                <div className="relative z-10 text-center px-10">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in">Welcome Back!</h1>
                    <p className="text-lg animate-fade-in delay-200">
                        Sign in to continue and explore amazing features.
                    </p>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex justify-center items-center flex-1 bg-gray-50 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6 animate-slide-up"
                >
                    <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95"
                    >
                        Sign In
                    </button>

                </form>
            </div>
        </div>
    );
};

export default SignIn;