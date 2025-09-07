import { AlertCircle, FileText, Loader2 } from "lucide-react";

interface InputFormProp {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string;
  includeBullets: boolean;
  setIncludeBullets: (include: boolean) => void;
  bulletLength: string;
  setBulletLength: (length: string) => void;
  handleSubmit: () => void;
}

const InputForm = ({
  url,
  setUrl,
  isLoading,
  error,
  includeBullets,
  setIncludeBullets,
  bulletLength,
  setBulletLength,
  handleSubmit,
}: InputFormProp) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
    <div className="space-y-6">
      <div>
        <label
          htmlFor="youtube-url"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          YouTube Video URL
        </label>
        <div className="relative">
          <input
            id="youtube-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-0 transition-colors text-lg"
            disabled={isLoading}
          />
          {error && (
            <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeBullets}
              onChange={(e) => setIncludeBullets(e.target.checked)}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
              disabled={isLoading}
            />
            <span className="text-sm font-semibold text-gray-700">
              Include bullet points
            </span>
          </label>
        </div>

        {includeBullets && (
          <div className="ml-7">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Bullet points detail level
            </label>
            <div className="flex gap-2">
              {[
                { value: "short", label: "Short", desc: "3-4 points" },
                { value: "medium", label: "Medium", desc: "5-7 points" },
                { value: "detailed", label: "Detailed", desc: "8+ points" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBulletLength(option.value)}
                  disabled={isLoading}
                  className={`flex-1 p-3 text-sm rounded-lg border-2 transition-all ${
                    bulletLength === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Video...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Generate Summary
          </>
        )}
      </button>
    </div>
  </div>
);
export default InputForm;
