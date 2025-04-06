"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ChatModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: {
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
  };
};

export function ChatModal({ open, onOpenChange, problem }: ChatModalProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setMessages([
        `🤖 AI: Let's dive into "${problem.title}". Ask me anything about it!`,
      ]);
    }
  }, [open]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = `🧑 You: ${input}`;
    setMessages((prev) => [...prev, userMsg]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        context: problem,
      }),
    });

    const { response: reply } = await response.json();
    setMessages((prev) => [...prev, `🤖 AI: ${reply}`]);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            💬 LeetDoc AI Assistant
          </DialogTitle>
        </DialogHeader>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mt-2 border border-gray-200 shadow-inner scroll-smooth"
        >
          {messages.map((msg, i) => (
            <p key={i} className="whitespace-pre-wrap text-sm mb-3">
              {msg}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something like: Can you explain this solution?"
            className="resize-none min-h-[80px]"
          />
          <Button className="mt-2 w-full" onClick={sendMessage}>
            🚀 Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
