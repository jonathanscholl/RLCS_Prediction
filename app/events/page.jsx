'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function EventsPage() {
    const [regions, setRegions] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch regions
                const { data: regionsData, error: regionsError } = await supabase
                    .from('regions')
                    .select('*')
                    .order('name');

                if (regionsError) throw regionsError;
                setRegions(regionsData);

                // Fetch events
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select('*')

                if (eventsError) throw eventsError;
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredEvents = selectedRegion === 'all'
        ? events
        : events.filter(event => event.region_key === selectedRegion);

    if (isLoading) {
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
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">RLCS Events</h1>
                        <p className="text-lg opacity-80">
                            Select a region and make your predictions for upcoming RLCS events!
                        </p>
                    </div>
                </div>
            </div>

            {/* Region Filter */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <button
                        onClick={() => setSelectedRegion('all')}
                        className={`btn ${selectedRegion === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        All Regions
                    </button>
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.key)}
                            className={`btn ${selectedRegion === region.name ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {region.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Link
                            key={event.id}
                            href={`/bracket?event=${event.key}`}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="card-body">
                                <h3 className="card-title text-xl">{event.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="badge badge-primary">{event.region_key}</div>

                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary btn-sm">
                                        Predict now
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No events found</h3>
                        <p className="text-base-content/70">
                            There are no events available for the selected region.
                        </p>
                    </div>
                )}
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