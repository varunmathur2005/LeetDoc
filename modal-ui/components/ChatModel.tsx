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
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setMessages([
        {
          sender: "ai",
          text: `Hey! Let's review your solution for **"${problem.title}"** together. Feel free to ask questions like:\n\n- What does this line do?\n- Can we optimize this?\n- Are there alternative approaches?\n\nI'm ready when you are! 💻`,
        },
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

    const userMsg: { sender: "user"; text: string } = {
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        context: problem,
      }),
    });

    const { response: reply } = await response.json();

    const aiMsg: { sender: "ai"; text: string } = {
      sender: "ai",
      text: reply,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setInput("");
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            👩‍💻 Pair Program with LeetDoc AI
          </DialogTitle>
        </DialogHeader>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto bg-muted rounded-lg p-4 mt-2 border border-gray-200 shadow-inner space-y-4 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] text-sm px-4 py-2 rounded-xl whitespace-pre-wrap ${
                msg.sender === "ai"
                  ? "bg-white text-gray-800 self-start"
                  : "bg-blue-600 text-white self-end ml-auto"
              }`}
            >
              {msg.text}
            </div>
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
            💬 Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
