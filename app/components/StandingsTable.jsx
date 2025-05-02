import React from 'react';

const defaultStandings = [
    { place: '1ST', points: 18, teams: [''] },
    { place: '2ND', points: 12, teams: [''] },
    { place: '3RD-4TH', points: 8, teams: ['', ''] },
    { place: '5TH-6TH', points: 6, teams: ['', ''] },
    { place: '7TH-8TH', points: 4, teams: ['', ''] },
    { place: '9TH-12TH', points: 2, teams: ['', '', '', ''] },
    { place: '13TH-16TH', points: 1, teams: [' ', '', '', ''] },
];

export default function StandingsTable({ standings = defaultStandings }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-fit mx-auto mt-8">
            <table className="min-w-full text-white border-separate border-spacing-y-1">
                <thead>
                    <tr>
                        <th className="bg-gray-900 px-4 py-2 rounded-tl-lg">PLACE</th>
                        <th className="bg-gray-900 px-4 py-2">RLCS PTS</th>
                        <th className="bg-gray-900 px-4 py-2 rounded-tr-lg">PARTICIPANT</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((row, idx) => (
                        <tr key={row.place}>
                            <td className="bg-gray-700 px-4 py-2 font-bold text-center border-r border-gray-800 align-top" style={{ minWidth: 80 }}>{row.place}</td>
                            <td className="bg-gray-700 px-4 py-2 text-center border-r border-gray-800 align-top">{row.points}</td>
                            <td className="bg-gray-700 px-4 py-2 align-top">
                                <div className="flex flex-col gap-1">
                                    {row.teams.map((team) => (
                                        <span key={team} className="font-semibold text-sm bg-gray-600 rounded px-2 py-1 w-fit">{team}</span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 