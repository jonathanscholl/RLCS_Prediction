'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';

export default function Leaderboard() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, profile_picture, score')
                .order('score', { ascending: false })
                .limit(10);

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setError('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Leaderboard</h2>
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Leaderboard</h2>
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Leaderboard</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile, index) => (
                                <tr key={profile.username} className="hover">
                                    <td className="font-bold">{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-8 h-8 rounded-full">
                                                    {profile.profile_picture ? (
                                                        <Image
                                                            src={profile.profile_picture}
                                                            alt={profile.username}
                                                            fill
                                                            className="object-contain"
                                                            sizes="32px"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                                                            <span className="text-lg">👤</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-bold">{profile.username}</div>
                                        </div>
                                    </td>
                                    <td className="font-bold text-primary">{profile.score || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 