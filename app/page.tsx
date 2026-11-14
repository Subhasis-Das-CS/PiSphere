import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#05050f] flex flex-col items-center justify-center overflow-hidden text-white font-sans">
      
      {/* --- Dynamic Background Graphics --- */}
      {/* Purple Glowing Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse" />
      {/* Blue Glowing Orb */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-800 rounded-full mix-blend-screen filter blur-[150px] opacity-30" />
      {/* Center Subtle Deep Blue Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-indigo-900 rounded-full mix-blend-screen filter blur-[150px] opacity-20" />

      {/* --- Main Content Container --- */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl space-y-6">
        
        {/* Hero Title Block */}
        <div className="relative flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              PiSphere
            </span>
          </h1>
          
          {/* Branding - Bottom Right of the Title */}
          <div className="w-full flex justify-end mt-2 pr-2">
            <p className="text-xs md:text-sm font-medium tracking-wider text-gray-400 opacity-70">
              By <span className="text-purple-400 font-semibold">Pi and PIxels</span> • Subhasis Das
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mt-4">
          The ultimate digital learning ecosystem. Master your curriculum with dynamic mock tests, topic-wise MCQs, and collaborate instantly in a thriving student community.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-10 pt-4">
          
          {/* Login Button (Glassmorphism Outline) */}
          <Link 
            href="/login" 
            className="group relative px-8 py-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-200 font-semibold text-lg hover:bg-white/10 hover:border-purple-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
          >
            Login to Account
          </Link>
          
          {/* Sign Up Button (Glowing Gradient) */}
          <Link 
            href="/signup" 
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:opacity-90 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-105 transition-all duration-300"
          >
            Create an Account
          </Link>
          
        </div>
      </div>

      {/* Decorative Grid Overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
    </main>
  );
}