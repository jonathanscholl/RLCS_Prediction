'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import UserBrackets from '../components/UserBrackets';
import Image from 'next/image';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                // Fetch user's profile
                fetchProfile(session.user.id);
            }
        });
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, profile_picture')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;

            // Delete old profile picture if it exists
            if (profile?.profile_picture) {
                const oldFileName = profile.profile_picture.split('/').pop();
                const { error: deleteError } = await supabase.storage
                    .from('profile-pictures')
                    .remove([oldFileName]);

                if (deleteError) {
                    console.error('Delete error:', deleteError);
                }
            }

            console.log('Attempting to upload file:', {
                fileName,
                fileType: file.type,
                fileSize: file.size
            });

            // Upload new image to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error details:', {
                    message: uploadError.message,
                    name: uploadError.name,
                    status: uploadError.status,
                    statusText: uploadError.statusText
                });
                throw uploadError;
            }

            console.log('Upload successful:', uploadData);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            console.log('Public URL:', publicUrl);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_picture: publicUrl })
                .eq('user_id', user.id);

            if (updateError) {
                console.error('Update error:', updateError);
                throw updateError;
            }

            // Refresh profile data
            await fetchProfile(user.id);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert(`Error uploading avatar: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                // Check if username already exists
                const { data: existingUser, error: checkError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                    throw checkError;
                }

                if (existingUser) {
                    throw new Error('Username already taken');
                }

                // Sign up the user
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) throw signUpError;

                // Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: authData.user.id,
                            username: username,
                        }
                    ]);

                if (profileError) throw profileError;

                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session.user);
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

    const handleImageClick = () => {
        if (profile?.profile_picture) {
            setShowFullscreen(true);
        }
    };

    if (user) {
        return (
            <main className="min-h-screen bg-base-200">
                {/* Hero Section */}
                <div className="hero min-h-[30vh] bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">My Profile</h1>
                            <p className="text-lg opacity-80">
                                Manage your predictions and track your progress
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        className="relative w-32 h-32 cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={handleImageClick}
                                    >
                                        {profile?.profile_picture ? (
                                            <Image
                                                src={profile.profile_picture}
                                                alt="Profile"
                                                fill
                                                className="rounded-full object-contain"
                                                sizes="(max-width: 128px) 100vw, 128px"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center">
                                                <span className="text-4xl">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="btn btn-primary btn-sm">
                                        {uploading ? 'Uploading...' : 'Change Picture'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                {/* Fullscreen Modal */}
                                {showFullscreen && profile?.profile_picture && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
                                        onClick={() => setShowFullscreen(false)}
                                    >
                                        <div className="relative max-w-4xl max-h-[90vh] w-full h-full p-4">
                                            <button
                                                className="absolute top-4 right-4 text-white hover:text-gray-300"
                                                onClick={() => setShowFullscreen(false)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={profile.profile_picture}
                                                    alt="Profile Fullscreen"
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Info Section */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-6">Account Details</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 text-base-content/70">Email:</div>
                                            <div className="text-lg font-semibold text-primary">{user.email}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 text-base-content/70">Username:</div>
                                            <div className="text-lg font-semibold text-primary">{profile?.username || 'Loading...'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sign Out Button */}
                                <div className="md:self-start">
                                    <button
                                        onClick={handleSignOut}
                                        className="btn btn-error"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Brackets */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold mb-4">My Predictions</h2>
                            <UserBrackets user={user} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                    <div>
                        <p className="text-sm opacity-70">Not affiliated with RLCS or Psyonix. Made for fun by the community.</p>
                    </div>
                </footer>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[30vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-lg opacity-80">
                            {isSignUp
                                ? 'Join the RLCS prediction community and start making your picks!'
                                : 'Sign in to manage your predictions and compete with friends!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Auth Form */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="card bg-base-100 shadow-xl flex flex-col items-center">
                        <div className="card-body">
                            <form onSubmit={handleAuth} className="space-y-4">
                                {isSignUp && (
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Username</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="input input-bordered"
                                            required
                                            minLength={3}
                                            maxLength={20}
                                            pattern="[a-zA-Z0-9_-]+"
                                            title="Username can only contain letters, numbers, underscores, and hyphens"
                                        />
                                    </div>
                                )}

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-error">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="form-control mt-6 flex justify-center">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {isSignUp ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </div>
                            </form>

                            <div className="divider">OR</div>

                            <div className="text-center">
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="btn btn-ghost"
                                >
                                    {isSignUp
                                        ? 'Already have an account? Sign In'
                                        : "Don't have an account? Sign Up"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p className="text-sm opacity-70">Not affiliated with RLCS or Psyonix. Made for fun by the community.</p>
                </div>
            </footer>
        </main>
    );
} 