import React from "react";

export const AnimatedSystemSvg: React.FC = () => {
  return (
    <div className="w-full max-w-[600px] xl:max-w-[700px] aspect-square relative flex items-center justify-center scale-110 lg:scale-125 2xl:scale-150 transition-transform duration-700">
      {/* Inline styles for custom animations */}
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotateX(60deg) rotateZ(-45deg); }
            50% { transform: translateY(-20px) rotateX(60deg) rotateZ(-45deg); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0) translateZ(50px); }
            50% { transform: translateY(-15px) translateZ(50px); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0) translateZ(80px); }
            50% { transform: translateY(-10px) translateZ(80px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0) translateZ(60px); }
            50% { transform: translateY(-12px) translateZ(60px); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
          @keyframes dash-flow {
            to { stroke-dashoffset: -100; }
          }
          .iso-base {
            transform: rotateX(60deg) rotateZ(-45deg);
            transform-style: preserve-3d;
          }
          .iso-card {
            transform: translateZ(30px);
            transition: all 0.5s ease;
          }
          .iso-card:hover {
            transform: translateZ(50px) scale(1.05);
          }
        `}
      </style>

      {/* SVG Container */}
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ perspective: "1000px" }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="currentColor"
              className="text-primary"
            />
            <stop
              offset="100%"
              stopColor="currentColor"
              className="text-primary/70"
            />
          </linearGradient>

          {/* Shadows */}
          <filter id="shadow-lg" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="20"
              stdDeviation="20"
              floodColor="#000000"
              floodOpacity="0.15"
            />
          </filter>
          <filter id="shadow-md" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="-10"
              dy="15"
              stdDeviation="15"
              floodColor="#000000"
              floodOpacity="0.1"
            />
          </filter>
        </defs>

        {/* Isometric Group */}
        <g
          style={{
            animation: "float-slow 8s ease-in-out infinite",
            transformOrigin: "center",
          }}
          className="iso-base"
        >
          {/* Base Platform */}
          <rect
            x="150"
            y="150"
            width="500"
            height="500"
            rx="40"
            fill="url(#base-grad)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            filter="url(#shadow-lg)"
          />

          {/* Base Radar / Glowing Rings */}
          <circle
            cx="400"
            cy="400"
            r="180"
            fill="none"
            stroke="currentColor"
            className="text-primary/10"
            strokeWidth="2"
            style={{ animation: "pulse-glow 6s infinite" }}
          />
          <circle
            cx="400"
            cy="400"
            r="230"
            fill="none"
            stroke="currentColor"
            className="text-primary/5"
            strokeWidth="1"
            style={{ animation: "pulse-glow 6s infinite 2s" }}
          />

          {/* Grid lines on base */}
          <path
            d="M 250 150 L 250 650 M 350 150 L 350 650 M 450 150 L 450 650 M 550 150 L 550 650"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <path
            d="M 150 250 L 650 250 M 150 350 L 650 350 M 150 450 L 650 450 M 150 550 L 650 550"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />

          {/* Dashboard Card 1 (Top Left) */}
          <g
            style={{ animation: "float-medium 6s ease-in-out infinite 0.5s" }}
            className="iso-card"
          >
            <rect
              x="200"
              y="200"
              width="220"
              height="180"
              rx="20"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            {/* Header */}
            <circle
              cx="230"
              cy="230"
              r="12"
              fill="currentColor"
              className="text-primary/20"
            />
            <circle
              cx="230"
              cy="230"
              r="6"
              fill="currentColor"
              className="text-primary"
            />
            <rect
              x="255"
              y="225"
              width="80"
              height="10"
              rx="5"
              fill="#e2e8f0"
            />
            {/* Chart Bars */}
            <rect
              x="220"
              y="270"
              width="25"
              height="80"
              rx="4"
              fill="#cbd5e1"
            />
            <rect
              x="255"
              y="300"
              width="25"
              height="50"
              rx="4"
              fill="#94a3b8"
            />
            <rect
              x="290"
              y="250"
              width="25"
              height="100"
              rx="4"
              fill="currentColor"
              className="text-primary"
            />
            <rect
              x="325"
              y="280"
              width="25"
              height="70"
              rx="4"
              fill="#94a3b8"
            />
            <rect
              x="360"
              y="240"
              width="25"
              height="110"
              rx="4"
              fill="#cbd5e1"
            />
          </g>

          {/* Data Card 2 (Bottom Left) */}
          <g
            style={{ animation: "float-fast 7s ease-in-out infinite 1s" }}
            className="iso-card"
          >
            <rect
              x="200"
              y="420"
              width="220"
              height="120"
              rx="20"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            {/* Circular Progress */}
            <circle
              cx="260"
              cy="480"
              r="30"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="260"
              cy="480"
              r="30"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="8"
              strokeDasharray="188"
              strokeDashoffset="50"
              strokeLinecap="round"
              transform="rotate(-90 260 480)"
            />
            {/* Lines */}
            <rect x="310" y="460" width="80" height="8" rx="4" fill="#e2e8f0" />
            <rect x="310" y="480" width="60" height="8" rx="4" fill="#cbd5e1" />
            <rect x="310" y="500" width="40" height="8" rx="4" fill="#94a3b8" />
          </g>

          {/* Floating Analytics Card (Right side) */}
          <g
            style={{ animation: "float-medium 9s ease-in-out infinite 1.5s" }}
            className="iso-card"
          >
            <rect
              x="460"
              y="250"
              width="160"
              height="250"
              rx="20"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            {/* Line Chart */}
            <path
              d="M 480 400 L 510 380 L 540 390 L 570 330 L 600 350"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="570"
              cy="330"
              r="6"
              fill="currentColor"
              className="text-primary"
            />
            {/* Data rows */}
            <rect
              x="480"
              y="430"
              width="120"
              height="12"
              rx="6"
              fill="#e2e8f0"
            />
            <rect
              x="480"
              y="455"
              width="90"
              height="12"
              rx="6"
              fill="#cbd5e1"
            />
          </g>

          {/* Floating UI Element (Top Right) */}
          <g
            style={{ animation: "float-fast 5s ease-in-out infinite 2s" }}
            className="iso-card"
          >
            <rect
              x="480"
              y="120"
              width="180"
              height="80"
              rx="16"
              fill="currentColor"
              className="text-primary"
              filter="url(#shadow-md)"
            />
            <circle cx="520" cy="160" r="16" fill="#ffffff" opacity="0.3" />
            <rect
              x="550"
              y="150"
              width="80"
              height="8"
              rx="4"
              fill="#ffffff"
              opacity="0.8"
            />
            <rect
              x="550"
              y="165"
              width="50"
              height="6"
              rx="3"
              fill="#ffffff"
              opacity="0.5"
            />
          </g>

          {/* New Element: Floating Server/Database Stack (Bottom Right) */}
          <g
            style={{ animation: "float-delayed 8s ease-in-out infinite 0.7s" }}
            className="iso-card"
          >
            {/* Layer 1 */}
            <rect
              x="500"
              y="550"
              width="120"
              height="40"
              rx="8"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            <circle
              cx="520"
              cy="570"
              r="4"
              fill="currentColor"
              className="text-primary"
            />
            <rect x="540" y="566" width="60" height="8" rx="4" fill="#e2e8f0" />
            {/* Layer 2 */}
            <rect
              x="500"
              y="490"
              width="120"
              height="40"
              rx="8"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            <circle
              cx="520"
              cy="510"
              r="4"
              fill="currentColor"
              className="text-primary"
            />
            <rect x="540" y="506" width="40" height="8" rx="4" fill="#e2e8f0" />
            {/* Layer 3 (Active) */}
            <rect
              x="500"
              y="430"
              width="120"
              height="40"
              rx="8"
              fill="currentColor"
              className="text-primary"
              filter="url(#shadow-md)"
            />
            <circle
              cx="520"
              cy="450"
              r="4"
              fill="#ffffff"
              style={{ animation: "pulse-glow 2s infinite" }}
            />
            <rect
              x="540"
              y="446"
              width="50"
              height="8"
              rx="4"
              fill="#ffffff"
              opacity="0.6"
            />
          </g>

          {/* New Element: Mini Metric Card (Top Center) */}
          <g
            style={{ animation: "float-fast 4.5s ease-in-out infinite 0.2s" }}
            className="iso-card"
          >
            <rect
              x="300"
              y="100"
              width="140"
              height="60"
              rx="12"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            <path
              d="M 320 140 L 340 120 L 350 130 L 370 110"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect
              x="390"
              y="120"
              width="30"
              height="8"
              rx="4"
              fill="#10b981"
              opacity="0.2"
            />
            <rect x="390" y="135" width="40" height="6" rx="3" fill="#cbd5e1" />
          </g>

          {/* New Element: Floating User Profile (Far Left) */}
          <g
            style={{
              animation: "float-delayed 7.5s ease-in-out infinite 1.2s",
            }}
            className="iso-card"
          >
            <rect
              x="60"
              y="300"
              width="100"
              height="120"
              rx="16"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            <circle cx="110" cy="340" r="20" fill="#e2e8f0" />
            <path
              d="M 90 390 Q 110 360 130 390"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <rect x="85" y="405" width="50" height="6" rx="3" fill="#94a3b8" />
          </g>

          {/* New Element: Sales Document/Receipt (Bottom Center) */}
          <g
            style={{ animation: "float-fast 6s ease-in-out infinite 3s" }}
            className="iso-card"
          >
            <path
              d="M 360 520 L 460 520 L 460 660 L 440 640 L 420 660 L 400 640 L 380 660 L 360 640 Z"
              fill="url(#card-grad)"
              filter="url(#shadow-md)"
            />
            <rect x="380" y="540" width="60" height="8" rx="2" fill="#94a3b8" />
            <rect x="380" y="560" width="80" height="6" rx="2" fill="#cbd5e1" />
            <rect x="380" y="575" width="70" height="6" rx="2" fill="#cbd5e1" />
            <rect x="380" y="590" width="80" height="6" rx="2" fill="#cbd5e1" />
            <circle
              cx="430"
              cy="615"
              r="12"
              fill="currentColor"
              className="text-primary"
              opacity="0.2"
            />
            <circle
              cx="430"
              cy="615"
              r="6"
              fill="currentColor"
              className="text-primary"
            />
          </g>

          {/* New Element: Network Node Cluster (Top Center/Left) */}
          <g
            style={{ animation: "float-delayed 9s ease-in-out infinite 1.5s" }}
            className="iso-card"
          >
            {/* Lines */}
            <path
              d="M 120 180 L 180 140 L 240 180 L 180 220 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d="M 180 140 L 180 220"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d="M 120 180 L 240 180"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Nodes */}
            <circle
              cx="120"
              cy="180"
              r="8"
              fill="currentColor"
              className="text-primary"
            />
            <circle cx="240" cy="180" r="8" fill="#3b82f6" />
            <circle cx="180" cy="140" r="8" fill="#10b981" />
            <circle
              cx="180"
              cy="220"
              r="10"
              fill="url(#card-grad)"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="3"
            />
            <circle
              cx="180"
              cy="220"
              r="4"
              fill="currentColor"
              className="text-primary"
              style={{ animation: "pulse-glow 2s infinite" }}
            />
          </g>

          {/* Micro-Chips / Logic Gates */}
          <g
            style={{ animation: "float-medium 4s ease-in-out infinite 2.5s" }}
            className="iso-card"
          >
            <rect
              x="620"
              y="160"
              width="40"
              height="40"
              rx="8"
              fill="#1e293b"
              filter="url(#shadow-md)"
            />
            <rect
              x="630"
              y="170"
              width="20"
              height="20"
              rx="4"
              fill="currentColor"
              className="text-primary"
            />
            {/* Pins */}
            <rect x="615" y="170" width="10" height="4" fill="#94a3b8" />
            <rect x="615" y="180" width="10" height="4" fill="#94a3b8" />
            <rect x="615" y="190" width="10" height="4" fill="#94a3b8" />
            <rect x="655" y="170" width="10" height="4" fill="#94a3b8" />
            <rect x="655" y="180" width="10" height="4" fill="#94a3b8" />
            <rect x="655" y="190" width="10" height="4" fill="#94a3b8" />
          </g>

          <g
            style={{ animation: "float-fast 5.5s ease-in-out infinite 0.8s" }}
            className="iso-card"
          >
            <rect
              x="250"
              y="600"
              width="60"
              height="40"
              rx="8"
              fill="#1e293b"
              filter="url(#shadow-md)"
            />
            <rect
              x="260"
              y="610"
              width="40"
              height="20"
              rx="4"
              fill="#10b981"
            />
            <circle
              cx="280"
              cy="620"
              r="4"
              fill="#ffffff"
              style={{ animation: "pulse-glow 1.5s infinite" }}
            />
          </g>

          {/* Floating Glowing Particles (Massively Increased) */}
          <circle
            cx="150"
            cy="180"
            r="6"
            fill="currentColor"
            className="text-primary"
            style={{ animation: "pulse-glow 3s infinite 0s" }}
            transform="translateZ(90px)"
          />
          <circle
            cx="650"
            cy="220"
            r="4"
            fill="#10b981"
            style={{ animation: "pulse-glow 4s infinite 1s" }}
            transform="translateZ(70px)"
          />
          <circle
            cx="450"
            cy="620"
            r="8"
            fill="currentColor"
            className="text-primary"
            style={{ animation: "pulse-glow 2.5s infinite 0.5s" }}
            transform="translateZ(100px)"
          />
          <circle
            cx="280"
            cy="380"
            r="5"
            fill="#3b82f6"
            style={{ animation: "pulse-glow 3.5s infinite 2s" }}
            transform="translateZ(120px)"
          />

          <circle
            cx="350"
            cy="250"
            r="3"
            fill="#f59e0b"
            style={{ animation: "pulse-glow 2s infinite 0.3s" }}
            transform="translateZ(150px)"
          />
          <circle
            cx="580"
            cy="480"
            r="7"
            fill="currentColor"
            className="text-primary"
            style={{ animation: "pulse-glow 5s infinite 1.2s" }}
            transform="translateZ(80px)"
          />
          <circle
            cx="180"
            cy="520"
            r="4"
            fill="#8b5cf6"
            style={{ animation: "pulse-glow 3s infinite 0.7s" }}
            transform="translateZ(110px)"
          />
          <circle
            cx="500"
            cy="180"
            r="5"
            fill="#ec4899"
            style={{ animation: "pulse-glow 4.5s infinite 2.5s" }}
            transform="translateZ(140px)"
          />
          <circle
            cx="680"
            cy="380"
            r="6"
            fill="#14b8a6"
            style={{ animation: "pulse-glow 2.8s infinite 1.8s" }}
            transform="translateZ(95px)"
          />
          <circle
            cx="220"
            cy="120"
            r="4"
            fill="currentColor"
            className="text-primary"
            style={{ animation: "pulse-glow 3.2s infinite 0.9s" }}
            transform="translateZ(130px)"
          />
          <circle
            cx="380"
            cy="680"
            r="5"
            fill="#f43f5e"
            style={{ animation: "pulse-glow 4s infinite 1.5s" }}
            transform="translateZ(60px)"
          />

          {/* Connecting Animated Data Lines (Massively Increased Web) */}
          <path
            d="M 310 200 L 310 150 L 520 150 L 520 120"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray="10 10"
            style={{ animation: "dash-flow 2s linear infinite" }}
            transform="translateZ(40px)"
          />
          <path
            d="M 420 300 L 460 300 L 460 250"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="4"
            strokeDasharray="8 8"
            style={{ animation: "dash-flow 1.5s linear infinite reverse" }}
            transform="translateZ(35px)"
          />
          <path
            d="M 160 360 L 200 360 L 200 480 L 260 480"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="6 6"
            style={{ animation: "dash-flow 3s linear infinite" }}
            transform="translateZ(20px)"
          />
          <path
            d="M 520 430 L 520 380 L 600 380"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            opacity="0.4"
            strokeWidth="3"
            strokeDasharray="5 5"
            style={{ animation: "dash-flow 2.5s linear infinite reverse" }}
            transform="translateZ(45px)"
          />

          {/* New Deep Network Connections */}
          <path
            d="M 280 620 L 360 620 L 360 520"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
            style={{ animation: "dash-flow 4s linear infinite" }}
            transform="translateZ(25px)"
          />
          <path
            d="M 640 180 L 640 250 L 580 250"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="8 4"
            style={{ animation: "dash-flow 2.2s linear infinite reverse" }}
            transform="translateZ(55px)"
          />
          <path
            d="M 180 220 L 180 300 L 250 300 L 250 250"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeDasharray="12 6"
            style={{ animation: "dash-flow 1.8s linear infinite" }}
            transform="translateZ(65px)"
          />
          <path
            d="M 400 130 L 400 250 L 360 250"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 10"
            style={{ animation: "dash-flow 3.5s linear infinite reverse" }}
            transform="translateZ(85px)"
          />
        </g>
      </svg>
    </div>
  );
};
