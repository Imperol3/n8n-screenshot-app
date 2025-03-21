"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResults] = useState<object | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchScreenshot() {
    setLoading(true);
    const res = await fetch("/api/scraper", {
      method: "POST",
      body: JSON.stringify({
        siteUrl: "https://n8n.victorkituku.dev",
      }),
    });
    const data = await res.json();
    setScreenshot(data.screenshot);
    setResults(data); // Store full result in state if needed
    setLoading(false);
  }

  function downloadScreenshot() {
    if (!screenshot) return;

    const link = document.createElement("a");
    link.href = screenshot;
    link.download = "screenshot.png"; // Filename for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-8">n8n Scraper</h1>
          <p className="mb-2">Click the button to test out your new scraper.</p>

          <p className="mb-6">
            <button
              className="btn btn-primary"
              onClick={fetchScreenshot}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Screenshot"}
            </button>
          </p>

          {loading && <p>Processing screenshot...</p>}

          {screenshot && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Captured Screenshot:</h3>
              <img
                src={screenshot}
                alt="Website Screenshot"
                className="border border-gray-300 rounded-lg shadow-lg max-w-full"
              />
            </div>
          )}

          <button
            className="btn btn-secondary mt-4"
            onClick={downloadScreenshot}
          >
            Download Screenshot
          </button>

          {result && (
            <div className="mt-6 text-left">
              <h3 className="text-xl font-bold mb-2">Scraper Result:</h3>
              <pre className="bg-zinc-200 text-left py-4 px-5 rounded overflow-x-scroll">
                <code>{JSON.stringify(result, undefined, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
