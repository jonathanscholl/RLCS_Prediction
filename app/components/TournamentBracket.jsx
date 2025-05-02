'use client';
import React, { useState } from 'react';
import StandingsTable from './StandingsTable';

/**
 * Represents a single match in the tournament bracket
 * @param {Object} props
 * @param {string} props.team1 - First team name
 * @param {string} props.team2 - Second team name
 * @param {string} props.score1 - First team's score
 * @param {string} props.score2 - Second team's score
 * @param {Function} props.onScoreChange - Callback when score changes
 */
function Match({ team1, team2, score1 = '', score2 = '', onScoreChange }) {
    // Determine if either team has won (reached 3 points)
    const team1Won = parseInt(score1) === 3;
    const team2Won = parseInt(score2) === 3;

    // Calculate total score and check if it's valid
    const totalScore = (parseInt(score1) || 0) + (parseInt(score2) || 0);
    const isInvalidScore = totalScore > 5;

    // Base input styles
    const baseInputStyles = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 text-center w-10 text-white";

    // Dynamic background color based on win status
    const getInputStyles = (isWinner) => {
        return `${baseInputStyles} ${isWinner ? 'bg-success' : 'bg-gray-600'}`;
    };

    return (
        <div className="bg-gray-700 rounded p-2 text-center shadow-md space-y-1">
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-left w-full">{team1}</span>
                <input
                    type="number"
                    min="0"
                    max="3"
                    className={getInputStyles(team1Won)}
                    value={score1}
                    onChange={(e) => onScoreChange(0, e.target.value)}
                />
            </div>
            <div className="text-sm text-gray-400">vs</div>
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-left w-full">{team2}</span>
                <input
                    type="number"
                    min="0"
                    max="3"
                    className={getInputStyles(team2Won)}
                    value={score2}
                    onChange={(e) => onScoreChange(1, e.target.value)}
                />
            </div>
            {isInvalidScore && (
                <div className="text-red-500 text-sm mt-1">
                    Invalid score: Games are best of 5 (maximum 5 games total)
                </div>
            )}
        </div>
    );
}

/**
 * Represents a round in the tournament bracket (e.g., Quarterfinals, Semifinals)
 * @param {Object} props
 * @param {string} props.title - Round title
 * @param {Array} props.matches - Array of matches in this round
 * @param {Function} props.onMatchUpdate - Callback when a match is updated
 */
function BracketRound({ title, matches, onMatchUpdate }) {
    return (
        <div className="space-y-4 w-56 relative">
            <div className="bg-gray-800 text-white py-1 px-2 text-center">
                <h3 className="text-sm font-semibold mb-0">{title}</h3>
            </div>
            {matches.map((match, index) => (
                <Match
                    key={index}
                    team1={match[0]}
                    team2={match[1]}
                    score1={match[2]}
                    score2={match[3]}
                    onScoreChange={(teamIndex, newScore) => {
                        const newMatch = [...match];
                        newMatch[teamIndex + 2] = newScore;
                        onMatchUpdate(index, newMatch);
                    }}
                />
            ))}
        </div>
    );
}

/**
 * Updates playoff brackets when group stage matches are completed
 * @param {Object} data - Current bracket data
 * @param {Function} updateBracket - Function to update bracket data
 */
function updatePlayoffBrackets(data, updateBracket) {
    console.log('Updating playoff brackets with data:', data);

    // Check if both groups have their qualified teams
    const groupAQualified = data.groupA?.qualified?.[0] || [];
    const groupBQualified = data.groupB?.qualified?.[0] || [];

    console.log('Group A Qualified:', groupAQualified);
    console.log('Group B Qualified:', groupBQualified);

    // Only proceed if both groups have their qualified teams
    if (groupAQualified[0] && groupAQualified[1] && groupBQualified[0] && groupBQualified[1]) {
        console.log('Updating upper quarterfinals');
        // Update upper quarterfinals
        updateBracket('playoffs', 'upperQuarterfinals', [
            [groupAQualified[0], groupBQualified[1]], // Group A Seed 1 vs Group B Seed 2
            [groupAQualified[1], groupBQualified[0]]  // Group A Seed 2 vs Group B Seed 1
        ]);
    }

    // Check if both groups have their lower final winners
    const groupALowerFinal = data.groupA?.lowerFinal?.[0] || [];
    const groupBLowerFinal = data.groupB?.lowerFinal?.[0] || [];

    console.log('Group A Lower Final:', groupALowerFinal);
    console.log('Group B Lower Final:', groupBLowerFinal);

    // Update lower round 1 if both groups have lower final results
    if (groupALowerFinal[0] && groupALowerFinal[1] && groupBLowerFinal[0] && groupBLowerFinal[1]) {
        // Pair: Group A lower final winner vs Group B lower final loser, and vice versa
        updateBracket('playoffs', 'lowerRound1', [
            [groupALowerFinal[0], groupBLowerFinal[1]],
            [groupBLowerFinal[0], groupALowerFinal[1]]
        ]);
    }
}

/**
 * Handles the logic for advancing teams through the bracket
 * @param {Object} data - Current bracket data
 * @param {string} groupKey - Group identifier (A or B)
 * @param {string} round - Current round
 * @param {number} index - Match index
 * @param {string} winner - Winning team
 * @param {string} loser - Losing team
 * @param {Function} updateBracket - Function to update bracket data
 */
function advanceTeam(data, groupKey, round, index, winner, loser, updateBracket) {
    const advance = (targetRound, matchIndex, team, position) => {
        const newRound = [...data[targetRound]];
        newRound[matchIndex] = newRound[matchIndex] || ['', ''];
        newRound[matchIndex][position] = team;
        updateBracket(groupKey, targetRound, newRound);
    };

    // Handle team advancement based on the current round
    switch (round) {
        case 'upperQuarterfinals':
            advance('upperSemifinals', Math.floor(index / 2), winner, index % 2);
            advance('lowerQuarterfinals', Math.floor(index / 2), loser, index % 2);
            break;
        case 'upperSemifinals':
            advance('qualified', 0, winner, index % 2);
            advance('lowerSemifinals', index === 0 ? 1 : 0, loser, 0);
            break;
        case 'qualified':
            // When a team qualifies, check and update playoff brackets
            updatePlayoffBrackets(data, updateBracket);
            break;
        case 'lowerQuarterfinals':
            advance('lowerSemifinals', index, winner, 1);
            break;
        case 'lowerSemifinals':
            advance('lowerFinal', 0, winner, index);
            break;
        case 'lowerFinal':
            // When a team wins the lower final, check and update playoff brackets
            updatePlayoffBrackets(data, updateBracket);
            break;
    }
}

/**
 * Represents a complete bracket grid for a group
 * @param {Object} props
 * @param {string} props.groupKey - Group identifier (A or B)
 * @param {Object} props.data - Bracket data for this group
 * @param {Function} props.updateBracket - Function to update bracket data
 */
function BracketGrid({ groupKey, data, updateBracket }) {
    const handleMatchUpdate = (round, index, newMatch) => {
        const updated = [...data[round]];
        updated[index] = newMatch;
        updateBracket(groupKey, round, updated);

        const [team1, team2, score1, score2] = newMatch;
        const s1 = parseInt(score1);
        const s2 = parseInt(score2);

        // Check if match is complete (best of 5)
        if ((s1 === 3 || s2 === 3) && (s1 <= 3 && s2 <= 3)) {
            const winner = s1 === 3 ? team1 : team2;
            const loser = s1 === 3 ? team2 : team1;
            advanceTeam(data, groupKey, round, index, winner, loser, updateBracket);

            // Force update playoff brackets after any match completion
            setTimeout(() => {
                updatePlayoffBrackets(data, updateBracket);
            }, 0);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full mx-auto relative">
            {/* Upper Bracket */}
            <div className="flex flex-row gap-20 my-auto items-center bg-gray-500">
                <BracketRound
                    title="UPPER QUARTERFINALS (BO5)"
                    matches={data.upperQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', i, match)}
                />
                <div className="flex justify-center flex-grow">
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

            {/* Lower Bracket */}
            <div className="flex flex-row gap-20 my-auto items-center bg-gray-500">
                <BracketRound
                    title="LOWER QUARTERFINALS (BO5)"
                    matches={data.lowerQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                />
                <div className="flex-grow items-center justify-center">
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
        </div>
    );
}

/**
 * Represents a playoff match with best of 7 format
 * @param {Object} props
 * @param {string} props.team1 - First team name
 * @param {string} props.team2 - Second team name
 * @param {string} props.score1 - First team's score
 * @param {string} props.score2 - Second team's score
 * @param {Function} props.onScoreChange - Callback when score changes
 */
function PlayoffMatch({ team1, team2, score1 = '', score2 = '', onScoreChange }) {
    // Determine if either team has won (reached 4 points)
    const team1Won = parseInt(score1) === 4;
    const team2Won = parseInt(score2) === 4;

    // Calculate total score and check if it's valid
    const totalScore = (parseInt(score1) || 0) + (parseInt(score2) || 0);
    const isInvalidScore = totalScore > 7;

    // Base input styles
    const baseInputStyles = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 text-center w-10 text-white";

    // Dynamic background color based on win status
    const getInputStyles = (isWinner) => {
        return `${baseInputStyles} ${isWinner ? 'bg-success' : 'bg-gray-600'}`;
    };

    return (
        <div className="bg-gray-700 rounded p-2 text-center shadow-md space-y-1">
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-left w-full">{team1}</span>
                <input
                    type="number"
                    min="0"
                    max="4"
                    className={getInputStyles(team1Won)}
                    value={score1}
                    onChange={(e) => onScoreChange(0, e.target.value)}
                />
            </div>
            <div className="text-sm text-gray-400">vs</div>
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-left w-full">{team2}</span>
                <input
                    type="number"
                    min="0"
                    max="4"
                    className={getInputStyles(team2Won)}
                    value={score2}
                    onChange={(e) => onScoreChange(1, e.target.value)}
                />
            </div>
            {isInvalidScore && (
                <div className="text-red-500 text-sm mt-1">
                    Invalid score: Games are best of 7 (maximum 7 games total)
                </div>
            )}
        </div>
    );
}

/**
 * Represents a playoff round in the tournament bracket
 * @param {Object} props
 * @param {string} props.title - Round title
 * @param {Array} props.matches - Array of matches in this round
 * @param {Function} props.onMatchUpdate - Callback when a match is updated
 */
function PlayoffRound({ title, matches, onMatchUpdate }) {
    return (
        <div className="space-y-4 w-56 relative">
            <div className="bg-gray-800 text-white py-1 px-2 text-center">
                <h3 className="text-sm font-semibold mb-0">{title}</h3>
            </div>
            {matches.map((match, index) => (
                <PlayoffMatch
                    key={index}
                    team1={match[0]}
                    team2={match[1]}
                    score1={match[2]}
                    score2={match[3]}
                    onScoreChange={(teamIndex, newScore) => {
                        const newMatch = [...match];
                        newMatch[teamIndex + 2] = newScore;
                        onMatchUpdate(index, newMatch);
                    }}
                />
            ))}
        </div>
    );
}

// Helper to check if a playoff match is complete (BO7)
function isPlayoffMatchComplete(score1, score2) {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    return ((s1 === 4 || s2 === 4) && (s1 <= 4 && s2 <= 4));
}

// Helper to get winner
function getWinner(team1, team2, score1, score2) {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (s1 === 4) return team1;
    if (s2 === 4) return team2;
    return '';
}

// Helper to get loser
function getLoser(team1, team2, score1, score2) {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (s1 === 4) return team2;
    if (s2 === 4) return team1;
    return '';
}

function PlayoffBracket({ data, updateBracket }) {
    // Auto-advance logic for the described playoff structure
    React.useEffect(() => {
        // LOWER QUARTERFINALS: Winners from Lower Round 1 + Losers from Upper Quarterfinals
        const lowerR1 = data.lowerRound1;
        const upperQF = data.upperQuarterfinals;
        const lowerQF = data.lowerQuarterfinals;

        // Lower Round 1 winners
        const lr1w1 = lowerR1 && lowerR1[0] && isPlayoffMatchComplete(lowerR1[0][2], lowerR1[0][3]) ? getWinner(lowerR1[0][0], lowerR1[0][1], lowerR1[0][2], lowerR1[0][3]) : '';
        const lr1w2 = lowerR1 && lowerR1[1] && isPlayoffMatchComplete(lowerR1[1][2], lowerR1[1][3]) ? getWinner(lowerR1[1][0], lowerR1[1][1], lowerR1[1][2], lowerR1[1][3]) : '';

        // Upper QF losers
        const uqfl1 = upperQF && upperQF[0] && isPlayoffMatchComplete(upperQF[0][2], upperQF[0][3]) ? getLoser(upperQF[0][0], upperQF[0][1], upperQF[0][2], upperQF[0][3]) : '';
        const uqfl2 = upperQF && upperQF[1] && isPlayoffMatchComplete(upperQF[1][2], upperQF[1][3]) ? getLoser(upperQF[1][0], upperQF[1][1], upperQF[1][2], upperQF[1][3]) : '';

        // Fill Lower Quarterfinals when ready
        if (lr1w1 && uqfl1 && (lowerQF[0][0] !== lr1w1 || lowerQF[0][1] !== uqfl1)) {
            updateBracket('playoffs', 'lowerQuarterfinals', [
                [lr1w1, uqfl1],
                lowerQF[1]
            ]);
        }
        if (lr1w2 && uqfl2 && (lowerQF[1][0] !== lr1w2 || lowerQF[1][1] !== uqfl2)) {
            updateBracket('playoffs', 'lowerQuarterfinals', [
                lowerQF[0],
                [lr1w2, uqfl2]
            ]);
        }

        // SEMIFINALS (Top 4): Upper QF winners + Lower QF winners
        const uqfw1 = upperQF && upperQF[0] && isPlayoffMatchComplete(upperQF[0][2], upperQF[0][3]) ? getWinner(upperQF[0][0], upperQF[0][1], upperQF[0][2], upperQF[0][3]) : '';
        const uqfw2 = upperQF && upperQF[1] && isPlayoffMatchComplete(upperQF[1][2], upperQF[1][3]) ? getWinner(upperQF[1][0], upperQF[1][1], upperQF[1][2], upperQF[1][3]) : '';
        const lqfw1 = lowerQF && lowerQF[0] && isPlayoffMatchComplete(lowerQF[0][2], lowerQF[0][3]) ? getWinner(lowerQF[0][0], lowerQF[0][1], lowerQF[0][2], lowerQF[0][3]) : '';
        const lqfw2 = lowerQF && lowerQF[1] && isPlayoffMatchComplete(lowerQF[1][2], lowerQF[1][3]) ? getWinner(lowerQF[1][0], lowerQF[1][1], lowerQF[1][2], lowerQF[1][3]) : '';

        const semifinals = data.semifinals;
        if (uqfw1 && lqfw1 && (semifinals[0][0] !== uqfw1 || semifinals[0][1] !== lqfw1)) {
            updateBracket('playoffs', 'semifinals', [
                [uqfw1, lqfw1],
                semifinals[1]
            ]);
        }
        if (uqfw2 && lqfw2 && (semifinals[1][0] !== uqfw2 || semifinals[1][1] !== lqfw2)) {
            updateBracket('playoffs', 'semifinals', [
                semifinals[0],
                [uqfw2, lqfw2]
            ]);
        }

        // GRAND FINAL
        const sf = data.semifinals;
        const sfw1 = sf && sf[0] && isPlayoffMatchComplete(sf[0][2], sf[0][3]) ? getWinner(sf[0][0], sf[0][1], sf[0][2], sf[0][3]) : '';
        const sfw2 = sf && sf[1] && isPlayoffMatchComplete(sf[1][2], sf[1][3]) ? getWinner(sf[1][0], sf[1][1], sf[1][2], sf[1][3]) : '';
        const gf = data.grandFinal;
        if (sfw1 && sfw2 && (gf[0][0] !== sfw1 || gf[0][1] !== sfw2)) {
            updateBracket('playoffs', 'grandFinal', [[sfw1, sfw2]]);
        }

        // CHAMPION
        if (gf && gf[0]) {
            const champ = isPlayoffMatchComplete(gf[0][2], gf[0][3]) ? getWinner(gf[0][0], gf[0][1], gf[0][2], gf[0][3]) : '';
            if (champ && (!data.champion || !data.champion[0] || data.champion[0][0] !== champ)) {
                updateBracket('playoffs', 'champion', [[champ]]);
            }
        }
    }, [data, updateBracket]);

    function BracketColumn({ label, matches, onMatchUpdate }) {
        return (
            <div className="flex flex-col items-center min-w-[200px]">
                <div className="bg-gray-900 text-white font-bold px-4 py-2 mb-2 rounded text-center w-full text-xs uppercase tracking-wider">
                    {label}
                </div>
                <div className="flex flex-col gap-6 w-full">
                    {matches.map((match, idx) => (
                        <PlayoffMatch
                            key={idx}
                            team1={match[0]}
                            team2={match[1]}
                            score1={match[2]}
                            score2={match[3]}
                            onScoreChange={(teamIndex, newScore) => {
                                const newMatch = [...match];
                                newMatch[teamIndex + 2] = newScore;
                                onMatchUpdate(idx, newMatch);
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full justify-center items-center gap-8">
            {/* Lower Round 1 - far left */}
            <BracketColumn
                label="LOWER ROUND 1 (BO7)"
                matches={data.lowerRound1}
                onMatchUpdate={(i, match) => updateBracket('playoffs', 'lowerRound1', data.lowerRound1.map((m, idx) => idx === i ? match : m))}
            />
            {/* Quarterfinals: upper on top, lower below */}
            <div className="flex flex-col justify-center items-center gap-16">
                <BracketColumn
                    label="UPPER QUARTERFINALS (BO7)"
                    matches={data.upperQuarterfinals}
                    onMatchUpdate={(i, match) => updateBracket('playoffs', 'upperQuarterfinals', data.upperQuarterfinals.map((m, idx) => idx === i ? match : m))}
                />
                <BracketColumn
                    label="LOWER QUARTERFINALS (BO7)"
                    matches={data.lowerQuarterfinals}
                    onMatchUpdate={(i, match) => updateBracket('playoffs', 'lowerQuarterfinals', data.lowerQuarterfinals.map((m, idx) => idx === i ? match : m))}
                />
            </div>
            {/* Semifinals, Grand Final, Champion - each in their own column */}
            <div className="flex flex-row gap-8 items-center">
                <BracketColumn
                    label="SEMIFINALS (TOP 4, BO7)"
                    matches={data.semifinals}
                    onMatchUpdate={(i, match) => updateBracket('playoffs', 'semifinals', data.semifinals.map((m, idx) => idx === i ? match : m))}
                />
                <BracketColumn
                    label="GRAND FINAL (BO7)"
                    matches={data.grandFinal}
                    onMatchUpdate={(i, match) => updateBracket('playoffs', 'grandFinal', data.grandFinal.map((m, idx) => idx === i ? match : m))}
                />
                <div className="flex flex-col items-center justify-center min-w-[200px]">
                    <div className="bg-gray-900 text-white font-bold px-4 py-2 mb-2 rounded text-center w-full text-xs uppercase tracking-wider">
                        CHAMPION
                    </div>
                    {data.champion && data.champion[0] && (
                        <div className="bg-yellow-400 text-black font-bold text-2xl px-8 py-4 rounded shadow-lg mt-2 w-full text-center">
                            {data.champion[0][0]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getStandingsFromBracket(bracketData) {
    // Helper to get unique, non-empty team names
    const uniq = (arr) => [...new Set(arr.filter(Boolean))];
    const allTeams = uniq([
        ...bracketData.groupA.upperQuarterfinals.flat().filter(Boolean),
        ...bracketData.groupB.upperQuarterfinals.flat().filter(Boolean),
    ]);

    // 1st and 2nd
    const champion = bracketData.playoffs.champion?.[0]?.[0] || '';
    const grandFinal = bracketData.playoffs.grandFinal?.[0] || [];
    const second = grandFinal.find((t) => t && t !== champion) || '';

    // 3rd-4th: losers of semifinals
    const semiLosers = bracketData.playoffs.semifinals
        ? bracketData.playoffs.semifinals
            .map((match) => {
                if (!match[0] || !match[1]) return null;
                const s1 = parseInt(match[2]);
                const s2 = parseInt(match[3]);
                if (s1 === 4) return match[1];
                if (s2 === 4) return match[0];
                return null;
            })
            .filter(Boolean)
        : [];

    // 5th-6th: losers of lower quarterfinals
    const lowerQFLosers = bracketData.playoffs.lowerQuarterfinals
        ? bracketData.playoffs.lowerQuarterfinals
            .map((match) => {
                if (!match[0] || !match[1]) return null;
                const s1 = parseInt(match[2]);
                const s2 = parseInt(match[3]);
                if (s1 === 4) return match[1];
                if (s2 === 4) return match[0];
                return null;
            })
            .filter(Boolean)
        : [];

    // 7th-8th: losers of lower round 1
    const lowerR1Losers = bracketData.playoffs.lowerRound1
        ? bracketData.playoffs.lowerRound1
            .map((match) => {
                if (!match[0] || !match[1]) return null;
                const s1 = parseInt(match[2]);
                const s2 = parseInt(match[3]);
                if (s1 === 4) return match[1];
                if (s2 === 4) return match[0];
                return null;
            })
            .filter(Boolean)
        : [];

    // 9th-16th: teams not in playoffs (from group stage)
    const playoffTeams = uniq([
        ...(bracketData.playoffs.lowerRound1?.flat() || []),
        ...(bracketData.playoffs.upperQuarterfinals?.flat() || []),
    ]);
    const nonPlayoffTeams = allTeams.filter(
        (team) => !playoffTeams.includes(team)
    );

    return [
        { place: '1ST', points: 18, teams: champion ? [champion] : [] },
        { place: '2ND', points: 12, teams: second ? [second] : [] },
        { place: '3RD-4TH', points: 8, teams: uniq(semiLosers) },
        { place: '5TH-6TH', points: 6, teams: uniq(lowerQFLosers) },
        { place: '7TH-8TH', points: 4, teams: uniq(lowerR1Losers) },
        { place: '9TH-16TH', points: 1, teams: uniq(nonPlayoffTeams) },
    ];
}

/**
 * TournamentBracket component
 *
 * Props:
 *   - bracketData: {
 *       groupA: { ... },
 *       groupB: { ... },
 *       playoffs: { ... }
 *     }
 *   - updateBracket: (group, round, matches) => void
 *
 * This component is now reusable for any bracketData shape matching the above.
 */
export default function TournamentBracket({ bracketData, updateBracket }) {
    const standings = getStandingsFromBracket(bracketData);
    const championDetermined = Boolean(bracketData.playoffs.champion?.[0]?.[0]);

    return (
        <div className="p-8 bg-gray-800 text-white">
            <h1 className="text-3xl font-bold text-center mb-10">RLCS Bracket Predictions</h1>

            {/* Group Stage */}
            <div className="flex flex-row justify-center gap-16 mb-16">
                {/* Group A Bracket */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-center mb-6">GROUP A</h2>
                    <div className="flex flex-row justify-center">
                        <BracketGrid
                            groupKey="groupA"
                            data={bracketData.groupA}
                            updateBracket={updateBracket}
                        />
                    </div>
                </div>

                {/* Group B Bracket */}
                <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-semibold text-center mb-6">GROUP B</h2>
                    <div className="flex flex-row justify-center">
                        <BracketGrid
                            groupKey="groupB"
                            data={bracketData.groupB}
                            updateBracket={updateBracket}
                        />
                    </div>
                </div>
            </div>

            {/* Playoff Stage and Standings Table side by side */}
            <div className="flex flex-row justify-center items-start gap-16 mt-16">
                <div className="flex-1">
                    <PlayoffBracket data={bracketData.playoffs} updateBracket={updateBracket} />
                </div>
                <div className="flex-shrink-0">
                    {championDetermined && <StandingsTable standings={standings} />}
                </div>
            </div>
        </div>
    );
}