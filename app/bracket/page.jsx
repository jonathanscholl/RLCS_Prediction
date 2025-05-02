'use client';

import React, { useState } from 'react';
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


export default function BracketPage() {
    const [region, setRegion] = useState('NA');
    const [bracketData, setBracketData] = useState(initialNABracket);

    const handleRegion = (region) => {
        setRegion(region);
        setBracketData(region === 'NA' ? initialNABracket : initialEUBracket);
    };

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

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex flex-row justify-center gap-4 mb-8">
                <button
                    className={`px-6 py-2 rounded font-bold text-lg shadow ${region === 'NA' ? 'bg-yellow-400 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleRegion('NA')}
                >
                    NA Predictions
                </button>
                <button
                    className={`px-6 py-2 rounded font-bold text-lg shadow ${region === 'EU' ? 'bg-yellow-400 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleRegion('EU')}
                >
                    EU Predictions
                </button>
            </div>
            <TournamentBracket bracketData={bracketData} updateBracket={updateBracket} />
        </div>
    );
} 