'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

export default function Leaderboard({ limit = 3 }) {
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
                .limit(limit);

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setError('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const getRankDisplay = (index) => {
        if (index === 0) return <Image src="/ssl.png" alt="SSL" width={48} height={48} />;
        if (index === 1) return <Image src="/gc3.png" alt="GC3" width={48} height={48} />;
        if (index === 2) return <Image src="/gc2.png" alt="GC2" width={48} height={48} />;
        return index + 1;
    };

    if (loading) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Leaderboard</h2>
                    </div>
                    <div className="skeleton h-32 w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Leaderboard</h2>
                    </div>
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Leaderboard</h2>
                    {limit === 3 && (
                        <Link href="/leaderboard" className="btn btn-ghost btn-sm">
                            View All
                        </Link>
                    )}
                </div>
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
                                    <td className="font-bold">{getRankDisplay(index)}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-8 h-8">
                                                    {profile.profile_picture ? (
                                                        <img src={profile.profile_picture} alt={profile.username} />
                                                    ) : (
                                                        <div className="bg-base-300 flex items-center justify-center">
                                                            <span className="text-lg">👤</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-bold">{profile.username}</div>
                                        </div>
                                    </td>
                                    <td>{profile.score || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 