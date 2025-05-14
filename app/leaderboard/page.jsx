'use client';
import Leaderboard from '../components/Leaderboard';

export default function LeaderboardPage() {
    return (
        <main className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[30vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Global Leaderboard</h1>
                        <p className="text-lg opacity-80">
                            See who's leading the predictions and compete for the top spot!
                        </p>
                    </div>
                </div>
            </div>

            {/* Leaderboard Content */}
            <div className="container mx-auto px-4 py-8">
                <Leaderboard limit={50} />
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p className="text-sm opacity-70">Not affiliated with RLCS or Psyonix. Made for fun by the community.</p>
                </div>
            </footer>
        </main>
    );
} 