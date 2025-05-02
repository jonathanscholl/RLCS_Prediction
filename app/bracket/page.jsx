'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TournamentBracket from '../components/TournamentBracket';

const initialNABracket = {
    groupA: {
        upperQuarterfinals: [
            ['Gen.G', 'PWR RANGERS'],
            ['REBELLION', 'STRICTLY BIZ'],
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
    const [bracketData, setBracketData] = useState(null);

    useEffect(() => {
        if (!region || !regionData[region]) {
            router.replace('/regions');
        } else {
            setBracketData(regionData[region]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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