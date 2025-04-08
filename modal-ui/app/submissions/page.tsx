"use client";

import { useEffect, useState, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatModal } from "@/components/ChatModel";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

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

  const selected = submissions.find((s) => s.id === selectedId);

  const handleRowClick = (s: Submission) => {
    if (selectedId === s.id) {
      setSelectedId(null);
      setEditingNote("");
    } else {
      setSelectedId(s.id);
      setEditingNote(s.notes);
    }
  };

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
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col px-6 py-8 bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0]">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
            🌟 LeetDoc Submissions
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
                    <Fragment key={s.id}>
                      <tr
                        className="cursor-pointer hover:bg-gray-50 border-t"
                        onClick={() => handleRowClick(s)}
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {s.title}
                        </td>
                        <td className="px-6 py-4">{s.difficulty}</td>
                        <td className="px-6 py-4">{s.difficulty_rating}</td>
                        <td className="px-6 py-4">{s.time_taken}</td>
                      </tr>

                      {selectedId === s.id && (
                        <tr>
                          <td colSpan={4}>
                            <div className="mt-4 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-800">
                                    {s.title}
                                  </h2>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {s.difficulty} • Rating:{" "}
                                    {s.difficulty_rating} •{" "}
                                    {new Date(s.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <p>🧠 Pattern: {s.pattern}</p>
                                <p>🧮 Time Complexity: {s.time_complexity}</p>
                                <p>📦 Space Complexity: {s.space_complexity}</p>
                                <p>🧱 Data Structures: {s.data_structure}</p>
                                <p>⏱️ Time Taken: {s.time_taken}</p>
                              </div>

                              <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                  💡 Solution
                                </h3>
                                <SyntaxHighlighter
                                  language="python"
                                  style={oneLight}
                                  customStyle={{
                                    borderRadius: "12px",
                                    padding: "1rem",
                                  }}
                                >
                                  {s.solution}
                                </SyntaxHighlighter>
                              </div>

                              <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                  📝 Notes
                                </h3>
                                <Textarea
                                  value={editingNote}
                                  onChange={(e) =>
                                    setEditingNote(e.target.value)
                                  }
                                  className="min-h-[80px]"
                                />
                                <div className="flex gap-2 mt-2">
                                  <Button onClick={handleNoteUpdate}>
                                    💾 Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setEditingNote(s.notes ?? "")
                                    }
                                  >
                                    🔄 Reset
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    onClick={() => setChatOpen(true)}
                                  >
                                    💬 Chat with LeetDoc AI
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected && (
            <ChatModal
              open={chatOpen}
              onOpenChange={setChatOpen}
              problem={selected}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
