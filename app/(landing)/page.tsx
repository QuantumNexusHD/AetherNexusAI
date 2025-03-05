"use client"; // Mark as Client Component

import { Button } from "@/components/ui/button";
import Link from "next/link";

// Cube component for rotating 3D cubes
const Cube = ({ size, top, left, speed }: { size: number; top: string; left: string; speed: number }) => {
  const faceStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: "absolute" as const,
    background: "rgba(0, 255, 255, 0.2)", // Semi-transparent cyan
    border: "1px solid #00ffff",
  };

  return (
    <div className="cube-wrapper" style={{ top, left }}>
      <div
        className="cube"
        style={{ width: `${size}px`, height: `${size}px`, animationDuration: `${speed}s` }}
      >
        <div className="face front" style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }}></div>
        <div className="face back" style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size / 2}px)` }}></div>
        <div className="face left" style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}></div>
        <div className="face right" style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size / 2}px)` }}></div>
        <div className="face top" style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size / 2}px)` }}></div>
        <div className="face bottom" style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size / 2}px)` }}></div>
      </div>
    </div>
  );
};

// Ship component for animated ships
const Ship = ({ top, speed, direction }: { top: string; speed: number; direction: string }) => {
  return (
    <div className={`ship ${direction}`} style={{ top, animationDuration: `${speed}s` }}>
        {<img src="/ship.png" alt="Ship" style={{ width: '100%', height: '100%' }} /> }
    </div>
  );
};

// Main LandingPage component
const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Background elements */}
      <Cube size={100} top="20%" left="10%" speed={10} />
      <Cube size={80} top="60%" left="80%" speed={15} />
      <Ship top="30%" speed={20} direction="left-to-right" />
      <Ship top="70%" speed={25} direction="right-to-left" />

      {/* Foreground content */}
      <div className="content">
        <h1>Landing Page (Unprotected)</h1>
        <div className="button-group">
          <Link href="/sign-in">
            <Button className="neon-button">Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="neon-button">Register</Button>
          </Link>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .landing-container {
          position: relative;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url('/majestic_city.avif');
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .cube-wrapper {
          position: absolute;
        }

        .cube {
          position: relative;
          transform-style: preserve-3d;
          animation: rotate linear infinite;
        }

        .face {
          position: absolute;
        }

        .ship {
          position: absolute;
          width: 100px;
          height: 50px;
          background: #00ffff; /* Cyan placeholder */
          color: #000;
          text-align: center;
          line-height: 50px;
        }

        .ship.left-to-right {
          left: -100px;
          animation: fly-left-to-right linear infinite;
        }

        .ship.right-to-left {
          right: -100px;
          animation: fly-right-to-left linear infinite;
        }

        .content {
          text-align: center;
          z-index: 1;
        }

        h1 {
          color: #ffffff;
          text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff; /* Neon glow */
          font-size: 3rem;
          font-family: 'Arial', sans-serif; /* Adjust font if needed */
        }

        .button-group {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .neon-button {
          padding: 15px 30px;
          font-size: 18px;
          background-color: transparent;
          border: 2px solid #00ffff;
          color: #00ffff;
          text-transform: uppercase;
          transition: all 0.3s;
        }

        .neon-button:hover {
          background-color: #00ffff;
          color: #000;
          box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; /* Glow effect */
        }

        @keyframes rotate {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes fly-left-to-right {
          from { transform: translateX(0); }
          to { transform: translateX(calc(100vw + 100px)); }
        }

        @keyframes fly-right-to-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100vw - 100px)); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;