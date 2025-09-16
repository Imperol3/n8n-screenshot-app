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
        </div>
      </div>
    </main>
  );
}
