import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-xl w-full flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">RLCS Bracket Predictions</h1>
        <p className="text-lg text-gray-300 text-center mb-4">
          Predict the RLCS playoff bracket, compete with friends, and see who comes out on top!
        </p>
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <span className="font-semibold text-yellow-400">How it works:</span>
            <ul className="list-disc list-inside text-left mt-2 text-gray-200 text-base">
              <li>Fill out your predictions for every match in the bracket.</li>
              <li>Watch the standings update as the tournament progresses.</li>
              <li>Share your predictions and challenge your friends!</li>
            </ul>
          </div>
        </div>
        <Link href="/regions">
          <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition-all">
            Start Predicting!
          </button>
        </Link>
        <footer className="mt-10 text-gray-500 text-xs text-center w-full">
          Not affiliated with RLCS or Psyonix. Made for fun by the community.
        </footer>
      </div>
    </main>
  );
}
