"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, ImageIcon, MessageSquare } from "lucide-react";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Manifest your Dreams with Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mb-8 space-y-4 pt-12">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-cyan-400 neon-title">
          Explore the Power of AI
        </h2>
        <p className="text-gray-300 font-light text-sm md:text-lg text-center neon-text">
          Experience the future of AI today with AI-generated media, storytelling, code, or text.
        </p>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool) => (
            <Card
              key={tool.href}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer bg-gray-800/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold text-white">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </Card>
          ))}
        </div>
      </div>

      {/* Inline Styles for Neon Effects */}
      <style jsx>{`
        .neon-title {
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                       0 0 25px rgba(0, 255, 255, 0.4);
          animation: flicker 3s infinite alternate;
        }

        .neon-text {
          text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
          animation: glow 2s infinite alternate;
        }

        @keyframes flicker {
          0%,
          19%,
          21%,
          23%,
          25%,
          54%,
          56%,
          100% {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                         0 0 25px rgba(0, 255, 255, 0.4);
          }
          20%,
          24%,
          55% {
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
          }
          to {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 255, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;