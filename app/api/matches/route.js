import { supabase } from "@/app/utils/supabaseClient";

export async function GET(req) {
  // Get event_id from query string
  const { searchParams } = new URL(req.url);
  const event_id = searchParams.get("event_id");

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
    team1,
    team2,
    event_id,
    team1_data:teams!fk_team1 (
      id,
      name
    ),
    team2_data:teams!fk_team2 (
      id,
      name
    )
  `
    )
    .eq("event_id", event_id);

  if (error) {
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
