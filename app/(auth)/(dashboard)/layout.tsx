"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative overflow-hidden bg-cyberpunk">
      {/* Animated Cyberpunk City Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-cityscape opacity-60"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Neon Grid Overlay */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Floating Lights */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-neon rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#ff00ff", "#00ffff", "#ffaa00", "#00ff00"][i % 4],
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* 3D Animated Objects */}
      {/* Holographic Cube */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 border-2 border-cyan-400 opacity-50"
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Rotating Helix */}
      <motion.div
        className="absolute bottom-20 right-20 w-20 h-20 border-2 border-dashed border-purple-500 rounded-full opacity-60"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900/80 backdrop-blur-md border-r border-indigo-500/50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="md:pl-72 relative z-10">
        <Navbar />
        <div className="relative">
          {/* Glowing Neon Line Accent */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          {children}
        </div>
      </main>

      {/* Inline Styles */}
      <style jsx>{`
        .bg-cyberpunk {
          background: linear-gradient(
            135deg,
            #0d001a 0%,
            #1a0033 50%,
            #330066 100%
          );
          position: relative;
        }
        .bg-cityscape {
          background: url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3")
            no-repeat center center;
          background-size: cover;
          height: 200%;
          transform: translateY(-50%);
        }
        .bg-grid {
          background: linear-gradient(
              to right,
              rgba(0, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-neon {
          box-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;