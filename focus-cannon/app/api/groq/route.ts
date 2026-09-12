import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, courses, hoursAvailable, urgency, sessionsCount, totalHours, userApiKey } = body;

    const apiKey = userApiKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "No Groq API key found. Utilizing client structured fallback.",
        fallback: true,
      });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "missions") {
      systemPrompt =
        "You are an AI Academic Planner for FOCUS CANNON. Return a JSON object with a 'missions' array containing objects with keys: course, title, description, estimatedMinutes (int), xpReward (int), priority ('high'|'medium'), syllabusCoverage (int 1-100).";
      userPrompt = `Courses: ${courses?.join(", ") || "CS301"}, Hours: ${hoursAvailable || 3}, Urgency: ${urgency || "normal"}`;
    } else {
      systemPrompt =
        "You are an AI Learning Analyst for FOCUS CANNON. Return a JSON object with keys: summary (string), peakFocusWindow (string), recommendedFocusHours (string), weakTopics (string array), focusScore (int 1-100).";
      userPrompt = `User completed ${sessionsCount || 8} focus sessions totaling ${totalHours || 18} hours this week.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Groq API server error:", errorText);
      return NextResponse.json({
        success: false,
        message: "Groq API error/quota limit. Utilizing structured fallback.",
        fallback: true,
      });
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: parsedContent,
    });
  } catch (e: any) {
    console.warn("Server route exception in Groq API:", e);
    return NextResponse.json({
      success: false,
      message: e.message || "Failed to process Groq request",
      fallback: true,
    });
  }
}
