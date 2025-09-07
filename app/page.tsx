"use client";
import FeaturesSection from "@/components/feature-section";
import InputForm from "@/components/input-form";
import SummaryResults from "@/components/summary-results";
import { Play } from "lucide-react";
import { useState } from "react";

interface SummaryData {
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  keyPoints?: string[] | null;
  fullSummary: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [includeBullets, setIncludeBullets] = useState(true);
  const [bulletLength, setBulletLength] = useState("medium");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    // change to the actual api call once endpoints are done
    setTimeout(() => {
      setSummary({
        title: "How to Build a Successful Startup in 2025",
        channel: "TechEntrepreneur",
        duration: "12:34",
        views: "1.2M views",
        thumbnail:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&h=270&fit=crop",
        keyPoints: includeBullets
          ? [
              "Identify a real problem that affects a significant number of people",
              "Validate your solution through customer interviews and MVP testing",
              "Focus on building a strong founding team with complementary skills",
              "Secure adequate funding while maintaining equity control",
              "Prioritize product-market fit over rapid scaling",
            ]
          : null,
        fullSummary:
          "This comprehensive guide covers the essential steps for building a successful startup in today's competitive landscape. The speaker emphasizes the importance of problem validation, team building, and strategic funding decisions. Key insights include focusing on customer needs first, building an MVP to test assumptions, and scaling only after achieving product-market fit.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    let textToCopy = summary.fullSummary;
    if (summary.keyPoints) {
      textToCopy += "\n\nKey Points:\n• " + summary.keyPoints.join("\n• ");
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setUrl("");
    setSummary(null);
    setError("");
  };

  return (
    <main>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-red-500 rounded-full">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">
                SummaTube - YouTube Summarizer
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any YouTube video into concise, actionable summaries in
              seconds
            </p>
          </div>
          <InputForm
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            error={error}
            includeBullets={includeBullets}
            setIncludeBullets={setIncludeBullets}
            bulletLength={bulletLength}
            setBulletLength={setBulletLength}
            handleSubmit={handleSubmit}
          />
          {summary && (
            <SummaryResults
              summary={summary}
              copied={copied}
              copyToClipboard={copyToClipboard}
              resetForm={resetForm}
            />
          )}
          {!summary && <FeaturesSection />}
        </div>
      </div>
    </main>
  );
}
