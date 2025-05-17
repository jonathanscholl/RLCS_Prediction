'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function JoinGroupPage({ params }) {
    const { joinLink } = use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const handleJoinLink = async () => {
            try {
                // Check if user is authenticated
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/auth');
                    return;
                }

                // Find the group with this join link
                const { data: group, error: groupError } = await supabase
                    .from('groups')
                    .select('id')
                    .eq('join_link', joinLink)
                    .single();

                if (groupError) throw groupError;
                if (!group) {
                    setError('Invalid join link');
                    return;
                }

                // Redirect to the group page
                router.push(`/groups/${group.id}`);
            } catch (error) {
                console.error('Error processing join link:', error);
                setError('Failed to process join link');
            } finally {
                setLoading(false);
            }
        };

        handleJoinLink();
    }, [joinLink, router]);

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

    return null;
} 