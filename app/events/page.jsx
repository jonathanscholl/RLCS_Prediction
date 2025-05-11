'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EventsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const regionKey = searchParams.get('region');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`/api/events?region_key=${regionKey}`);
                if (!response.ok) throw new Error('Failed to fetch events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        if (regionKey) {
            fetchEvents();
        }
    }, [regionKey]);

    const handleEventSelect = (eventKey) => {
        router.push(`/bracket?event=${eventKey}`);
    };

    const handleBack = () => {
        router.push('/regions');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
            <button
                onClick={handleBack}
                className="absolute top-4 left-4 px-4 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
            >
                ← Back to Regions
            </button>

            <h1 className="text-3xl font-bold mb-8">
                {regionKey} Events
            </h1>

            <div className="flex flex-col gap-4 w-full max-w-md">
                {events.map((event) => (
                    <button
                        key={event.key}
                        className="px-6 py-4 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors text-left"
                        onClick={() => handleEventSelect(event.key)}
                    >
                        <div className="font-bold text-xl mb-1">{event.name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
} 