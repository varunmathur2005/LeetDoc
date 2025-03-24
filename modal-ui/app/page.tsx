"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [open, setOpen] = useState(true);
  const [problemData, setProblemData] = useState<any>(null);

  const [difficulty, setDifficulty] = useState("");
  const [trick, setTrick] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [dataStructure, setDataStructure] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [notes, setNotes] = useState("");
  const [pattern, setPattern] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");

    if (!encodedData) {
      console.error("❌ No encoded problem data in URL.");
      return;
    }

    try {
      const decoded = JSON.parse(atob(decodeURIComponent(encodedData)));
      setProblemData(decoded);
      console.log("📦 Decoded problem data:", decoded);
    } catch (err) {
      console.error("❌ Failed to decode problem data:", err);
    }
  }, []);

  const handleSubmit = async () => {
    if (!problemData) return;

    const enriched = {
      ...problemData,
      difficulty_rating: difficulty,
      trick,
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      data_structure: dataStructure,
      time_taken: timeTaken,
      notes,
      pattern,
    };

    const { error } = await supabase.from("leetdoc").insert([enriched]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      alert("❌ Failed to upload");
    } else {
      alert("✅ Uploaded to Supabase!");
      window.close();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/mountains.jpg')`,
          filter: "blur(8px)",
        }}
      />
      <div className="absolute inset-0 bg-white/20 z-0" />

      {/* Modal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                📝 Quick Problem Reflection
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill this out to solidify your understanding before saving to
                LeetDoc.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <Input
                placeholder="Difficulty (1-5)"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              <Input
                placeholder="Trick (optional)"
                value={trick}
                onChange={(e) => setTrick(e.target.value)}
              />
              <Input
                placeholder="Time Complexity"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
              />
              <Input
                placeholder="Space Complexity"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
              />
              <Input
                placeholder="Data Structure(s) Used"
                value={dataStructure}
                onChange={(e) => setDataStructure(e.target.value)}
              />
              <Input
                placeholder="Time Taken (e.g. 25 min)"
                value={timeTaken}
                onChange={(e) => setTimeTaken(e.target.value)}
              />
              <Textarea
                placeholder="Notes for future reference"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Input
                placeholder="Pattern (e.g. Two Pointers, Sliding Window)"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit}>🚀 Submit to LeetDoc</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
