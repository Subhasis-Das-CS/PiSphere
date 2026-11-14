'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

// Pre-defined set of avatars for the student to choose from
const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Destiny&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Oreo&backgroundColor=d1d4f9",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Avatar Modal States
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user details from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          // Set default avatar if they haven't chosen one yet
          setSelectedAvatar(data.avatarUrl || PREDEFINED_AVATARS[0]);
        }
        setLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveAvatar = async () => {
    if (!auth.currentUser) return;
    setSavingAvatar(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        avatarUrl: selectedAvatar
      });
      // Update local state so the UI refreshes instantly
      setProfile((prev: any) => ({ ...prev, avatarUrl: selectedAvatar }));
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar. Please try again.");
    }
    setSavingAvatar(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#05050f] text-white font-sans overflow-hidden flex flex-col items-center p-6">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Navigation Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Student Profile
        </h1>
      </div>

      {/* Main Profile Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="flex flex-col items-center md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <img 
              src={profile?.avatarUrl || PREDEFINED_AVATARS[0]} 
              alt="Profile Avatar" 
              className="w-32 h-32 rounded-full border-4 border-white/10 shadow-lg object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-semibold">Change Avatar</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-4 text-center">{profile?.name}</h2>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              {profile?.board}
            </span>
            <span className="px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              {profile?.studentClass}
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="flex-1 space-y-6">
          <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-gray-300">Account Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <p className="text-sm font-medium text-white">{profile?.email || "Not Provided"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-sm font-medium text-white">{profile?.phone || "Not Provided"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">School Name</p>
              <p className="text-sm font-medium text-white">{profile?.schoolName || "Not Provided"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Member Since</p>
              <p className="text-sm font-medium text-white">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Just now"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm font-medium text-white">{profile?.address || "Not Provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- AVATAR SELECTION MODAL --- */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative">
            
            <button 
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl font-bold mb-2">Choose an Avatar</h3>
            <p className="text-sm text-gray-400 mb-6">Select a profile picture from our verified collection.</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
              {PREDEFINED_AVATARS.map((avatarUrl, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${
                    selectedAvatar === avatarUrl 
                      ? 'border-purple-500 bg-purple-500/20 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <img src={avatarUrl} alt={`Avatar option ${index + 1}`} className="w-full h-auto rounded-lg" />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAvatar}
                disabled={savingAvatar}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {savingAvatar ? "Saving..." : "Save Selection"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}