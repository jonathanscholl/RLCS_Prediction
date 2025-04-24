'use client';
import React, { useState } from 'react';

function BracketRound({ title, matches, onMatchUpdate }) {
    return (
        <div className="space-y-4 w-56 relative">
            <div className="bg-gray-800 text-white py-1 px-2 text-center">
                <h3 className="text-sm font-semibold mb-0">{title}</h3>
            </div>
            {matches.map((match, index) => {
                const [team1, team2, score1 = '', score2 = ''] = match;

                return (
                    <div
                        key={index}
                        className="bg-gray-700 rounded p-2 text-center shadow-md space-y-1"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-left w-full">{team1}</span>
                            <input
                                type="number"
                                min="0"
                                max="3"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 text-center w-10 bg-gray-600 text-white"
                                value={score1}
                                onChange={(e) =>
                                    onMatchUpdate(index, [team1, team2, e.target.value, score2])
                                }
                            />
                        </div>
                        <div className="text-sm text-gray-400">vs</div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-left w-full">{team2}</span>
                            <input
                                type="number"
                                min="0"
                                max="3"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 text-center w-10 bg-gray-600 text-white"
                                value={score2}
                                onChange={(e) =>
                                    onMatchUpdate(index, [team1, team2, score1, e.target.value])
                                }
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function BracketGrid({ groupKey, data, updateBracket }) {
    const handleMatchUpdate = (round, index, newMatch) => {
        const updated = [...data[round]];
        updated[index] = newMatch;
        updateBracket(groupKey, round, updated);

        const [team1, team2, score1, score2] = newMatch;
        const s1 = parseInt(score1);
        const s2 = parseInt(score2);

        if ((s1 === 3 || s2 === 3) && (s1 <= 3 && s2 <= 3)) {
            const winner = s1 === 3 ? team1 : team2;
            const loser = s1 === 3 ? team2 : team1;

            const advance = (targetRound, matchIndex, team, position) => {
                const newRound = [...data[targetRound]];
                newRound[matchIndex] = newRound[matchIndex] || ['', ''];
                newRound[matchIndex][position] = team;
                updateBracket(groupKey, targetRound, newRound);
            };

            if (round === 'upperQuarterfinals') {
                advance('upperSemifinals', Math.floor(index / 2), winner, index % 2);
                advance('lowerQuarterfinals', Math.floor(index / 2), loser, index % 2);
            } else if (round === 'upperSemifinals') {
                advance('qualified', 0, winner, index % 2);
                advance('lowerSemifinals', index === 0 ? 1 : 0, loser, 0);
            } else if (round === 'qualified') {
                return;
            } else if (round === 'lowerQuarterfinals') {
                advance('lowerSemifinals', index, winner, 1);
            } else if (round === 'lowerSemifinals') {
                advance('lowerFinal', 0, winner, index);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full mx-auto relative">
            <div className="flex flex-row gap-20 my-auto items-center bg-primary">
                <div className="items-center">
                    <BracketRound
                        title="UPPER QUARTERFINALS (BO5)"
                        matches={data.upperQuarterfinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', i, match)}
                    />
                </div>

                <div className="flex justify-center flex-grow"> {/* Use flex-grow to take up available space */}

                    <BracketRound
                        title="UPPER SEMIFINALS (BO5)"
                        matches={data.upperSemifinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperSemifinals', i, match)}
                    />

                </div>

                <div className="flex justify-center">
                    <BracketRound
                        title="QUALIFIED"
                        matches={data.qualified}
                        onMatchUpdate={(i, match) => handleMatchUpdate('qualified', i, match)}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-20 my-auto items-center bg-primary">
                <div className="items-center">
                    <BracketRound
                        title="LOWER QUARTERFINALS (BO5)"
                        matches={data.lowerQuarterfinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                    />

                </div>
                <div className='flex-grow items-center justify-center'>
                    <BracketRound
                        title="LOWER SEMIFINALS (BO5)"
                        matches={data.lowerSemifinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerSemifinals', i, match)}
                    />
                </div>

                <div className="flex justify-center flex-grow">
                    <BracketRound
                        title="QUALIFIED"
                        matches={data.lowerFinal}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerFinal', i, match)}
                    />
                </div>
            </div>
        </div >
    );
}
export default function TournamentBracket() {
    const [bracketData, setBracketData] = useState({
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
    });

    const updateBracket = (group, round, matches) => {
        setBracketData((prev) => ({
            ...prev,
            [group]: {
                ...prev[group],
                [round]: matches,
            },
        }));
    };

    return (
        <div className="p-8 bg-gray-800 text-white">
            <h1 className="text-3xl font-bold text-center mb-10">RLCS Bracket Predictions</h1>
            <div className="flex flex-row justify-center gap-16">
                <div className='flex flex-col'>
                    <h2 className="text-xl font-semibold text-center mb-6">GROUP A</h2>
                    <div className='flex flex-row justify-center'>
                        <BracketGrid
                            groupKey="groupA"
                            data={bracketData.groupA}
                            updateBracket={updateBracket}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-semibold text-center mb-6">GROUP B</h2>
                    <div className='flex flex-row justify-center'>
                        <BracketGrid
                            groupKey="groupB"
                            data={bracketData.groupB}
                            updateBracket={updateBracket}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}