import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";

export async function POST(request) {
  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.signInWithPassword({
      email: "test@test.com",
      password: "Test12345",
    });

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
