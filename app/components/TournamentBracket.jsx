'use client';
import React, { useState, useEffect } from 'react';
import StandingsTable from './StandingsTable';
import Image from "next/image";
import Confetti from 'react-confetti';
import { supabase } from '@/app/utils/supabaseClient';


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
 * @param {boolean} props.readOnly - Whether the component is read-only
 * @param {boolean} props.hideInputs - Whether to hide the input fields
 */
function MatchDisplay({ team1, team2, team1Logo, team2Logo, score1 = '', score2 = '', onScoreChange, maxScore = 3, readOnly = false, hideInputs = false }) {
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

    // Check if both teams are present and not placeholder text
    const isPlaceholder = (team) => {
        if (!team) return true;
        const placeholderPatterns = [
            /^Winner of .*/i,
            /^Loser of .*/i,
            /^TBD$/i,
            /^$/
        ];
        return placeholderPatterns.some(pattern => pattern.test(team));
    };

    const bothTeamsPresent = team1 && team2 && !isPlaceholder(team1) && !isPlaceholder(team2);
    const canInputScores = bothTeamsPresent && !readOnly;

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
                    <span className={`text-white text-xl flex items-center`}>
                        {team1 || 'TBD'}
                    </span>
                    {teamLost(team1Won) && <div className="absolute inset-0 bg-opacity-30 rounded" />}
                </div>
                <input
                    type="number"
                    min="0"
                    max={maxScore}
                    className={`w-16 h-16 text-center text-2xl ${getScoreBoxStyles(team1Won)} ${!canInputScores ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={score1}
                    onChange={(e) => canInputScores && onScoreChange(0, e.target.value)}
                    readOnly={!canInputScores}
                    onWheel={(e) => e.target.blur()}
                    style={hideInputs ? { display: 'none' } : {}}
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
                    <span className={`text-white text-xl flex items-center`}>
                        {team2 || 'TBD'}
                    </span>
                    {teamLost(team2Won) && <div className="absolute inset-0 bg-opacity-30 rounded" />}
                </div>
                <input
                    type="number"
                    min="0"
                    max={maxScore}
                    className={`w-16 h-16 text-center text-2xl ${getScoreBoxStyles(team2Won)} ${!canInputScores ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={score2}
                    onChange={(e) => canInputScores && onScoreChange(1, e.target.value)}
                    readOnly={!canInputScores}
                    onWheel={(e) => e.target.blur()}
                    style={hideInputs ? { display: 'none' } : {}}
                />
            </div>

            {/* Validation Message */}
            {(team1Score + team2Score > maxScore * 2 - 1) && (
                <div className="text-red-500 text-sm mt-1">
                    Invalid score: Games are best of {maxScore * 2 - 1} (maximum {maxScore * 2 - 1} games total)
                </div>
            )}
            {!bothTeamsPresent && (
                <div className="text-yellow-500 text-sm mt-1">
                    {isPlaceholder(team1) || isPlaceholder(team2)
                        ? 'Waiting for teams to advance from previous round'
                        : 'Both teams must be present to input scores'}
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
 * @param {boolean} props.readOnly - Whether the component is read-only
 * @param {boolean} props.hideInputs - Whether to hide the input fields
 */
function Match({ team1, team2, team1Logo, team2Logo, score1 = '', score2 = '', onScoreChange, isPlayoff = false, readOnly = false, hideInputs = false }) {
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
            readOnly={readOnly}
            hideInputs={hideInputs}
        />
    );
}

/**
 * Represents a round in the tournament bracket (e.g., Quarterfinals, Semifinals)
 * @param {Object} props
 * @param {string} props.title - Round title
 * @param {Array} props.matches - Array of matches in this round
 * @param {Function} props.onMatchUpdate - Callback when a match is updated
 * @param {boolean} props.readOnly - Whether the component is read-only
 * @param {boolean} props.adminMode - Whether the component is in admin mode
 * @param {boolean} props.hideInputs - Whether to hide the input fields
 */
function BracketRound({ title, matches, onMatchUpdate, readOnly = false, adminMode = false, hideInputs = false }) {
    // Determine if this is the QUALIFIED round (case-insensitive)
    const isQualifiedRound = title.trim().toLowerCase() === 'qualified';
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
                    readOnly={readOnly || isQualifiedRound}
                    adminMode={adminMode}
                    hideInputs={hideInputs}
                />
            ))}
        </div>
    );
}

/**
 * Handles the logic for advancing teams through the bracket
 * @param {Object} data - Current bracket data
 * @param {string} groupKey - Group identifier (A, B, or playoffs)
 * @param {string} round - Current round
 * @param {number} index - Match index
 * @param {string} winner - Winning team
 * @param {string} loser - Losing team
 * @param {string} winnerLogo - Winning team's logo
 * @param {string} loserLogo - Losing team's logo
 * @param {Function} updateBracket - Function to update bracket data
 * @param {boolean} isPlayoff - Whether this is a playoff match
 */
function advanceTeam(data, groupKey, round, index, winner, loser, winnerLogo, loserLogo, updateBracket, isPlayoff = false) {
    const advance = (targetRound, matchIndex, team, teamLogo, position) => {
        const newRound = [...(data[targetRound] || [])];
        newRound[matchIndex] = newRound[matchIndex] || ['', '', '', '', '', ''];
        newRound[matchIndex][position] = team;
        newRound[matchIndex][position + 2] = teamLogo;
        updateBracket(groupKey, targetRound, newRound);
    };

    if (isPlayoff) {
        // Handle playoff advancement
        switch (round) {
            case 'lowerRound1':
                // Lower round 1 winners go to lower quarterfinals
                // First winner goes to first match, second winner goes to second match
                advance('lowerQuarterfinals', index, winner, winnerLogo, 0);
                break;
            case 'upperQuarterfinals':
                // Upper quarterfinals winners go to semifinals
                // First winner goes to first semifinal, second winner goes to second semifinal
                advance('semifinals', index, winner, winnerLogo, 0);
                // Upper quarterfinals losers go to lower quarterfinals
                // First loser goes to second match, second loser goes to first match
                advance('lowerQuarterfinals', index === 0 ? 1 : 0, loser, loserLogo, 1);
                break;
            case 'lowerQuarterfinals':
                // Lower quarterfinals winners go to semifinals
                // First winner goes to first semifinal, second winner goes to second semifinal
                advance('semifinals', index, winner, winnerLogo, 1);
                break;
            case 'semifinals':
                advance('grandFinal', 0, winner, winnerLogo, index);
                break;
            case 'grandFinal':
                if (winner) {
                    updateBracket('playoffs', 'champion', [[winner]]);
                }
                break;
        }
    } else {
        // Handle group stage advancement
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
                // When a team qualifies, update playoff brackets
                const groupAQualified = data.groupA?.qualified?.[0] || [];
                const groupBQualified = data.groupB?.qualified?.[0] || [];
                if (groupAQualified[0] && groupAQualified[1] && groupBQualified[0] && groupBQualified[1]) {
                    updateBracket('playoffs', 'upperQuarterfinals', [
                        [groupAQualified[0], groupBQualified[1], groupAQualified[2], groupBQualified[3], '', ''],
                        [groupAQualified[1], groupBQualified[0], groupAQualified[3], groupBQualified[2], '', '']
                    ]);
                }
                break;
            case 'lowerQuarterfinals':
                advance('lowerSemifinals', index, winner, winnerLogo, 1);
                break;
            case 'lowerSemifinals':
                advance('lowerFinal', 0, winner, winnerLogo, index);
                break;
            case 'lowerFinal':
                // When a team wins the lower final, update playoff brackets
                const groupALowerFinal = data.groupA?.lowerFinal?.[0] || [];
                const groupBLowerFinal = data.groupB?.lowerFinal?.[0] || [];
                if (groupALowerFinal[0] && groupALowerFinal[1] && groupBLowerFinal[0] && groupBLowerFinal[1]) {
                    updateBracket('playoffs', 'lowerRound1', [
                        [groupALowerFinal[0], groupBLowerFinal[1], groupALowerFinal[2], groupBLowerFinal[3], '', ''],
                        [groupBLowerFinal[0], groupALowerFinal[1], groupBLowerFinal[2], groupALowerFinal[3], '', '']
                    ]);
                }
                break;
        }
    }
}

/**
 * Represents a complete bracket grid for a group
 * @param {Object} props
 * @param {string} props.groupKey - Group identifier (A or B)
 * @param {Object} props.data - Bracket data for this group
 * @param {Function} props.updateBracket - Function to update bracket data
 * @param {boolean} props.readOnly - Whether the component is read-only
 * @param {boolean} props.adminMode - Whether the component is in admin mode
 */
function BracketGrid({ groupKey, data, updateBracket, readOnly = false, adminMode = false }) {
    const handleMatchUpdate = (round, index, newMatch) => {
        const updated = [...data[round]];
        updated[index] = newMatch;
        updateBracket(groupKey, round, updated);

        const [team1, team2, logo1, logo2, score1, score2] = newMatch;
        const s1 = parseInt(score1);
        const s2 = parseInt(score2);

        // Helper to check if a team is a placeholder
        const isPlaceholder = (team) => {
            if (!team) return true;
            const placeholderPatterns = [
                /^Winner of .*/i,
                /^Loser of .*/i,
                /^TBD$/i,
                /^$/
            ];
            return placeholderPatterns.some(pattern => pattern.test(team));
        };

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
                updateBracket,
                false
            );
        }

        // For qualified and lowerFinal rounds, advance teams if both are set and not placeholders
        if ((round === 'qualified' || round === 'lowerFinal') && team1 && team2 && !isPlaceholder(team1) && !isPlaceholder(team2)) {
            // For these rounds, both teams are considered 'winners' for playoff seeding
            // We call advanceTeam for each team
            advanceTeam(
                data,
                groupKey,
                round,
                index,
                team1,
                team2,
                logo1,
                logo2,
                updateBracket,
                false
            );
            advanceTeam(
                data,
                groupKey,
                round,
                index,
                team2,
                team1,
                logo2,
                logo1,
                updateBracket,
                false
            );
        }
    };

    return (
        <div className="flex flex-col gap-10 w-full">
            {/* Upper Bracket */}
            <div className="flex flex-row my-auto items-start relative justify-center mx-auto" style={{ minHeight: 520, width: 'fit-content' }}>
                {/* All quarterfinals stacked vertically */}
                <div className="flex flex-col gap-10 z-10">
                    <BracketRound
                        title="UPPER QUARTERFINALS (BO5)"
                        matches={[data.upperQuarterfinals[0]]}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', 0, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                    <BracketRound
                        title="UPPER QUARTERFINALS (BO5)"
                        matches={[data.upperQuarterfinals[1]]}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', 1, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                    <BracketRound
                        title="UPPER QUARTERFINALS (BO5)"
                        matches={[data.upperQuarterfinals[2]]}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', 2, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                    <BracketRound
                        title="UPPER QUARTERFINALS (BO5)"
                        matches={[data.upperQuarterfinals[3]]}
                        onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', 3, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                </div>

                {/* Semifinals column, absolutely positioned and vertically centered between QFs */}
                <div className="flex flex-col ml-24 w-[260px] relative" style={{ minHeight: 520 }}>
                    <div style={{ position: 'absolute', top: '100px', left: 0, right: 0 }}>
                        <BracketRound
                            title="UPPER SEMIFINALS (BO5)"
                            matches={[data.upperSemifinals[0]]}
                            onMatchUpdate={(i, match) => handleMatchUpdate('upperSemifinals', 0, match)}
                            readOnly={readOnly}
                            adminMode={adminMode}
                        />
                    </div>
                    <div style={{ position: 'absolute', top: '500px', left: 0, right: 0 }}>
                        <BracketRound
                            title="UPPER SEMIFINALS (BO5)"
                            matches={[data.upperSemifinals[1]]}
                            onMatchUpdate={(i, match) => handleMatchUpdate('upperSemifinals', 1, match)}
                            readOnly={readOnly}
                            adminMode={adminMode}
                        />
                    </div>
                </div>

                {/* Qualified section, vertically centered between the two semifinals */}
                <div className="flex flex-col justify-center ml-50" style={{ minHeight: 520 }}>
                    <div style={{ marginTop: '300px' }}>
                        <BracketRound
                            title="QUALIFIED"
                            matches={data.qualified}
                            onMatchUpdate={(i, match) => handleMatchUpdate('qualified', i, match)}
                            readOnly={readOnly}
                            adminMode={adminMode}
                            hideInputs={true}
                        />
                    </div>
                </div>
            </div>

            {/* Lower Bracket */}
            <div className="flex flex-row my-20 items-center justify-center mx-auto" style={{ minHeight: 520, width: 'fit-content' }}>
                <div className="flex flex-col gap-10 z-10">
                    <BracketRound
                        title="LOWER QUARTERFINALS (BO5)"
                        matches={data.lowerQuarterfinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                </div>
                <div className="flex flex-col ml-24 w-[260px] relative" style={{ minHeight: 520 }}>
                    <BracketRound
                        title="LOWER SEMIFINALS (BO5)"
                        matches={data.lowerSemifinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerSemifinals', i, match)}
                        readOnly={readOnly}
                        adminMode={adminMode}
                    />
                </div>
                <div className="flex flex-col justify-center ml-50" style={{ minHeight: 520 }}>
                    <div style={{ marginTop: '-150px' }}>
                        <BracketRound
                            title="QUALIFIED"
                            matches={data.lowerFinal}
                            onMatchUpdate={(i, match) => handleMatchUpdate('lowerFinal', i, match)}
                            readOnly={readOnly}
                            adminMode={adminMode}
                            hideInputs={true}
                        />
                    </div>
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

function BracketColumn({ label, matches, onMatchUpdate, readOnly = false }) {
    return (
        <div className="flex flex-col items-center flex-1">
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
                        readOnly={readOnly}
                    />
                ))}
            </div>
        </div>
    );
}

function ChampionModal({ isOpen, onClose, champion, adminMode = false }) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBracketSubmit = async (event_key, bracketData, isFinal = false) => {
        // Show confirmation dialog first
        const confirmed = window.confirm(
            isFinal
                ? "Are you sure you want to submit this as the final bracket? This action cannot be undone."
                : "Are you sure you want to submit your bracket? You will not be able to make changes after submission."
        );

        if (!confirmed) {
            return;
        }

        try {
            // Get the session token from Supabase
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert('Please sign in to submit your bracket');
                return;
            }

            const response = await fetch('/api/brackets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    event_key,
                    bracket_data: bracketData,
                    is_final: isFinal
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    alert('You have already submitted a bracket for this event. You cannot submit multiple brackets.');
                } else {
                    throw new Error(data.error || 'Failed to submit bracket');
                }
                return;
            }

            // Show success message
            alert(isFinal
                ? 'Final bracket submitted successfully!'
                : 'Bracket submitted successfully! Remember, you cannot make changes after submission.'
            );
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error submitting bracket:', error);
            alert('Failed to submit bracket. Please try again.');
        }
    }

    const handleAdminAction = () => {
        handleBracketSubmit(window.event_key, window.bracketData, true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    colors={['#FFD700', '#FFA500', '#FFC0CB']}
                    numberOfPieces={200}
                    recycle={false}
                />
            )}

            {/* Modal */}
            <div className="relative bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">CHAMPION</h2>
                    <div className="bg-yellow-400 text-black font-bold text-4xl px-8 py-6 rounded shadow-lg mb-6">
                        {champion}
                    </div>
                    <div className='flex flex-row justify-center gap-5'>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-yellow-400 hover:text-black transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => handleBracketSubmit(window.event_key, window.bracketData, false)}
                            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-green-400 hover:text-black transition-colors"
                        >
                            Submit your bracket
                        </button>
                        {adminMode && (
                            <button
                                onClick={handleAdminAction}
                                className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-blue-400 hover:text-black transition-colors"
                            >
                                Submit Final Bracket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayoffBracket({ data, updateBracket, readOnly = false, adminMode = false }) {
    const [showChampionModal, setShowChampionModal] = useState(false);

    // Add back the useEffect to handle initial playoff bracket population
    React.useEffect(() => {
        // Get the complete bracket data
        const completeData = {
            groupA: window.bracketData?.groupA,
            groupB: window.bracketData?.groupB,
            playoffs: data
        };

        // Check if we have qualified teams
        const groupAQualified = completeData.groupA?.qualified?.[0] || [];
        const groupBQualified = completeData.groupB?.qualified?.[0] || [];
        const hasQualifiedTeams = groupAQualified[0] && groupAQualified[1] && groupBQualified[0] && groupBQualified[1];

        // Check if we have lower final teams
        const groupALowerFinal = completeData.groupA?.lowerFinal?.[0] || [];
        const groupBLowerFinal = completeData.groupB?.lowerFinal?.[0] || [];
        const hasLowerFinalTeams = groupALowerFinal[0] && groupALowerFinal[1] && groupBLowerFinal[0] && groupBLowerFinal[1];

        // Update upper quarterfinals if we have qualified teams and the matches are empty
        if (hasQualifiedTeams && (!data.upperQuarterfinals || data.upperQuarterfinals.every(match => !match[0] || !match[1]))) {
            console.log('Updating upper quarterfinals with qualified teams');
            updateBracket('playoffs', 'upperQuarterfinals', [
                [groupAQualified[0], groupBQualified[1], groupAQualified[2], groupBQualified[3], '', ''],
                [groupAQualified[1], groupBQualified[0], groupAQualified[3], groupBQualified[2], '', '']
            ]);
        }

        // Update lower round 1 if we have lower final teams and the matches are empty
        if (hasLowerFinalTeams && (!data.lowerRound1 || data.lowerRound1.every(match => !match[0] || !match[1]))) {
            console.log('Updating lower round 1 with lower final teams');
            updateBracket('playoffs', 'lowerRound1', [
                [groupALowerFinal[0], groupBLowerFinal[1], groupALowerFinal[2], groupBLowerFinal[3], '', ''],
                [groupBLowerFinal[0], groupALowerFinal[1], groupBLowerFinal[2], groupALowerFinal[3], '', '']
            ]);
        }
    }, [data.groupA?.qualified, data.groupB?.qualified, data.groupA?.lowerFinal, data.groupB?.lowerFinal]);

    const handleMatchUpdate = (round, index, newMatch) => {
        const updated = [...data[round]];
        updated[index] = newMatch;
        updateBracket('playoffs', round, updated);

        const [team1, team2, logo1, logo2, score1, score2] = newMatch;
        const s1 = parseInt(score1);
        const s2 = parseInt(score2);

        // Check if match is complete (best of 7)
        if ((s1 === 4 || s2 === 4) && (s1 <= 4 && s2 <= 4)) {
            const winner = s1 === 4 ? team1 : team2;
            const loser = s1 === 4 ? team2 : team1;
            const winnerLogo = s1 === 4 ? logo1 : logo2;
            const loserLogo = s1 === 4 ? logo2 : logo1;
            advanceTeam(
                data,
                'playoffs',
                round,
                index,
                winner,
                loser,
                winnerLogo,
                loserLogo,
                updateBracket,
                true
            );

            // Show champion modal if this was the grand final
            if (round === 'grandFinal') {
                setShowChampionModal(true);
            }
        }
    };

    return (
        <div className="grid grid-cols-4 w-full gap-8 items-start" style={showChampionModal ? {} : { width: '100%' }}>
            {/* Lower Round 1 */}
            <div className="flex flex-col justify-center">
                <div style={{ marginTop: '458px' }}>
                    <BracketColumn
                        label="LOWER ROUND 1 (BO7)"
                        matches={data.lowerRound1}
                        onMatchUpdate={(i, match) => handleMatchUpdate('lowerRound1', i, match)}
                        readOnly={readOnly}
                    />
                </div>
            </div>
            {/* Quarterfinals: upper on top, lower below */}
            <div className="flex flex-col justify-center items-center gap-16">
                <BracketColumn
                    label="UPPER QUARTERFINALS (BO7)"
                    matches={data.upperQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('upperQuarterfinals', i, match)}
                    readOnly={readOnly}
                />
                <BracketColumn
                    label="LOWER QUARTERFINALS (BO7)"
                    matches={data.lowerQuarterfinals}
                    onMatchUpdate={(i, match) => handleMatchUpdate('lowerQuarterfinals', i, match)}
                    readOnly={readOnly}
                />
            </div>
            {/* Semifinals */}
            <div className="flex flex-col justify-center items-center">
                <div style={{ marginTop: '200px' }}>
                    <BracketColumn
                        label="SEMIFINALS (TOP 4, BO7)"
                        matches={data.semifinals}
                        onMatchUpdate={(i, match) => handleMatchUpdate('semifinals', i, match)}
                        readOnly={readOnly}
                    />
                </div>
            </div>
            {/* Grand Final and Champion */}
            <div className="flex flex-col justify-center items-center">
                <div style={{ marginTop: '300px' }}>
                    <BracketColumn
                        label="GRAND FINAL (BO7)"
                        matches={data.grandFinal}
                        onMatchUpdate={(i, match) => handleMatchUpdate('grandFinal', i, match)}
                        readOnly={readOnly}
                    />
                </div>
                <div className="flex flex-col items-center mt-8">
                    {data.champion && data.champion[0] && data.champion[0][0] && (
                        <button
                            onClick={() => setShowChampionModal(true)}
                            className="bg-yellow-400 text-black font-bold text-2xl px-8 py-4 rounded shadow-lg hover:bg-yellow-500 transition-colors"
                        >
                            View Champion
                        </button>
                    )}
                </div>
            </div>

            {/* Champion Modal */}
            <ChampionModal
                isOpen={showChampionModal}
                onClose={() => setShowChampionModal(false)}
                champion={data.champion?.[0]?.[0]}
                adminMode={adminMode}
            />
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
 *   - event_key: string
 *   - readOnly: boolean
 *
 * This component is now reusable for any bracketData shape matching the above.
 */
export default function TournamentBracket({ bracketData, updateBracket, event_key, readOnly = false, adminMode = false }) {
    const standings = getStandingsFromBracket(bracketData);
    const championDetermined = Boolean(bracketData.playoffs.champion?.[0]?.[0]);
    const [activeView, setActiveView] = useState('groupA');

    // Store the complete bracket data in window for access by child components
    React.useEffect(() => {
        window.bracketData = bracketData;
        window.event_key = event_key;
    }, [bracketData, event_key]);

    const renderGroupA = () => (
        <div className="flex flex-col mx-10">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                <button
                    onClick={() => setActiveView('groupA')}
                    className={`btn ${activeView === 'groupA' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group A
                </button>
                <button
                    onClick={() => setActiveView('groupB')}
                    className={`btn ${activeView === 'groupB' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group B
                </button>
                <button
                    onClick={() => setActiveView('playoffs')}
                    className={`btn ${activeView === 'playoffs' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Playoffs
                </button>
            </div>
            <h2 className="text-xl font-semibold text-center mb-6">GROUP A</h2>
            <div className="flex flex-row justify-center">
                <BracketGrid
                    groupKey="groupA"
                    data={bracketData.groupA}
                    updateBracket={updateBracket}
                    readOnly={readOnly}
                    adminMode={adminMode}
                />
            </div>
        </div>
    );

    const renderGroupB = () => (
        <div className="flex flex-col mx-10">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                <button
                    onClick={() => setActiveView('groupA')}
                    className={`btn ${activeView === 'groupA' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group A
                </button>
                <button
                    onClick={() => setActiveView('groupB')}
                    className={`btn ${activeView === 'groupB' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group B
                </button>
                <button
                    onClick={() => setActiveView('playoffs')}
                    className={`btn ${activeView === 'playoffs' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Playoffs
                </button>
            </div>
            <h2 className="text-xl font-semibold text-center mb-6">GROUP B</h2>
            <div className="flex flex-row justify-center">
                <BracketGrid
                    groupKey="groupB"
                    data={bracketData.groupB}
                    updateBracket={updateBracket}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );

    const renderPlayoffs = () => (
        <div className="flex-1">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                <button
                    onClick={() => setActiveView('groupA')}
                    className={`btn ${activeView === 'groupA' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group A
                </button>
                <button
                    onClick={() => setActiveView('groupB')}
                    className={`btn ${activeView === 'groupB' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Group B
                </button>
                <button
                    onClick={() => setActiveView('playoffs')}
                    className={`btn ${activeView === 'playoffs' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    Playoffs
                </button>
            </div>
            <PlayoffBracket
                data={bracketData.playoffs}
                updateBracket={updateBracket}
                readOnly={readOnly}
                adminMode={adminMode}
            />
        </div>
    );

    return (
        <div className="relative">
            {adminMode && (
                <div className="absolute top-0 right-0 z-50 m-4">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold">Admin Mode</span>
                    </div>
                </div>
            )}
            <div className="relative p-8 text-white">
                {activeView === 'groupA' && renderGroupA()}
                {activeView === 'groupB' && renderGroupB()}
                {activeView === 'playoffs' && renderPlayoffs()}
            </div>
        </div>
    );
}