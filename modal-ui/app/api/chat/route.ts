import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, context } = body;

  const prompt = `
You are a helpful assistant that explains LeetCode problems to users like a mentor.

Here is the problem context:
Title: ${context.title}
Difficulty: ${context.difficulty}
Rating: ${context.difficulty_rating}
Time Complexity: ${context.time_complexity}
Space Complexity: ${context.space_complexity}
Data Structures: ${context.data_structure}
Time Taken: ${context.time_taken}
Pattern: ${context.pattern}
Notes: ${context.notes}

User Solution:
${context.solution}

The user says: "${message}"
Please respond like you're helping them understand the problem or their approach.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ response: `Error: ${error}` }, { status: 500 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  return NextResponse.json({ response: content });
}
