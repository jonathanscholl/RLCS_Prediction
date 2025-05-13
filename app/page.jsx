import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full flex flex-col items-center gap-8">
        <h1 className="rlcs-title text-center mb-4">
          RLCS 2025
          <span className="block text-2xl md:text-3xl mt-2 text-rlcs-accent">
            World Championship Predictions
          </span>
        </h1>

        <div className="rlcs-card p-8 w-full max-w-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-rlcs-accent mb-4">
                Predict. Compete. Dominate.
              </h2>
              <p className="text-gray-300 text-lg">
                Join the ultimate RLCS prediction challenge and prove your expertise in competitive Rocket League.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-rlcs-dark bg-opacity-50 rounded-lg p-6">
                <h3 className="text-rlcs-primary font-bold text-xl mb-3">How It Works</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Fill out your bracket predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Track live tournament progress
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Compete with the community
                  </li>
                </ul>
              </div>

              <div className="bg-rlcs-dark bg-opacity-50 rounded-lg p-6">
                <h3 className="text-rlcs-secondary font-bold text-xl mb-3">Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Real-time updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Regional brackets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rlcs-accent">•</span>
                    Point scoring system
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/regions">
              <button className="rlcs-button">
                Start Your Predictions
              </button>
            </Link>
          </div>
        </div>

        <footer className="mt-8 text-gray-400 text-sm text-center">
          Not affiliated with Psyonix or RLCS. Made with ♥ by the Rocket League community.
        </footer>
      </div>
    </main>
  );
}