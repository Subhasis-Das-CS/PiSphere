'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen bg-[#05050f] text-white font-sans overflow-hidden flex">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      {/* --- MOBILE OVERLAY --- */}
      {/* Darkens the background when the sidebar is open on smaller screens */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SLIDING SIDEBAR NAVIGATION --- */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a16]/80 backdrop-blur-2xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            PiSphere
          </h2>
          {/* Close button for mobile */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium border border-white/5">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </Link>
          <Link href="/materials" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Study Materials
          </Link>
          <Link href="/mcq" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            MCQ Practice
          </Link>
          <Link href="/tests" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Mock Tests
          </Link>
          <Link href="/forum" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            Community Forum
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 min-h-screen flex flex-col lg:ml-64 relative z-10 transition-all duration-300">
        
      {/* Top Header (Hamburger & Profile) */}
        <header className="sticky top-0 z-30 bg-[#05050f]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-md text-gray-300 hover:text-white border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-xl font-semibold">Overview</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-gray-400">Student Profile</span>
            {/* Wrapped the profile icon in a Link to /profile */}
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-110 transition-transform">
                P
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Grid */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Welcome Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Welcome back, Student!</h2>
              <p className="text-gray-400">Ready to conquer your syllabus today?</p>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs text-purple-300 uppercase font-bold tracking-wider">Current Streak</p>
                <p className="text-lg font-bold text-white">5 Days</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
              <p className="text-sm text-gray-400 mb-2">Total Questions Solved</p>
              <h3 className="text-4xl font-extrabold text-blue-400">142</h3>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
              <p className="text-sm text-gray-400 mb-2">Average Accuracy</p>
              <h3 className="text-4xl font-extrabold text-green-400">85%</h3>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
              <p className="text-sm text-gray-400 mb-2">Mock Tests Completed</p>
              <h3 className="text-4xl font-extrabold text-purple-400">3</h3>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <h3 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <button className="group text-left p-5 bg-gradient-to-br from-blue-900/40 to-blue-600/10 border border-blue-500/20 rounded-xl hover:border-blue-500/50 transition">
              <h4 className="text-lg font-bold text-blue-300 mb-1">Resume Physics MCQ</h4>
              <p className="text-sm text-gray-400">Kinematics • 10 questions left</p>
            </button>

            <button className="group text-left p-5 bg-gradient-to-br from-purple-900/40 to-purple-600/10 border border-purple-500/20 rounded-xl hover:border-purple-500/50 transition">
              <h4 className="text-lg font-bold text-purple-300 mb-1">Take a Mock Test</h4>
              <p className="text-sm text-gray-400">Full syllabus • 90 mins</p>
            </button>

            <button className="group text-left p-5 bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition">
              <h4 className="text-lg font-bold text-yellow-300 mb-1">Ask the Community</h4>
              <p className="text-sm text-gray-400">Stuck? Get help instantly.</p>
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}