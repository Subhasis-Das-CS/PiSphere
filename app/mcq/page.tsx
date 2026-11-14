'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ICSE_JAVA_TOPICS, Topic } from './data';

type QuizState = 'selection' | 'setup' | 'active' | 'result';

// Type to track answers randomly across the test
type AnswersRecord = Record<number, { selectedOption: string; isCorrect: boolean }>;

export default function MCQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Flow State
  const [step, setStep] = useState<QuizState>('selection');
  
  // Selection State
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedBoard, setSelectedBoard] = useState('ICSE');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Setup State
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(0); 
  
  // Active Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersRecord>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Derived stats
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const wrongCount = Object.values(answers).filter(a => !a.isCorrect).length;

  // 1. Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Timer Logic
  useEffect(() => {
    if (step === 'active' && timeLeft !== null && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (step === 'active' && timeLeft === 0) {
      finishTest(); 
    }
  }, [timeLeft, step]);

  // 3. Setup fresh quiz
  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setAnswers({});
    setStep('setup');
  };

  const startQuiz = () => {
    if (timeLimitMinutes > 0) {
      setTimeLeft(timeLimitMinutes * 60);
    } else {
      setTimeLeft(null);
    }
    setStep('active');
  };

  // 4. Handle Answer Selection
  const handleOptionSelect = (option: string) => {
    if (!selectedTopic || answers[currentIndex]) return; // Prevent changing answer
    
    const isCorrect = option === selectedTopic.questions[currentIndex].correctAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { selectedOption: option, isCorrect }
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedTopic) return;
    // Find next unanswered question, or just go to next index
    const nextUnanswered = selectedTopic.questions.findIndex((_, idx) => idx > currentIndex && !answers[idx]);
    
    if (nextUnanswered !== -1) {
      setCurrentIndex(nextUnanswered);
    } else if (currentIndex + 1 < selectedTopic.questions.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const finishTest = async () => {
    if (!selectedTopic || !userUid) return;
    
    // Save final result to Firebase
    const resultRef = doc(db, "users", userUid, "mcqResults", `${selectedTopic.id}_${Date.now()}`);
    await setDoc(resultRef, {
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      score: correctCount,
      total: selectedTopic.questions.length,
      date: new Date().toISOString()
    });

    setStep('result');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  const currentQuestionAnswered = answers[currentIndex];

  return (
    <main className="relative min-h-screen bg-[#05050f] text-white font-sans overflow-y-auto flex flex-col p-6">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Nav */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-8 relative z-10">
        <div className="flex gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Dashboard
          </Link>
          {step !== 'selection' && (
            <button onClick={() => setStep('selection')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition border-l border-white/20 pl-4">
              Back to Topics
            </button>
          )}
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          MCQ Solver
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col">
        
        {/* --- STATE 1: SELECTION --- */}
        {step === 'selection' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
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

            <h2 className="text-2xl font-bold mt-8 mb-4">Select a Topic (Java)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ICSE_JAVA_TOPICS.map((topic) => (
                <button 
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  disabled={topic.questions.length === 0}
                  className="text-left p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">{topic.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">{topic.questions.length} Questions Available</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STATE 2: SETUP TIMER --- */}
        {step === 'setup' && selectedTopic && (
          <div className="max-w-md mx-auto w-full bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md animate-fadeIn text-center mt-10">
            <h2 className="text-3xl font-bold mb-2">{selectedTopic.title}</h2>
            <p className="text-gray-400 mb-8">Set an optional time limit for this session.</p>
            
            <label className="text-sm text-gray-300 flex flex-col text-left mb-6">
              Time Limit (Minutes)
              <input 
                type="number" 
                min="0"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="mt-2 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <span className="text-xs text-gray-500 mt-1">Leave as 0 for no time limit.</span>
            </label>

            <button 
              onClick={startQuiz}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/30"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* --- STATE 3: ACTIVE QUIZ --- */}
        {step === 'active' && selectedTopic && (
          <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn h-full">
            
            {/* Left: Questions Area */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md flex flex-col">
              <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-sm text-blue-400 font-bold tracking-widest uppercase">
                  Question {currentIndex + 1}
                </span>
                {timeLeft !== null && (
                  <span className={`font-mono text-lg font-bold px-3 py-1 rounded bg-black/30 border ${timeLeft < 60 ? 'text-red-400 border-red-500/50' : 'text-gray-200 border-white/10'}`}>
                    ⏱ {formatTime(timeLeft)}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-semibold mb-8 leading-relaxed">
                {selectedTopic.questions[currentIndex].text}
              </h3>

              {/* 2x2 Grid for Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                {selectedTopic.questions[currentIndex].options.map((option, idx) => {
                  const isCorrectAnswer = option === selectedTopic.questions[currentIndex].correctAnswer;
                  const isSelected = currentQuestionAnswered?.selectedOption === option;
                  
                  let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50";
                  
                  if (currentQuestionAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = "bg-green-500/20 border-green-500 text-green-300"; // Show correct answer in green
                    } else if (isSelected && !isCorrectAnswer) {
                      btnStyle = "bg-red-500/20 border-red-500 text-red-300 opacity-80"; // Show wrong selection in red
                    } else {
                      btnStyle = "bg-black/20 border-white/5 opacity-30 cursor-not-allowed"; // Fade others
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={!!currentQuestionAnswered}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${btnStyle}`}
                    >
                      <span className="font-mono mr-4 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {currentQuestionAnswered && (
                <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-xl animate-fadeIn flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                      {currentQuestionAnswered.isCorrect ? <span className="text-green-400">✅ Correct!</span> : <span className="text-red-400">❌ Incorrect</span>}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="font-semibold text-white">Explanation:</span> {selectedTopic.questions[currentIndex].explanation}
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleNextQuestion}
                    className="shrink-0 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
                  >
                    Next Question ➔
                  </button>
                </div>
              )}
            </div>

            {/* Right: Interactive Number Grid & Stats */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              
              {/* Question Navigation Palette */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Question Palette</h4>
                <div className="grid grid-cols-5 gap-2">
                  {selectedTopic.questions.map((_, idx) => {
                    const ans = answers[idx];
                    const isCurrent = currentIndex === idx;
                    
                    let boxStyle = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/20"; // Unanswered
                    if (ans) {
                      boxStyle = ans.isCorrect 
                        ? "bg-green-500/80 border-green-400 text-white" 
                        : "bg-red-500/80 border-red-400 text-white";
                    }
                    
                    if (isCurrent) {
                      boxStyle += " ring-2 ring-white ring-offset-2 ring-offset-[#05050f]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-full aspect-square flex items-center justify-center rounded border font-bold text-sm transition-all ${boxStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats & Submit */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md mt-auto">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Questions</span>
                    <span className="font-bold text-white">{selectedTopic.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Answered Correct</span>
                    <span className="font-bold text-green-400">{correctCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Answered Wrong</span>
                    <span className="font-bold text-red-400">{wrongCount}</span>
                  </div>
                </div>
                
                <button 
                  onClick={finishTest}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition shadow-lg shadow-red-500/20"
                >
                  Submit & Finish Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE 4: RESULT SUMMARY --- */}
        {step === 'result' && selectedTopic && (
          <div className="max-w-2xl mx-auto w-full bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md animate-fadeIn text-center mt-10 shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Test Completed!
            </h2>
            <p className="text-gray-400 mb-8">{selectedTopic.title}</p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl">
                <h3 className="text-5xl font-bold text-green-400 mb-2">{correctCount}</h3>
                <p className="text-sm text-green-200">Correct</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                <h3 className="text-5xl font-bold text-red-400 mb-2">{wrongCount}</h3>
                <p className="text-sm text-red-200">Incorrect</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep('selection');
                setSelectedTopic(null);
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition"
            >
              Back to Topics
            </button>
          </div>
        )}

      </div>
    </main>
  );
}