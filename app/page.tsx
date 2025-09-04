import { Button } from "@/components/ui/button";
import {
  Play,
  Clock,
  FileText,
  Download,
  Share2,
  Bookmark,
  Copy,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
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
          {/* Main Input Form */}
        </div>
      </div>
    </main>
  );
}
