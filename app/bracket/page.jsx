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



export default function BracketPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const event = searchParams.get('event');

    const [bracketData, setBracketData] = useState(null);

    useEffect(() => {
        if (!event) return;

        fetch(`/api/matches?event_key=${event}`)
            .then(res => res.json())
            .then(data => {
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

                    console.log(groupA)
                }
            })
            .catch(err => console.error('Error fetching matches:', err));
    }, [event]);

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

        <div className="relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 filter grayscale"
                style={{ backgroundImage: 'url("background.png")' }}
            />

            <div className="min-h-screen text-white p-4">

                <TournamentBracket bracketData={bracketData} updateBracket={updateBracket} />
            </div>

        </div>

    );
} 