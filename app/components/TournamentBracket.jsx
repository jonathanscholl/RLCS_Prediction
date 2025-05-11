'use client';
import React, { useState } from 'react';
import StandingsTable from './StandingsTable';
import Image from "next/image";


/**
 * Unified match display component that handles both BO5 and BO7 formats
 * @param {Object} props
 * @param {string} props.team1 - First team name
 * @param {string} props.team2 - Second team name
 * @param {string} props.team1Logo - First team's logo
 * @param {string} props.team2Logo - Second team's logo
 * @param {string} props.score1 - First team's score
 * @param {string} props.score2 - Second team's score
 * @param {Function} props.onScoreChange - Callback when score changes
 * @param {number} props.maxScore - Maximum score to win (3 for BO5, 4 for BO7)
 */
function MatchDisplay({ team1, team2, team1Logo, team2Logo, score1 = '', score2 = '', onScoreChange, maxScore = 3 }) {
    const team1Score = parseInt(score1);
    const team2Score = parseInt(score2);
    const team1Won = team1Score === maxScore;
    const team2Won = team2Score === maxScore;
    const matchComplete = (team1Won || team2Won) && (team1Score <= maxScore && team2Score <= maxScore);
    const placeholderLogo = 'https://kclzskvpikbsdoufynvo.supabase.co/storage/v1/object/public/logos/Placeholder.png';
    const baseInputStyles = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-white text-center w-15 h-15 text-black bg-white";
    const getScoreBoxStyles = (isWinner) => `${baseInputStyles} ${isWinner ? 'bg-success' : 'bg-gray-600'}`;
    const teamLost = (won) => matchComplete && !won;
    const team1Bg = '#2b95c6';
    const team2Bg = '#d4500b';

    return (
        <div className="space-y-2">
            {/* Team 1 Row */}
            <div className={`flex flex-row items-center space-x-2 w-[360px] transition-all duration-300 ${teamLost(team1Won) ? 'opacity-60 grayscale' : ''}`}>
                <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <img
                        src={team1Logo || placeholderLogo}
                        alt="Team 1 logo"
                        className={`w-12 h-12 object-contain transition-all ${teamLost(team1Won) ? 'opacity-50 scale-90' : ''}`}
                    />
                </div>
                <div className={`flex items-center rounded w-60 h-16 px-2 relative transition-colors`} style={{ background: team1Bg }}>
                    <span className={` text-white text-xl flex items-center`}>
                        {team1}
                    </span>
                    {teamLost(team1Won) && <div className="absolute inset-0 bg-opacity-30 rounded" />}
                </div>
                <input
                    type="number"
                    min="0"
                    max={maxScore}
                    className={`w-16 h-16 text-center text-2xl ${getScoreBoxStyles(team1Won)}`}
                    value={score1}
                    onChange={(e) => onScoreChange(0, e.target.value)}
                />
            </div>

            {/* Team 2 Row */}
            <div className={`flex flex-row items-center space-x-2 w-[360px] transition-all duration-300 ${teamLost(team2Won) ? 'opacity-60 grayscale' : ''}`}>
                <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <img
                        src={team2Logo || placeholderLogo}
                        alt="Team 2 logo"
                        className={`w-12 h-12 object-contain transition-all ${teamLost(team2Won) ? 'opacity-50 scale-90' : ''}`}
                    />
                </div>
                <div className={`flex items-center rounded w-60 h-16 px-2 relative transition-colors`} style={{ background: team2Bg }}>
                    <span className={` text-white text-xl flex items-center`}>
                        {team2}
                    </span>
                    {teamLost(team2Won) && <div className="absolute inset-0 bg-opacity-30 rounded" />}
                </div>
                <input
                    type="number"
                    min="0"
                    max={maxScore}
                    className={`w-16 h-16 text-center text-2xl ${getScoreBoxStyles(team2Won)}`}
                    value={score2}
                    onChange={(e) => onScoreChange(1, e.target.value)}
                />
            </div>

            {/* Validation Message */}
            {(team1Score + team2Score > maxScore * 2 - 1) && (
                <div className="text-red-500 text-sm mt-1">
                    Invalid score: Games are best of {maxScore * 2 - 1} (maximum {maxScore * 2 - 1} games total)
                </div>
            )}
        </div>
    );
}

/**
 * Represents a match in the tournament bracket (both group stage and playoffs)
 * @param {Object} props
 * @param {string} props.team1 - First team name
 * @param {string} props.team2 - Second team name
 * @param {string} props.team1Logo - First team's logo
 * @param {string} props.team2Logo - Second team's logo
 * @param {string} props.score1 - First team's score
 * @param {string} props.score2 - Second team's score
 * @param {Function} props.onScoreChange - Callback when score changes
 * @param {boolean} props.isPlayoff - Whether this is a playoff match (BO7) or group stage match (BO5)
 */
function Match({ team1, team2, team1Logo, team2Logo, score1 = '', score2 = '', onScoreChange, isPlayoff = false }) {
    return (
        <MatchDisplay
            team1={team1}
            team2={team2}
            team1Logo={team1Logo}
            team2Logo={team2Logo}
            score1={score1}
            score2={score2}
            onScoreChange={onScoreChange}
            maxScore={isPlayoff ? 4 : 3}
        />
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
        <div className="space-y-4">
            <div className="bg-gray-900 text-white py-1 px-2 text-center">
                <h3 className="text-sm font-semibold mb-0">{title}</h3>
            </div>
            {matches.map((match, index) => (
                <Match
                    key={index}
                    team1={match[0]}
                    team2={match[1]}
                    team1Logo={match[2]}
                    team2Logo={match[3]}
                    score1={match[4]}
                    score2={match[5]}
                    onScoreChange={(teamIndex, newScore) => {
                        const newMatch = [...match];
                        newMatch[teamIndex + 4] = newScore;
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
function advanceTeam(data, groupKey, round, index, winner, loser, winnerLogo, loserLogo, updateBracket) {
    const advance = (targetRound, matchIndex, team, teamLogo, position) => {
        const newRound = [...(data[targetRound] || [])];
        newRound[matchIndex] = newRound[matchIndex] || ['', '', '', '', '', ''];
        newRound[matchIndex][position] = team;
        newRound[matchIndex][position + 2] = teamLogo;
        updateBracket(groupKey, targetRound, newRound);
    };

    // Handle team advancement based on the current round
    switch (round) {
        case 'upperQuarterfinals':
            advance('upperSemifinals', Math.floor(index / 2), winner, winnerLogo, index % 2);
            advance('lowerQuarterfinals', Math.floor(index / 2), loser, loserLogo, index % 2);
            break;
        case 'upperSemifinals':
            advance('qualified', 0, winner, winnerLogo, index % 2);
            advance('lowerSemifinals', index === 0 ? 1 : 0, loser, loserLogo, 0);
            break;
        case 'qualified':
            // When a team qualifies, check and update playoff brackets
            updatePlayoffBrackets(data, updateBracket);
            break;
        case 'lowerQuarterfinals':
            advance('lowerSemifinals', index, winner, winnerLogo, 1);
            break;
        case 'lowerSemifinals':
            advance('lowerFinal', 0, winner, winnerLogo, index);
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

        const [team1, team2, logo1, logo2, score1, score2] = newMatch;

        const s1 = parseInt(score1);
        const s2 = parseInt(score2);


        // Check if match is complete (best of 5)
        if ((s1 === 3 || s2 === 3) && (s1 <= 3 && s2 <= 3)) {
            const winner = s1 === 3 ? team1 : team2;
            const loser = s1 === 3 ? team2 : team1;
            const winnerLogo = s1 === 3 ? logo1 : logo2;
            const loserLogo = s1 === 3 ? logo2 : logo1;
            advanceTeam(
                data,
                groupKey,
                round,
                index,
                winner,
                loser,
                winnerLogo,
                loserLogo,
                updateBracket
            );

            // Force update playoff brackets after any match completion
            setTimeout(() => {
                // Get the complete bracket data by looking at the parent component's props
                const completeData = {
                    groupA: groupKey === 'groupA' ? data : window.bracketData?.groupA,
                    groupB: groupKey === 'groupB' ? data : window.bracketData?.groupB,
                    playoffs: window.bracketData?.playoffs
                };
                updatePlayoffBrackets(completeData, updateBracket);
            }, 0);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Upper Bracket */}
            <div className="flex flex-row my-auto items-center">
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
            <div className="flex flex-row my-20 items-center">
                <BracketRound
                    title="LOWER QUARTERFINALS (BO5)"
                    matches={data.lowerQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                />
                <div className="flex justify-center flex-grow">
                    <BracketRound
                        title="LOWER SEMIFINALS (BO5)"
                        matches={data.lowerSemifinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerSemifinals', i, match)}
                    />
                </div>
                <div className="flex justify-center">
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
                <Match
                    key={index}
                    team1={match[0]}
                    team2={match[1]}
                    team1Logo={match[2]}
                    team2Logo={match[3]}
                    score1={match[4]}
                    score2={match[5]}
                    onScoreChange={(teamIndex, newScore) => {
                        const newMatch = [...match];
                        newMatch[teamIndex + 4] = newScore;
                        onMatchUpdate(index, newMatch);
                    }}
                    isPlayoff={true}
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

function BracketColumn({ label, matches, onMatchUpdate }) {
    return (
        <div className="flex flex-col items-center min-w-[200px]">
            <div className="bg-gray-900 text-white font-bold px-4 py-2 mb-2 rounded text-center w-full text-xs uppercase tracking-wider">
                {label}
            </div>
            <div className="flex flex-col gap-6 w-full">
                {matches.map((match, idx) => (
                    <Match
                        key={idx}
                        team1={match[0]}
                        team2={match[1]}
                        team1Logo={match[2]}
                        team2Logo={match[3]}
                        score1={match[4]}
                        score2={match[5]}
                        onScoreChange={(teamIndex, newScore) => {
                            const newMatch = [...match];
                            newMatch[teamIndex + 4] = newScore;
                            onMatchUpdate(idx, newMatch);
                        }}
                        isPlayoff={true}
                    />
                ))}
            </div>
        </div>
    );
}

function PlayoffBracket({ data, updateBracket }) {
    // Auto-advance logic for the described playoff structure
    React.useEffect(() => {
        // LOWER QUARTERFINALS: Winners from Lower Round 1 + Losers from Upper Quarterfinals
        const lowerR1 = data.lowerRound1;
        const upperQF = data.upperQuarterfinals;
        const lowerQF = data.lowerQuarterfinals;

        // Lower Round 1 winners
        const lr1w1 = lowerR1 && lowerR1[0] && isPlayoffMatchComplete(lowerR1[0][4], lowerR1[0][5]) ? getWinner(lowerR1[0][0], lowerR1[0][1], lowerR1[0][4], lowerR1[0][5]) : '';
        const lr1w2 = lowerR1 && lowerR1[1] && isPlayoffMatchComplete(lowerR1[1][4], lowerR1[1][5]) ? getWinner(lowerR1[1][0], lowerR1[1][1], lowerR1[1][4], lowerR1[1][5]) : '';

        // Upper QF losers
        const uqfl1 = upperQF && upperQF[0] && isPlayoffMatchComplete(upperQF[0][4], upperQF[0][5]) ? getLoser(upperQF[0][0], upperQF[0][1], upperQF[0][4], upperQF[0][5]) : '';
        const uqfl2 = upperQF && upperQF[1] && isPlayoffMatchComplete(upperQF[1][4], upperQF[1][5]) ? getLoser(upperQF[1][0], upperQF[1][1], upperQF[1][4], upperQF[1][5]) : '';

        // Fill Lower Quarterfinals when ready
        if (lr1w1 && uqfl1 && (lowerQF[0][0] !== lr1w1 || lowerQF[0][1] !== uqfl1)) {
            updateBracket('playoffs', 'lowerQuarterfinals', [
                [lr1w1, uqfl1, lowerR1[0][2], upperQF[0][3], '', ''],
                lowerQF[1]
            ]);
        }
        if (lr1w2 && uqfl2 && (lowerQF[1][0] !== lr1w2 || lowerQF[1][1] !== uqfl2)) {
            updateBracket('playoffs', 'lowerQuarterfinals', [
                lowerQF[0],
                [lr1w2, uqfl2, lowerR1[1][2], upperQF[1][3], '', '']
            ]);
        }

        // SEMIFINALS (Top 4): Upper QF winners + Lower QF winners
        const uqfw1 = upperQF && upperQF[0] && isPlayoffMatchComplete(upperQF[0][4], upperQF[0][5]) ? getWinner(upperQF[0][0], upperQF[0][1], upperQF[0][4], upperQF[0][5]) : '';
        const uqfw2 = upperQF && upperQF[1] && isPlayoffMatchComplete(upperQF[1][4], upperQF[1][5]) ? getWinner(upperQF[1][0], upperQF[1][1], upperQF[1][4], upperQF[1][5]) : '';
        const lqfw1 = lowerQF && lowerQF[0] && isPlayoffMatchComplete(lowerQF[0][4], lowerQF[0][5]) ? getWinner(lowerQF[0][0], lowerQF[0][1], lowerQF[0][4], lowerQF[0][5]) : '';
        const lqfw2 = lowerQF && lowerQF[1] && isPlayoffMatchComplete(lowerQF[1][4], lowerQF[1][5]) ? getWinner(lowerQF[1][0], lowerQF[1][1], lowerQF[1][4], lowerQF[1][5]) : '';

        const semifinals = data.semifinals;
        if (uqfw1 && lqfw1 && (semifinals[0][0] !== uqfw1 || semifinals[0][1] !== lqfw1)) {
            updateBracket('playoffs', 'semifinals', [
                [uqfw1, lqfw1, upperQF[0][2], lowerQF[0][2], '', ''],
                semifinals[1]
            ]);
        }
        if (uqfw2 && lqfw2 && (semifinals[1][0] !== uqfw2 || semifinals[1][1] !== lqfw2)) {
            updateBracket('playoffs', 'semifinals', [
                semifinals[0],
                [uqfw2, lqfw2, upperQF[1][2], lowerQF[1][2], '', '']
            ]);
        }

        // GRAND FINAL
        const sf = data.semifinals;
        const sfw1 = sf && sf[0] && isPlayoffMatchComplete(sf[0][4], sf[0][5]) ? getWinner(sf[0][0], sf[0][1], sf[0][4], sf[0][5]) : '';
        const sfw2 = sf && sf[1] && isPlayoffMatchComplete(sf[1][4], sf[1][5]) ? getWinner(sf[1][0], sf[1][1], sf[1][4], sf[1][5]) : '';
        const gf = data.grandFinal;
        if (sfw1 && sfw2 && (gf[0][0] !== sfw1 || gf[0][1] !== sfw2)) {
            updateBracket('playoffs', 'grandFinal', [[sfw1, sfw2, sf[0][2], sf[1][2], '', '']]);
        }

        // CHAMPION
        if (gf && gf[0]) {
            const champ = isPlayoffMatchComplete(gf[0][4], gf[0][5]) ? getWinner(gf[0][0], gf[0][1], gf[0][4], gf[0][5]) : '';
            if (champ && (!data.champion || !data.champion[0] || data.champion[0][0] !== champ)) {
                updateBracket('playoffs', 'champion', [[champ]]);
            }
        }
    }, [data, updateBracket]);

    return (
        <div className="flex flex-row w-full justify-center items-center gap-12">
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
            <div className="flex flex-row gap-12 items-center">
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
                    {data.champion && data.champion[0] && data.champion[0][0] && (
                        <>
                            <div className="bg-gray-900 text-white font-bold px-4 py-2 mb-2 rounded text-center w-full text-xs uppercase tracking-wider">
                                CHAMPION
                            </div>
                            <div className="bg-yellow-400 text-black font-bold text-2xl px-8 py-4 rounded shadow-lg mt-2 w-full text-center">
                                {data.champion[0][0]}
                            </div>
                        </>
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
    const [activeView, setActiveView] = useState('overview'); // 'overview', 'groupA', 'groupB', 'playoffs'

    // Store the complete bracket data in window for access by child components
    React.useEffect(() => {
        window.bracketData = bracketData;
        console.log(bracketData)
    }, [bracketData]);

    const renderGroupA = () => (
        <div className="flex flex-col mx-10">
            <h2 className="text-xl font-semibold text-center mb-6">GROUP A</h2>
            <div className="flex flex-row justify-center">
                <BracketGrid
                    groupKey="groupA"
                    data={bracketData.groupA}
                    updateBracket={updateBracket}
                />
            </div>
        </div>
    );

    const renderGroupB = () => (
        <div className="flex flex-col mx-10">
            <h2 className="text-xl font-semibold text-center mb-6">GROUP B</h2>
            <div className="flex flex-row justify-center">
                <BracketGrid
                    groupKey="groupB"
                    data={bracketData.groupB}
                    updateBracket={updateBracket}
                />
            </div>
        </div>
    );

    const renderPlayoffs = () => (
        <div className="flex-1">
            <PlayoffBracket data={bracketData.playoffs} updateBracket={updateBracket} />
        </div>
    );

    const renderOverview = () => (
        <>
            {/* Group Stage */}

            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-center flex-1">RLCS Bracket Predictions</h1>

            </div>
            <div className="flex flex-row justify-center gap-16 mb-16">


                {/* Group A Bracket */}

                <h2 className="text-xl font-semibold text-center mb-6">

                    <button
                        onClick={() => setActiveView('groupA')}
                        className="px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        Group A
                    </button>

                </h2>

                <h2 className="text-xl font-semibold text-center mb-6">

                    <button
                        onClick={() => setActiveView('groupB')}
                        className="px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        Group B
                    </button>

                </h2>

                <h2 className="text-xl font-semibold text-center mb-6">

                    <button
                        onClick={() => setActiveView('playoffs')}
                        className="px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        Playoffs
                    </button>

                </h2>
            </div>
        </>
    );

    return (
        <div className="relative">


            <div className="relative p-8 text-white">

                {activeView !== 'overview' && (
                    <button
                        onClick={() => setActiveView('overview')}
                        className="px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        Back to Overview
                    </button>
                )}

                {activeView === 'overview' && renderOverview()}
                {activeView === 'groupA' && renderGroupA()}
                {activeView === 'groupB' && renderGroupB()}
                {activeView === 'playoffs' && renderPlayoffs()}

            </div>
        </div>
    );
}