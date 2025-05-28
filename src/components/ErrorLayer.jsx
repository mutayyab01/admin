import React from "react";
import { Link } from "react-router-dom";

const ErrorLayer = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)] opacity-25"></div>
      <div className="absolute h-48 w-48 rounded-full bg-blue-100 blur-3xl -top-12 -right-12 opacity-30"></div>
      <div className="absolute h-48 w-48 rounded-full bg-purple-100 blur-3xl -bottom-12 -left-12 opacity-30"></div>
      
      <div className="max-w-lg w-full p-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl text-center relative z-10">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src="assets/images/error-img.png" 
            alt="Error illustration" 
            className="mx-auto w-72 h-auto relative animate-float transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .glitch {
            position: relative;
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                         0.025em 0.04em 0 #fffc00;
            animation: glitch 725ms infinite;
          }

          .glitch span {
            position: absolute;
            top: 0;
            left: 0;
          }

          .glitch span:first-child {
            animation: glitch 500ms infinite;
            clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
            transform: translate(-0.04em, -0.03em);
            opacity: 0.75;
          }

          .glitch span:last-child {
            animation: glitch 375ms infinite;
            clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
            transform: translate(0.04em, 0.03em);
            opacity: 0.75;
          }

          @keyframes glitch {
            0% {
              text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                          0.025em 0.04em 0 #fffc00;
            }
            15% {
              text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                          0.025em 0.04em 0 #fffc00;
            }
            16% {
              text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                          -0.05em -0.05em 0 #fffc00;
            }
            49% {
              text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                          -0.05em -0.05em 0 #fffc00;
            }
            50% {
              text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                          0 -0.04em 0 #fffc00;
            }
            99% {
              text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                          0 -0.04em 0 #fffc00;
            }
            100% {
              text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                          -0.04em -0.025em 0 #fffc00;
            }
          }

          .animate-gradient {
            background: linear-gradient(
              to right,
              #ee0979,
              #ff6a00,
              #2af598,
              #ee0979
            );
            background-size: 300% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: gradient 3s linear infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% center; }
            100% { background-position: 300% center; }
          }

          .typing-text {
            overflow: hidden;
            border-right: 2px solid #4B5563;
            white-space: nowrap;
            margin: 0 auto;
            letter-spacing: 0.15em;
            animation: 
              typing 3.5s steps(40, end),
              blink-caret 0.75s step-end infinite;
          }

          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }

          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #4B5563 }
          }
        `}</style>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-4 glitch">
          Oops! 404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4 animate-gradient">
          Page not Found
        </h2>
        
        <p className="text-lg mb-8 typing-text">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl
                     transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
        >
          <svg 
            className="w-6 h-6 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorLayer;
