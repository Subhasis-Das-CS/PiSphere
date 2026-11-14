'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function MockTestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedBoard, setSelectedBoard] = useState('ICSE');

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
    return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
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
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">
          Mock Tests
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col space-y-6">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md animate-fadeIn">
          <div className="flex-1">
            <label className="text-xs text-gray-400">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400">Board</label>
            <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
              <option>ICSE</option>
              <option>CBSE</option>
            </select>
          </div>
        </div>

        {/* Empty State / Coming Soon */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md flex flex-col items-center justify-center text-center mt-4">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">No Mock Tests Available Yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Full-length, timed mock tests for {selectedBoard} {selectedClass} are currently being prepared by our educators. Check back soon!
          </p>
          
          <Link 
            href="/mcq"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/30"
          >
            Practice Topic-wise MCQs Instead
          </Link>
        </div>

      </div>
    </main>
  );
}