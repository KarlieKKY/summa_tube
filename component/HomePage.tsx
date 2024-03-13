"use client";
import { useState } from "react";

export default function HomePage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Chat with any YouTube Video</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
          Join millions of students, researchers and professionals to instantly
          answer questions and understand content with AI
        </p>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div>
              <label
                htmlFor="youtube_url"
                className="block text-sm font-medium text-gray-700"
              >
                Enter YouTube URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="youtube_url"
                  id="youtube_url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Chat with Video
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
