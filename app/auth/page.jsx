'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import UserBrackets from '@/app/components/UserBrackets';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
        });
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/'); // Redirect to home after successful login
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            setError(error.message);
        }
    };

    if (user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            Profile
                        </h2>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                    <div className="bg-gray-700 rounded p-4 mb-8">
                        <p className="text-white text-center">
                            Logged in as: <span className="text-yellow-400">{user.email}</span>
                        </p>
                    </div>
                    <UserBrackets user={user} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </h2>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full text-white hover:text-yellow-400 transition-colors"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign In'
                            : "Don't have an account? Sign Up"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full text-white hover:text-yellow-400 transition-colors"
                    >
                        Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
} 