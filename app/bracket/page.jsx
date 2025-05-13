'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TournamentBracket from '../components/TournamentBracket';

const initialBracket = {
    groupA: {
        upperQuarterfinals: [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
        ],

        upperSemifinals: [['Winner of UPQF1', 'Winner of UPQF2'], ['Winner of UPQF3', 'Winner of UPQF3']],
        qualified: [['Winner of Semifinals 1', 'Winner of Semifinals 2']],
        lowerQuarterfinals: [['Loser of UPQF1', 'Loser of UPQF2'], ['Loser of UPQF3', 'Loser of UPQF3']],
        lowerSemifinals: [['Loser of Semifinals 1', 'Winner of LQF1'], ['Loser of Semifinals 2', 'Winner of LQF2']],
        lowerFinal: [['Winner of LSF 1', 'Winner of LSF 2']],
    },
    groupB: {
        upperQuarterfinals: [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
        ],
        //TODO: 2d arrays for pb pic space for all of the rounds
        upperSemifinals: [['Winner of UPQF1', 'Winner of UPQF2'], ['Winner of UPQF3', 'Winner of UPQF3']],
        qualified: [['Winner of Semifinals 1', 'Winner of Semifinals 2']],
        lowerQuarterfinals: [['Loser of UPQF1', 'Loser of UPQF2'], ['Loser of UPQF3', 'Loser of UPQF3']],
        lowerSemifinals: [['Loser of Semifinals 1', 'Winner of LQF1'], ['Loser of Semifinals 2', 'Winner of LQF2']],
        lowerFinal: [['Winner of LSF 1', 'Winner of LSF 2']],
    },
    playoffs: {
        lowerRound1: [['', ''], ['', '']],
        upperQuarterfinals: [['', ''], ['', '']],
        lowerQuarterfinals: [['', ''], ['', '']],
        semifinals: [['', ''], ['', '']],
        grandFinal: [['', '']],
        champion: [['']],
    },
};

export default function BracketPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventKey = searchParams.get('event');
    const fromProfile = searchParams.get('from') === 'profile';

    const [bracketData, setBracketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        async function loadBracketData() {
            try {
                // Only check localStorage if coming from profile page
                if (fromProfile) {
                    const selectedBracket = localStorage.getItem('selectedBracket');
                    if (selectedBracket) {
                        const parsedBracket = JSON.parse(selectedBracket);
                        setBracketData(parsedBracket.bracket_data);
                        setIsReadOnly(true);
                        localStorage.removeItem('selectedBracket');
                        setLoading(false);
                        return;
                    }
                }

                // If not from profile or no selected bracket, fetch from API
                else {
                    const response = await fetch(`/api/matches?event_key=${eventKey}`);
                    const data = await response.json();

                    if (Array.isArray(data) && data.length >= 8) {
                        const groupA = {
                            ...initialBracket.groupA,
                            upperQuarterfinals: data.slice(0, 4).map(match => [
                                match.team1_data?.name,
                                match.team2_data?.name,
                                match.team1_data?.logo,
                                match.team2_data?.logo,
                                '', // initial score1
                                ''  // initial score2
                            ])
                        };
                        const groupB = {
                            ...initialBracket.groupB,
                            upperQuarterfinals: data.slice(4, 8).map(match => [
                                match.team1_data?.name,
                                match.team2_data?.name,
                                match.team1_data?.logo,
                                match.team2_data?.logo,
                                '', // initial score1
                                ''  // initial score2
                            ])
                        };
                        setBracketData({
                            ...initialBracket,
                            groupA,
                            groupB
                        });
                        setIsReadOnly(false);
                    }
                }
            } catch (error) {
                console.error('Error loading bracket data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadBracketData();
    }, [eventKey, fromProfile]);

    const updateBracket = (group, round, matches) => {
        setBracketData(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [round]: matches
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!bracketData) {
        return (
            <div className="text-white text-center p-4">
                No bracket data found.
            </div>
        );
    }

    return (

        <div className="relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 filter grayscale"
                style={{ backgroundImage: 'url("background.png")' }}
            />

            <TournamentBracket
                bracketData={bracketData}
                updateBracket={updateBracket}
                event_key={eventKey}
                readOnly={isReadOnly}
            />
        </div>
    );
} 