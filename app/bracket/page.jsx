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
        //TODO: 2d arrays for pb pic space for all of the rounds
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



const regionEventMap = {
    NA: { event_id: 1, initial: initialBracket },
    EU: { event_id: 2, initial: initialBracket },
    MENA: { event_id: 3, initial: initialBracket },
    // Add more regions as needed
    // MENA: { event_id: 3, initial: initialMENABracket },
    // ...
};


export default function BracketPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const region = searchParams.get('region');
    const region_id = regionEventMap[region]?.event_id;
    const [bracketData, setBracketData] = useState(null);

    useEffect(() => {
        if (!region || !regionEventMap[region]) return;

        const { event_id, initial } = regionEventMap[region];

        fetch(`/api/matches?event_id=${event_id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length >= 8) {
                    const groupA = {
                        ...initial.groupA,
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
                        ...initial.groupB,
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
                        ...initial,
                        groupA,
                        groupB
                    });

                    console.log(groupA)
                }
            })
            .catch(err => console.error('Error fetching matches:', err));
    }, [region]);

    const updateBracket = (group, round, matches) => {
        setBracketData((prev) => {
            const newData = {
                ...prev,
                [group]: {
                    ...prev[group],
                    [round]: matches,
                },
            };
            // (copy the playoff auto-advance logic from TournamentBracket here if needed)
            return newData;
        });
    };

    if (!bracketData) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <button
                className="mb-8 px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                onClick={() => router.push('/regions')}
            >
                &larr; Go Back
            </button>
            <TournamentBracket bracketData={bracketData} updateBracket={updateBracket} />
        </div>
    );
} 