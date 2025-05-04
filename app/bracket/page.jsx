'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TournamentBracket from '../components/TournamentBracket';

const initialNABracket = {
    groupA: {
        upperQuarterfinals: [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
        ],
        upperSemifinals: [['', ''], ['', '']],
        qualified: [['', '']],
        lowerQuarterfinals: [['', ''], ['', '']],
        lowerSemifinals: [['', ''], ['', '']],
        lowerFinal: [['', '']],
    },
    groupB: {
        upperQuarterfinals: [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
        ],
        upperSemifinals: [['', ''], ['', '']],
        qualified: [['', '']],
        lowerQuarterfinals: [['', ''], ['', '']],
        lowerSemifinals: [['', ''], ['', '']],
        lowerFinal: [['', '']],
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

const initialEUBracket = {
    groupA: {
        upperQuarterfinals: [
            ['Dignitas', '100%'],
            ['Karmine Corp', 'Vitality'],
            ['ULTIMATES', 'SIMTAWK+1'],
            ['SPACESTATION', 'TEAM EVO'],
        ],
        upperSemifinals: [['', ''], ['', '']],
        qualified: [['', '']],
        lowerQuarterfinals: [['', ''], ['', '']],
        lowerSemifinals: [['', ''], ['', '']],
        lowerFinal: [['', '']],
    },
    groupB: {
        upperQuarterfinals: [
            ['COMPLEXITY', 'DELETED'],
            ['PIRATES', '9LIVES'],
            ['NRG', 'WASSUP'],
            ['THE BOYS', 'NAH'],
        ],
        upperSemifinals: [['', ''], ['', '']],
        qualified: [['', '']],
        lowerQuarterfinals: [['', ''], ['', '']],
        lowerSemifinals: [['', ''], ['', '']],
        lowerFinal: [['', '']],
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

// Use NA teams as placeholder for other regions
const initialMENABracket = JSON.parse(JSON.stringify(initialNABracket));
const initialSAMBracket = JSON.parse(JSON.stringify(initialNABracket));
const initialAPACBracket = JSON.parse(JSON.stringify(initialNABracket));
const initialOCEBracket = JSON.parse(JSON.stringify(initialNABracket));

const regionEventMap = {
    NA: { event_id: 1, initial: initialNABracket },
    EU: { event_id: 2, initial: initialEUBracket },
    // Add more regions as needed
    // MENA: { event_id: 3, initial: initialMENABracket },
    // ...
};

const regionData = {
    NA: initialNABracket,
    EU: initialEUBracket,
    MENA: initialMENABracket,
    SAM: initialSAMBracket,
    APAC: initialAPACBracket,
    OCE: initialOCEBracket,
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
                            match.team2_data?.name
                        ])
                    };
                    const groupB = {
                        ...initial.groupB,
                        upperQuarterfinals: data.slice(4, 8).map(match => [
                            match.team1_data?.name,
                            match.team2_data?.name
                        ])
                    };
                    setBracketData({
                        ...initial,
                        groupA,
                        groupB
                    });
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