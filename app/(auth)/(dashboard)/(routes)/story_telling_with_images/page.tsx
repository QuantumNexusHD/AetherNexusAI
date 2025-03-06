"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

interface ManifestResponse {
  story: string;
  imageUrl: string;
}

export default function StoryTellingPage() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("512x512");
  const [result, setResult] = useState<ManifestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManifest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/story_telling_with_images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, resolution }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const data: ManifestResponse = await res.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-cyberpunk flex items-start justify-center p-4 overflow-x-hidden overflow-y: auto">
        <div className="max-w-2xl w-full space-y-8 relative">
          <motion.div
            className="absolute top-0 left-1/2 w-16 h-16 bg-indigo-400 rounded-full opacity-30 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/4 right-0 w-24 h-24 border-2 border-dashed border-purple-500 rounded-full opacity-50"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <h1 className="text-4xl font-bold text-cyan-400 text-center font-orbitron relative z-10 neon-title">
            Manifest Your Future
          </h1>
          <p className="text-gray-300 text-center font-orbitron neon-text relative z-10">
            Create vivid stories and images of your dream future.
          </p>
          <div className="space-y-4 relative z-10">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dream future..."
              className="w-full p-3 rounded-lg bg-gray-800/80 border border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-orbitron backdrop-blur-sm"
            />
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800/80 border border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-orbitron backdrop-blur-sm"
            >
              <option value="1792x1024">1792x1024</option>
              <option value="1024x1792">1024x1792</option>
            </select>
            <button
              onClick={handleManifest}
              disabled={loading || !prompt}
              className="w-full p-3 bg-indigo-600 text-white rounded-lg font-orbitron hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Manifesting..." : "Manifest"}
            </button>
          </div>

          {loading && (
            <p className="text-center text-cyan-200 font-orbitron relative z-10 neon-text">
              Manifesting your future...
            </p>
          )}
          {error && (
            <p className="text-center text-red-400 font-orbitron relative z-10 neon-text">
              {error}
            </p>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative p-6 rounded-lg bg-gray-800/80 border border-indigo-500/50 shadow-lg glow-box z-10 backdrop-blur-sm"
            >
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden overflow-y-auto"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {["red", "orange", "yellow", "green", "blue", "purple"].map((color, i) => (
                  <motion.span
                    key={color}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: color, top: `${i * 15}%`, left: "10%" }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
              <p className="text-cyan-200 mb-4 font-orbitron neon-text">{result.story}</p>
              <img src={result.imageUrl} alt="Your Future" className="w-full rounded-lg" />
            </motion.div>
          )}
        </div>

        <style jsx>{`
          .font-orbitron {
            font-family: "Orbitron", sans-serif;
          }
          .glow-box {
            animation: glow 2s infinite alternate;
          }
          .bg-cyberpunk {
            background: linear-gradient(135deg, #0d001a 0%, #1a0033 50%, #330066 100%);
            position: relative;
            overflow: hidden;
          }
          .bg-cyberpunk::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: twinkle 8s infinite;
            pointer-events: none;
          }
          .neon-title {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                         0 0 25px rgba(0, 255, 255, 0.4);
            animation: flicker 3s infinite alternate;
          }
          .neon-text {
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
            animation: glow-text 2s infinite alternate;
          }
          @keyframes glow {
            from { box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
            to { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.4; }
          }
          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                           0 0 25px rgba(0, 255, 255, 0.4);
            }
            20%, 24%, 55% {
              text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3);
            }
          }
          @keyframes glow-text {
            from { text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3); }
            to { text-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 255, 255, 0.5); }
          }
        `}</style>
      </div>
    </>
  );
}