import {
  Play,
  Clock,
  Download,
  Share2,
  Bookmark,
  Copy,
  Check,
} from "lucide-react";

interface SummaryResultProp {
  summary: {
    title: string;
    channel: string;
    duration: string;
    views: string;
    thumbnail: string;
    keyPoints?: string[] | null;
    fullSummary: string;
  } | null;
  copied: boolean;
  copyToClipboard: () => void;
  resetForm: () => void;
}

const SummaryResults = ({
  summary,
  copied,
  copyToClipboard,
  resetForm,
}: SummaryResultProp) => {
  if (!summary) {
    return null;
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Video Info Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={summary.thumbnail}
            alt="Video thumbnail"
            className="w-full md:w-48 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {summary.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {summary.channel}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {summary.duration}
              </span>
              <span>{summary.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Summary</h3>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Summary Display */}
        <div className="space-y-6">
          {/* Main Summary */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Summary
            </h4>
            <p className="text-gray-700 leading-relaxed text-lg">
              {summary.fullSummary}
            </p>
          </div>

          {/* Key Points */}
          {summary.keyPoints && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Key Points
              </h4>
              <ul className="space-y-3">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            <Bookmark className="w-4 h-4" />
            Save
          </button>
        </div>
        <button
          onClick={resetForm}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Summarize Another Video
        </button>
      </div>
    </div>
  );
};

export default SummaryResults;
