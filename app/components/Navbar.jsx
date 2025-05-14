'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-base-100/80 backdrop-blur-md rounded-full shadow-lg z-50 w-[95%] max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-base-content text-xl font-bold">RLCS Predictions</span>
                        </div>
                        <div className="p-2 rounded-full bg-base-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-base-100/80 backdrop-blur-md rounded-full shadow-lg z-50 w-[95%] max-w-7xl border-2">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        >
                            <span className="text-xl font-bold text-base-content">RLCS Predictions</span>
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/events')}
                            className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        >
                            <span className="text-xl font-bold text-base-content">Events</span>
                        </button>
                        <button
                            onClick={() => router.push('/leaderboard')}
                            className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        >
                            <span className="text-xl font-bold text-base-content">Leaderboard</span>
                        </button>
                    </div>
                    <button
                        onClick={() => router.push('/auth')}
                        className="btn btn-ghost btn-circle"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
} 