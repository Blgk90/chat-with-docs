"use client";

import { useState } from "react";

type ChatPanelProps = {
  documentText: string;
};

export default function ChatPanel({ documentText }: ChatPanelProps) {
	
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  async function handleAskQuestion() {
    if (!question.trim()) return;

    try {
      setIsAsking(true);
      setAnswer("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          documentText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.message);
      }
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-2 text-xl font-semibold">
        Ask something about this document
      </h2>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Example: What is this document about?"
        className="min-h-32 w-full resize-none rounded-xl border border-gray-700 bg-black p-4 text-white outline-none"
      />

      <button
        onClick={handleAskQuestion}
        disabled={isAsking || !question.trim()}
        className="mt-4 rounded-xl bg-white px-4 py-2 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAsking ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6 rounded-xl bg-black p-4">
          <h3 className="mb-2 font-semibold text-gray-300">Answer</h3>
          <p className="whitespace-pre-wrap text-gray-100">{answer}</p>
        </div>
      )}
    </div>
  );
}