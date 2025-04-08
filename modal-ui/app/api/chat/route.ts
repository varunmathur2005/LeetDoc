import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, context } = body;

  const prompt = `
You're a friendly and skilled programming buddy working through LeetCode problems together with the user, like in a pair programming session.

Your job is to help the user understand their solution, debug it if needed, or give suggestions on how to improve.

Here’s what you know so far:

🧩 Problem Title: ${context.title}
📊 Difficulty: ${context.difficulty} (Rating: ${context.difficulty_rating})
⚙️ Time Complexity: ${context.time_complexity}
📦 Space Complexity: ${context.space_complexity}
🧱 Data Structures Used: ${context.data_structure}
⏱️ Time Taken: ${context.time_taken}
🔁 Pattern: ${context.pattern}
📝 Notes: ${context.notes}

💡 User's Solution:
${context.solution}

---

The user says: "${message}"

Reply conversationally like a pair programming buddy would. Be supportive, ask clarifying questions if needed, and feel free to suggest improvements or alternative approaches.
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
