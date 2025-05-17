'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Get the user's profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (profileError) throw profileError;

            // Fetch groups owned by the user
            const { data: ownedGroups, error: ownedError } = await supabase
                .from('groups')
                .select(`id, name, join_link, owner!inner(id, username, profile_picture)`)
                .eq('owner', profileData.id);

            if (ownedError) throw ownedError;

            // Fetch groups where user is a member
            const { data: memberGroups, error: memberError } = await supabase
                .from('group_members')
                .select(`
                    group:group_id (
                        id,
                        name,
                        join_link,
                        owner:owner (
                            id,
                            username,
                            profile_picture
                        )
                    )
                `)
                .eq('profile_id', profileData.id);

            if (memberError) throw memberError;

            // Combine and format the groups
            const formattedOwnedGroups = ownedGroups || [];
            const formattedMemberGroups = (memberGroups || []).map(mg => mg.group);

            // Remove any duplicates (in case user is both owner and member)
            const allGroups = [...formattedOwnedGroups];
            formattedMemberGroups.forEach(group => {
                if (!allGroups.some(g => g.id === group.id)) {
                    allGroups.push(group);
                }
            });

            setGroups(allGroups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            // Generate a unique join link
            const joinLink = Math.random().toString(36).substring(2, 15);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            const { error } = await supabase
                .from('groups')
                .insert({
                    name: newGroupName,
                    join_link: joinLink,
                    owner: profileData.id
                });

            if (error) throw error;

            setShowCreateModal(false);
            setNewGroupName('');
            fetchGroups();
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Failed to create group');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[30vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Groups</h1>
                        <p className="text-lg opacity-80">
                            Create or join groups to compete with friends in RLCS predictions!
                        </p>
                    </div>
                </div>
            </div>

            {/* Groups Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                    >
                        Create Group
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error mb-8">
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="card bg-base-100 shadow-xl" onClick={() => router.push(`/groups/${group.id}`)}>
                            <div className="card-body">
                                <h3 className="card-title text-xl">{group.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
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
                                    <span className="text-sm opacity-70">Created by {group.owner?.username}</span>
                                </div>
                                <div className="card-actions justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(`${window.location.origin}/join/${group.join_link}`);
                                            alert('Join link copied to clipboard!');
                                        }}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Copy Join Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {groups.length === 0 && !error && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No groups found</h3>
                        <p className="text-base-content/70">
                            Create your first group now!
                        </p>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Group Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="input input-bordered"
                                    placeholder="Enter group name"
                                    required
                                />
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p className="text-sm opacity-70">Not affiliated with RLCS or Psyonix. Made for fun by the community.</p>
                </div>
            </footer>
        </main>
    );
} 