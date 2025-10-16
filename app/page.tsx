"use client";
import React, { useState } from "react";
import {
  Youtube,
  MessageSquare,
  Loader2,
  CheckCircle,
  FileText,
} from "lucide-react";

export default function Home() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const [step, setStep] = useState("input");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [question, setQuestion] = useState("");
  type Message = { type: "user" | "bot"; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [processingStatus, setProcessingStatus] = useState("");
  const [summaryDetail, setSummaryDetail] = useState<
    "brief" | "medium" | "detailed"
  >("medium");
  const [summary, setSummary] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTranscribe = async () => {
    setErrorMessage("");
    if (!videoUrl.trim()) {
      setErrorMessage("Please enter a YouTube URL");
      return;
    }
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(videoUrl)) {
      setErrorMessage("Please enter a valid YouTube URL");
      return;
    }

    setStep("processing");
    const progressMessages = [
      "Connecting to server...",
      "Downloading video audio...",
      "Transcribing with WhisperX...",
      "Creating text chunks...",
      "Generating embeddings...",
      "Creating summary...",
    ];

    let progressIndex = 0;
    const progressInterval = setInterval(() => {
      if (progressIndex < progressMessages.length) {
        setProcessingStatus(progressMessages[progressIndex]);
        progressIndex++;
      }
    }, 2000);

    try {
      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          summary_detail: summaryDetail,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to transcribe video");
      }
      const data = await response.json();
      setVideoId(data.video_id);
      setSummary(data.summary);
      setProcessingStatus("Processing complete!");
      setStep("ready");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error during transcription:", error);
      setStep("input");
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setStep("answering");

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: videoId,
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        type: "bot",
        text: data.answer,
      };
      setMessages((prev) => [...prev, botMessage]);
      setStep("ready");
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage: Message = {
        type: "bot",
        text: "Sorry, I couldn't process your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStep("ready");
    }
  };

  const handleReset = () => {
    setStep("input");
    setVideoUrl("");
    setVideoId("");
    setQuestion("");
    setMessages([]);
    setProcessingStatus("");
    setSummaryDetail("medium");
    setSummary([]);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Youtube className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              YouTube Video Q&A
            </h1>
          </div>
          <p className="text-gray-600">
            Ask questions about any YouTube video without watching it
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === "input" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errorMessage && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Summary Detail Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Summary Detail Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSummaryDetail("brief")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryDetail === "brief"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      Brief
                    </div>
                    <div className="text-xs text-gray-600">
                      Quick overview (2-3 points)
                    </div>
                  </button>

                  <button
                    onClick={() => setSummaryDetail("medium")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryDetail === "medium"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      Medium
                    </div>
                    <div className="text-xs text-gray-600">
                      Balanced summary (4-5 points)
                    </div>
                  </button>

                  <button
                    onClick={() => setSummaryDetail("detailed")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryDetail === "detailed"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      Detailed
                    </div>
                    <div className="text-xs text-gray-600">
                      Comprehensive (6+ points)
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleTranscribe}
                disabled={!videoUrl}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Transcribe & Summarize
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Paste a YouTube URL, choose
                  your preferred summary detail level, and we'll transcribe the
                  video so you can ask questions about its content.
                </p>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Processing Your Video
              </h3>
              <p className="text-gray-600 mb-6">{processingStatus}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          )}

          {/* Answer Questions */}
          {(step === "ready" || step === "answering") && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">
                    Video transcribed successfully!
                  </p>
                  <p className="text-xs text-green-700">
                    Ask any question about the video content below.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-green-700 hover:text-green-900 font-medium underline"
                >
                  New Video
                </button>
              </div>

              {/* Video Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Video Summary</h3>
                  <span className="ml-auto text-xs px-2 py-1 bg-purple-200 text-purple-700 rounded-full font-medium">
                    {summaryDetail.charAt(0).toUpperCase() +
                      summaryDetail.slice(1)}
                  </span>
                </div>
                <ul className="space-y-2">
                  {summary && summary.length > 0 ? (
                    summary.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 text-sm text-gray-700"
                      >
                        <span className="text-purple-600 font-bold flex-shrink-0">
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 italic">
                      No summary available
                    </li>
                  )}
                </ul>
              </div>

              {/* Chat Messages */}
              <div className="border-2 border-gray-200 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No questions yet. Ask something about the video!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.type === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}

                {step === "answering" && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Question Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder="Ask a question about the video..."
                  disabled={step === "answering"}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || step === "answering"}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Ask
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Powered by WhisperX, OpenAI GPT, FAISS, and LangChain
        </div>
      </div>
    </div>
  );
}
