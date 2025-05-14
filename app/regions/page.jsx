'use client';
import { useRouter } from 'next/navigation';

const regionNames = [
    { key: 'NA', label: 'NA Predictions' },
    { key: 'EU', label: 'EU Predictions' },
    { key: 'MENA', label: 'MENA Predictions' },
    { key: 'SAM', label: 'South America Predictions' },
    { key: 'APAC', label: 'APAC Predictions' },
    { key: 'OCE', label: 'OCE Predictions' },
];

export default function RegionsPage() {
    const router = useRouter();

    const handleRegion = (regionKey) => {
        router.push(`/events?region=${regionKey}`);
    };

    return (
        <div className="min-h-screen text-primary p-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">Select a Region</h1>
            <div className="flex flex-row flex-wrap justify-center gap-4 mb-8">
                {regionNames.map((r) => (
                    <button
                        key={r.key}
                        className="px-6 py-2 rounded font-bold text-lg shadow bg-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
                        onClick={() => handleRegion(r.key)}
                    >
                        {r.label}
                    </button>
                ))}
            </div>
        </div>
    );
}