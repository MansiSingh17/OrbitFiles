"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { MessageCircle, Send, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import type { File as FileType } from "@/lib/db/schema";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocumentChatProps {
  file: FileType;
  onClose?: () => void;
}

export default function DocumentChat({ file }: DocumentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processDocument = async () => {
    setProcessing(true);
    try {
      await axios.post("/api/documents/process-pdf", {
        fileId: file.id,
        fileUrl: file.fileUrl,
        fileName: file.name,
      });

      setMessages([
        {
          role: "assistant",
          content: "Document processed! Ask me anything about this file.",
        },
      ]);
    } catch (error) {
      console.error("Error processing document:", error);
      setMessages([
        {
          role: "assistant",
          content: "Failed to process document. Please try again.",
        },
      ]);
    } finally {
      setProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post("/api/documents/chat", {
        fileId: file.id,
        question: question,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: error.response?.data?.error || "Sorry, I couldn't answer that question.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-2 border-blue-100">
      <CardHeader className="border-b border-blue-50 pb-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chat with Document</h3>
            <p className="text-sm text-gray-600">Ask questions about {file.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="bg-white">
        {messages.length === 0 && !processing && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <p className="text-gray-600 mb-4">
              Process this document to start asking questions
            </p>
            <Button
              color="primary"
              onClick={processDocument}
              className="bg-gradient-to-r from-blue-600 to-blue-500"
            >
              Process Document
            </Button>
          </div>
        )}

        {processing && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Processing document... This may take a minute.</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              </div>
            )}
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this document..."
              onKeyPress={(e) => e.key === "Enter" && !loading && handleAskQuestion()}
              disabled={loading}
              classNames={{
                inputWrapper: "bg-white border border-gray-200",
              }}
            />
            <Button
              isIconOnly
              color="primary"
              onClick={handleAskQuestion}
              isLoading={loading}
              isDisabled={!question.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-blue-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}