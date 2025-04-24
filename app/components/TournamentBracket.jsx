'use client';
import React, { useState } from 'react';

function BracketRound({ title, matches, onMatchUpdate }) {
    return (
        <div className="space-y-4 w-56">
            <h3 className="text-sm font-semibold text-center mb-1">{title}</h3>
            {matches.map((match, index) => {
                const [team1, team2, score1 = '', score2 = ''] = match;

                return (
                    <div
                        key={index}
                        className="bg-base-200 rounded-xl p-2 text-center shadow-md space-y-1"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-left w-full">{team1}</span>
                            <input
                                type="number"
                                min="0"
                                max="3"
                                className="input input-bordered input-xs w-10"
                                value={score1}
                                onChange={(e) =>
                                    onMatchUpdate(index, [team1, team2, e.target.value, score2])
                                }
                            />
                        </div>
                        <div className="text-sm text-neutral-content">vs</div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-left w-full">{team2}</span>
                            <input
                                type="number"
                                min="0"
                                max="3"
                                className="input input-bordered input-xs w-10"
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
                advance('upperFinal', 0, winner, index % 2);
                advance('lowerSemifinals', 0, loser, index);
            } else if (round === 'upperFinal') {
                // winner qualifies, loser goes to lowerFinal
                advance('lowerFinal', 0, loser, 0);
            } else if (round === 'lowerQuarterfinals') {
                advance('lowerSemifinals', 0, winner, index);
                // loser eliminated
            } else if (round === 'lowerSemifinals') {
                advance('lowerFinal', 0, winner, 1);
                // loser eliminated
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-6">
                <BracketRound
                    title="Upper QF (BO5)"
                    matches={data.upperQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', i, match)}
                />
                <BracketRound
                    title="Upper SF (BO5)"
                    matches={data.upperSemifinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('upperSemifinals', i, match)}
                />
                <BracketRound
                    title="Upper Final (Qualified)"
                    matches={data.upperFinal}
                    onMatchUpdate={(i, match) => handleMatchUpdate('upperFinal', i, match)}
                />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
                <BracketRound
                    title="Lower QF (BO5)"
                    matches={data.lowerQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                />
                <BracketRound
                    title="Lower SF (BO5)"
                    matches={data.lowerSemifinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerSemifinals', i, match)}
                />
                <BracketRound
                    title="Lower Final (Qualified)"
                    matches={data.lowerFinal}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerFinal', i, match)}
                />
            </div>
        </div>
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
            upperFinal: [['', '']],
            lowerQuarterfinals: [['', ''], ['', '']],
            lowerSemifinals: [['', '']],
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
            upperFinal: [['', '']],
            lowerQuarterfinals: [['', ''], ['', '']],
            lowerSemifinals: [['', '']],
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
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-10">RLCS Bracket Predictions</h1>
            <div className="flex flex-row justify-center gap-16">
                <div>
                    <h2 className="text-xl font-semibold text-center mb-4">Group A</h2>
                    <BracketGrid
                        groupKey="groupA"
                        data={bracketData.groupA}
                        updateBracket={updateBracket}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-center mb-4">Group B</h2>
                    <BracketGrid
                        groupKey="groupB"
                        data={bracketData.groupB}
                        updateBracket={updateBracket}
                    />
                </div>
            </div>
        </div>
    );
}
