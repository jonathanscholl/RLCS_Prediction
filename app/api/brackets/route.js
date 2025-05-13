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

    // Get the request body
    const { event_key, bracket_data } = await request.json();

    if (!event_key || !bracket_data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a bracket for this event
    const { data: existingBracket, error: checkError } = await supabase
      .from("user_brackets")
      .select("id")
      .eq("user_id", user.id)
      .eq("event_key", event_key)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is the "no rows returned" error
      console.error("Error checking existing bracket:", checkError);
      return NextResponse.json(
        { error: "Failed to check existing bracket" },
        { status: 500 }
      );
    }

    if (existingBracket) {
      return NextResponse.json(
        { error: "You have already submitted a bracket for this event" },
        { status: 409 }
      );
    }

    // Insert the bracket data
    const { data, error } = await supabase
      .from("user_brackets")
      .insert([
        {
          event_key,
          bracket_data,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting bracket:", error);
      return NextResponse.json(
        { error: "Failed to save bracket" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in bracket submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
