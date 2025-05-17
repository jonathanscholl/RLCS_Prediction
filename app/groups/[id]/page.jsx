'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Leaderboard from '../../components/Leaderboard';

export default function GroupDetailsPage({ params }) {
    const groupId = use(params).id;
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Get the user's profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            // Fetch group details with owner information
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select(`id, name, join_link, owner!inner(id, username, profile_picture)`)
                .eq('id', groupId)
                .single();

            if (groupError) throw groupError;

            // Fetch group members
            const { data: membersData, error: membersError } = await supabase
                .from('group_members')
                .select(`
                    profile:profile_id (
                        id,
                        username,
                        profile_picture
                    )
                `)
                .eq('group_id', groupId);

            if (membersError) throw membersError;

            setGroup(groupData);
            setMembers(membersData.map(m => m.profile));
            setIsOwner(groupData.owner.id === profileData.id);
            setIsMember(membersData.some(m => m.profile.id === profileData.id));
        } catch (error) {
            console.error('Error fetching group details:', error);
            setError('Failed to load group details');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Get the user's profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            // Add user to group members
            const { error } = await supabase
                .from('group_members')
                .insert({
                    group_id: groupId,
                    profile_id: profileData.id
                });

            if (error) throw error;

            // Refresh group details
            fetchGroupDetails();
        } catch (error) {
            console.error('Error joining group:', error);
            setError('Failed to join group');
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Get the user's profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            // Remove user from group members
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('profile_id', profileData.id);

            if (error) throw error;

            // Refresh group details
            fetchGroupDetails();
        } catch (error) {
            console.error('Error leaving group:', error);
            setError('Failed to leave group');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error">
                    <span>Group not found</span>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[30vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{group.name}</h1>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="avatar">
                                <div className="mask mask-squircle w-8 h-8">
                                    {group.owner?.profile_picture ? (
                                        <img src={group.owner.profile_picture} alt={group.owner.username} />
                                    ) : (
                                        <div className="bg-base-300 flex items-center justify-center">
                                            <span className="text-lg">👤</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="text-lg opacity-80">Created by {group.owner?.username}</span>
                        </div>
                        {!isOwner && !isMember && (
                            <button
                                onClick={handleJoinGroup}
                                className="btn btn-primary"
                            >
                                Join Group
                            </button>
                        )}
                        {!isOwner && isMember && (
                            <button
                                onClick={handleLeaveGroup}
                                className="btn btn-error"
                            >
                                Leave Group
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Group Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Members Section */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-4">Members</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Owner */}
                                    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                {group.owner?.profile_picture ? (
                                                    <img src={group.owner.profile_picture} alt={group.owner.username} />
                                                ) : (
                                                    <div className="bg-base-300 flex items-center justify-center">
                                                        <span className="text-lg">👤</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{group.owner?.username}</h3>
                                            <span className="text-sm opacity-70">Owner</span>
                                        </div>
                                    </div>

                                    {/* Members */}
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    {member.profile_picture ? (
                                                        <img src={member.profile_picture} alt={member.username} />
                                                    ) : (
                                                        <div className="bg-base-300 flex items-center justify-center">
                                                            <span className="text-lg">👤</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{member.username}</h3>
                                                <span className="text-sm opacity-70">Member</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="lg:col-span-1">
                        <Leaderboard key={`${groupId}-${isMember}`} groupId={groupId} limit={10} />
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