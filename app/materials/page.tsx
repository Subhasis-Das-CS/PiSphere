'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function MaterialsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#05050f] text-white font-sans overflow-y-auto flex flex-col p-6">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Nav */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-8 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Dashboard
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Study Materials
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center">
        
        {/* Coming Soon Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 backdrop-blur-xl flex flex-col items-center justify-center text-center max-w-2xl w-full shadow-2xl animate-fadeIn">
          
          {/* Document Icon */}
          <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 transform -rotate-3">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Library Under Construction
          </h2>
          
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            We are currently formatting and branding high-quality study materials, notes, and cheat sheets for your curriculum. They will be available for download here soon.
          </p>
          
          <Link 
            href="/dashboard"
            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            Back to Dashboard
          </Link>
          
        </div>

      </div>
    </main>
  );
}