"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Submission {
  id: number;
  title: string;
  difficulty: string;
  difficulty_rating: string;
  time_complexity: string;
  space_complexity: string;
  data_structure: string;
  time_taken: string;
  notes: string;
  pattern: string;
  solution: string;
  timestamp: string;
}

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editingNote, setEditingNote] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("leetdoc")
        .select("*")
        .order("timestamp", { ascending: false });

      if (!error && data) setSubmissions(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleNoteUpdate = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("leetdoc")
      .update({ notes: editingNote })
      .eq("id", selected.id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selected.id ? { ...s, notes: editingNote } : s
        )
      );
      setSelected({ ...selected, notes: editingNote });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0] font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">
        🌟 LeetDoc Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-600">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-lg rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Difficulty</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  className="cursor-pointer hover:bg-gray-50 border-t"
                  onClick={() => {
                    setSelected(s);
                    setEditingNote(s.notes);
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {s.title}
                  </td>
                  <td className="px-6 py-4">{s.difficulty}</td>
                  <td className="px-6 py-4">{s.difficulty_rating}</td>
                  <td className="px-6 py-4">{s.time_taken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selected.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selected.difficulty} • Rating: {selected.difficulty_rating} •{" "}
                {new Date(selected.timestamp).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={() => setSelected(null)} variant="outline">
              ⬅️ Back
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>🧠 Pattern: {selected.pattern}</p>
            <p>🧮 Time Complexity: {selected.time_complexity}</p>
            <p>📦 Space Complexity: {selected.space_complexity}</p>
            <p>🧱 Data Structures: {selected.data_structure}</p>
            <p>⏱️ Time Taken: {selected.time_taken}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              💡 Solution
            </h3>
            <SyntaxHighlighter
              language="python"
              style={oneLight}
              customStyle={{ borderRadius: "12px", padding: "1rem" }}
            >
              {selected.solution}
            </SyntaxHighlighter>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              📝 Notes
            </h3>
            <Textarea
              value={editingNote}
              onChange={(e) => setEditingNote(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleNoteUpdate}>💾 Save</Button>
              <Button
                variant="outline"
                onClick={() => setEditingNote(selected.notes)}
              >
                🔄 Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
