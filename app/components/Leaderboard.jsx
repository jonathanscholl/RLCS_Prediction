'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

export default function Leaderboard({ limit = 3, groupId = null }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, [groupId]);

    const fetchProfiles = async () => {
        try {
            // Get current user's session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Get current user's profile
            const { data: userProfile, error: userError } = await supabase
                .from('profiles')
                .select('id, username, profile_picture, score')
                .eq('user_id', session.user.id)
                .single();

            if (userError) throw userError;
            setCurrentUser(userProfile);

            if (groupId) {
                // First get all group members' profile IDs
                const { data: memberData, error: memberError } = await supabase
                    .from('group_members')
                    .select('profile_id')
                    .eq('group_id', groupId);

                if (memberError) throw memberError;

                // Get the group owner's ID
                const { data: groupData, error: groupError } = await supabase
                    .from('groups')
                    .select('owner')
                    .eq('id', groupId)
                    .single();

                if (groupError) throw groupError;

                // Combine member IDs and owner ID
                const profileIds = [
                    ...memberData.map(m => m.profile_id),
                    groupData.owner
                ];

                // Get profiles for all IDs
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, profile_picture, score')
                    .in('id', profileIds);

                if (error) throw error;

                // Sort profiles by score in descending order
                const sortedProfiles = (data || []).sort((a, b) => {
                    const scoreA = a.score || 0;
                    const scoreB = b.score || 0;
                    return scoreB - scoreA;
                });

                // Calculate user's rank
                const userRank = sortedProfiles.findIndex(p => p.id === userProfile.id) + 1;
                setUserRank(userRank);

                setProfiles(sortedProfiles.slice(0, limit));
            } else {
                // Global leaderboard
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, profile_picture, score, id');

                if (error) throw error;

                // Sort profiles by score in descending order
                const sortedProfiles = (data || []).sort((a, b) => {
                    const scoreA = a.score || 0;
                    const scoreB = b.score || 0;
                    return scoreB - scoreA;
                });

                // Calculate user's rank
                const userRank = sortedProfiles.findIndex(p => p.id === userProfile.id) + 1;
                setUserRank(userRank);

                setProfiles(sortedProfiles.slice(0, limit));
            }
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
        return `#${index + 1}`;
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
                    {limit === 3 && !groupId && (
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
                            {currentUser && (
                                <tr className="bg-primary/10 border-t-2 border-primary">
                                    <td className="font-bold">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary">You</span>
                                            <span className="text-sm opacity-70">#{userRank}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-8 h-8">
                                                    {currentUser.profile_picture ? (
                                                        <img src={currentUser.profile_picture} alt={currentUser.username} />
                                                    ) : (
                                                        <div className="bg-base-300 flex items-center justify-center">
                                                            <span className="text-lg">👤</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-bold">{currentUser.username}</div>
                                        </div>
                                    </td>
                                    <td>{currentUser.score || 0}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 