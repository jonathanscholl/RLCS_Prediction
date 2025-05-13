'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import TournamentBracket from './TournamentBracket';

export default function UserBrackets({ user }) {
    const [brackets, setBrackets] = useState([]);
    const [selectedBracket, setSelectedBracket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchBrackets() {
            try {
                // Get all brackets for the user with event names using a join
                const { data: userBrackets, error: bracketsError } = await supabase
                    .from('user_brackets')
                    .select(`
                        *,
                        events (
                            name
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('event_key', { ascending: true });

                if (bracketsError) throw bracketsError;

                setBrackets(userBrackets);
            } catch (err) {
                console.error('Error fetching brackets:', err);
                setError('Failed to load brackets');
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchBrackets();
        }
    }, [user]);

    const handleBracketClick = (bracket) => {
        // Store the bracket data in localStorage
        localStorage.setItem('selectedBracket', JSON.stringify(bracket));
        // Redirect to the bracket page with from=profile parameter
        router.push(`/bracket?event=${bracket.event_key}&from=profile`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    if (brackets.length === 0) {
        return (
            <div className="text-white text-center p-4">
                You haven't submitted any brackets yet.
            </div>
        );
    }

    if (selectedBracket) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setSelectedBracket(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-yellow-400 hover:text-black transition-colors"
                >
                    Back to My Brackets
                </button>
                <TournamentBracket
                    bracketData={selectedBracket.bracket_data}
                    event_key={selectedBracket.event_key}
                    readOnly={true}
                    updateBracket={() => { }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">My Brackets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brackets.map((bracket) => (
                    <button
                        key={bracket.id}
                        onClick={() => handleBracketClick(bracket)}
                        className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                    >
                        <h4 className="text-lg font-semibold text-white mb-2">
                            {bracket.events?.name || bracket.event_key}
                        </h4>
                    </button>
                ))}
            </div>
        </div>
    );
} 