'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabaseClient';
import Leaderboard from './components/Leaderboard';

export default function Home() {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch trending events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .limit(3);

      if (eventsError) throw eventsError;

      // Get user's profile
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch groups owned by the user
        const { data: ownedGroups, error: ownedError } = await supabase
          .from('groups')
          .select(`id, name, join_link, owner!inner(id, username, profile_picture)`)
          .eq('owner', profileData.id);

        if (ownedError) throw ownedError;

        // Fetch groups where user is a member
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select(`
                        group:group_id (
                            id,
                            name,
                            join_link,
                            owner:owner (
                                id,
                                username,
                                profile_picture
                            )
                        )
                    `)
          .eq('profile_id', profileData.id);

        if (memberError) throw memberError;

        // Combine and format the groups
        const formattedOwnedGroups = ownedGroups || [];
        const formattedMemberGroups = (memberGroups || []).map(mg => mg.group);

        // Remove any duplicates
        const allGroups = [...formattedOwnedGroups];
        formattedMemberGroups.forEach(group => {
          if (!allGroups.some(g => g.id === group.id)) {
            allGroups.push(group);
          }
        });

        setMyGroups(allGroups);
      }

      setTrendingEvents(events || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-base-200">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Events */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Trending Events</h2>
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
            </div>

            {/* My Groups Section */}
            {myGroups.length > 0 && (
              <div className="card bg-base-100 shadow-xl mt-8">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">My Groups</h2>
                    <Link href="/groups" className="btn btn-ghost btn-sm">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myGroups.slice(0, 4).map((group) => (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="card-body">
                          <h3 className="card-title text-xl">{group.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="mask mask-squircle w-8 h-8">
                                {group.owner?.profile_picture ? (
                                  <img src={group.owner.profile_picture} alt={group.owner.username} />
                                ) : (
                                  <div className="bg-base-300 flex items-center justify-center">
                                    <span className="text-lg">👤</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="text-sm opacity-70">Created by {group.owner?.username}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard limit={10} />
          </div>
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