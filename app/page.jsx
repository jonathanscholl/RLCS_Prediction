import Link from 'next/link';
import { supabase } from './utils/supabaseClient';

async function getTrendingEvents() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .limit(3);

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return events;
}

export default async function Home() {
  const trendingEvents = await getTrendingEvents();

  return (
    <main className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">RLCS Bracket Predictions</h1>
            <p className="text-lg opacity-80 mb-8">
              Predict the RLCS playoff bracket, compete with friends, and see who comes out on top!
            </p>
            <Link href="/events">
              <button className="btn btn-primary btn-lg">
                View All Events
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Events Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Trending Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/bracket?event=${event.key}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body flex flex-col items-center">
                <h3 className="card-title text-xl">{event.name}</h3>
                <p className="text-base-content/70">{event.region}</p>
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-primary btn-sm">
                    Predict now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">How it works</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="badge badge-primary">1</div>
                <span>Fill out your predictions for every match in the bracket.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="badge badge-primary">2</div>
                <span>Watch the standings update as the tournament progresses.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="badge badge-primary">3</div>
                <span>Share your predictions and challenge your friends!</span>
              </li>
            </ul>
          </div>
        </div>
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