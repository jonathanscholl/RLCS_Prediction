import { supabase } from "@/app/utils/supabaseClient";

export async function GET(req) {
  // Get event_id from query string
  const { searchParams } = new URL(req.url);
  const event_key = searchParams.get("event_key");

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
    team1,
    team2,
    event_key,
    team1_data:teams!team1 (
      key,
      name,
      logo
    ),
    team2_data:teams!team2 (
      key,
      name,
      logo
    )
  `
    )
    .eq("event_key", event_key);

  if (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.log(data);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
