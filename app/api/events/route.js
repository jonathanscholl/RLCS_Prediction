import { supabase } from "@/app/utils/supabaseClient";

export async function GET(req) {
  // Get event_id from query string
  const { searchParams } = new URL(req.url);
  const region_key = searchParams.get("region_key");

  console.log(region_key);

  const { data, error } = await supabase
    .from("events")
    .select(
      `
    name,
    key,
    region_key
  `
    )
    .eq("region_key", region_key);

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
