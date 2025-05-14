import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Get the current user from the session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_key, bracket_data, is_final } = await request.json();

    // Check if a bracket already exists for this user and event
    const { data: existingBracket } = await supabase
      .from("user_brackets")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_key", event_key)
      .single();

    if (existingBracket && !is_final) {
      return NextResponse.json(
        { error: "Bracket already exists for this event" },
        { status: 409 }
      );
    }

    // If this is a final bracket, check if one already exists
    if (is_final) {
      const { data: existingFinalBracket } = await supabase
        .from("user_brackets")
        .select("*")
        .eq("event_key", event_key)
        .eq("is_final", true)
        .single();

      if (existingFinalBracket) {
        return NextResponse.json(
          { error: "Final bracket already exists for this event" },
          { status: 409 }
        );
      }
    }

    // Insert the new bracket
    const { error } = await supabase.from("user_brackets").insert({
      user_id: user.id,
      event_key,
      bracket_data,
      is_final: is_final || false,
    });

    if (error) throw error;

    return NextResponse.json({ message: "Bracket submitted successfully" });
  } catch (error) {
    console.error("Error submitting bracket:", error);
    return NextResponse.json(
      { error: "Failed to submit bracket" },
      { status: 500 }
    );
  }
}
