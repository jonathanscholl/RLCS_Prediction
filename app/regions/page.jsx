'use client';
import { useRouter } from 'next/navigation';

const regionNames = [
    { key: 'NA', label: 'North America', icon: '🌎' },
    { key: 'EU', label: 'Europe', icon: '🌍' },
    { key: 'MENA', label: 'Middle East & North Africa', icon: '🌏' },
    { key: 'SAM', label: 'South America', icon: '🌎' },
    { key: 'APAC', label: 'Asia Pacific', icon: '🌏' },
    { key: 'OCE', label: 'Oceania', icon: '🌏' },
];

export default function RegionsPage() {
    const router = useRouter();

    const handleRegion = (regionKey) => {
        router.push(`/events?region=${regionKey}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="rlcs-card p-8 max-w-4xl w-full">
                <h1 className="rlcs-title text-center mb-12">Select Your Region</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regionNames.map((region) => (
                        <button
                            key={region.key}
                            onClick={() => handleRegion(region.key)}
                            className="group relative overflow-hidden rounded-xl bg-rlcs-dark p-6 transition-all duration-300 hover:scale-105"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 rlcs-gradient opacity-20"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <span className="text-4xl mb-4 block">{region.icon}</span>
                                <h2 className="text-xl font-bold text-rlcs-accent mb-2">{region.key}</h2>
                                <p className="text-gray-300">{region.label}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}