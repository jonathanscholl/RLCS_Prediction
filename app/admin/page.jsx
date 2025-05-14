'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkAdmin();
        fetchEvents();
    }, []);

    const checkAdmin = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/auth');
            return;
        }

        // Check if user is admin (you'll need to add an is_admin column to your profiles table)
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('user_id', session.user.id)
            .single();

        if (!profile?.is_admin) {
            router.push('/');
        }
    };

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')

            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };


    const handleEventSelect = (event) => {
        setSelectedEvent(event);

    };



    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 p-8">
                <div className="container mx-auto">
                    <div className="skeleton h-32 w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Event Selection */}
                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Select Event</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/bracket?event=${event.key}&admin_mode=true`}
                                    className="btn btn-ghost"
                                >
                                    {event.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
} 