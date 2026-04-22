/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export default function App() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shake, setShake] = useState(0);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateQuestion = useCallback(() => {
    const isAddition = Math.random() > 0.5;
    let n1, n2, ans;

    if (isAddition) {
      n1 = Math.floor(Math.random() * 900) + 1; // 1-900
      n2 = Math.floor(Math.random() * (1000 - n1)) + 1;
      ans = n1 + n2;
    } else {
      n1 = Math.floor(Math.random() * 999) + 1;
      n2 = Math.floor(Math.random() * n1) + 1;
      ans = n1 - n2;
    }

    setQuestion({ num1: n1, num2: n2, operator: isAddition ? '+' : '-', answer: ans });
    setUserInput('');
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value !== '' && !/^-?\d*$/.test(value)) return;
    
    setUserInput(value);

    if (question && parseInt(value) === question.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        generateQuestion();
      }, 800);
    }
  };

  const checkWrong = () => {
    if (question && userInput !== '' && parseInt(userInput) !== question.answer) {
      setShake(prev => prev + 1);
      setFeedback('wrong');
    }
  };

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [question]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(134, 239, 172, 0.3) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(167, 243, 208, 0.3) 0%, transparent 40%),
          radial-gradient(circle at 50% 80%, rgba(6, 78, 59, 0.1) 0%, transparent 60%),
          #f0fdf4
        `,
      }}
    >
      {/* Dynamic forest elements (simplified abstract watercolor shapes) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
         <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-green-200 blur-3xl" />
         <div className="absolute top-[60%] right-[10%] w-80 h-80 rounded-full bg-emerald-100 blur-3xl" />
         <div className="absolute bottom-[5%] left-[20%] w-96 h-96 rounded-full bg-teal-50 blur-3xl" />
      </div>

      {/* Header Info */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 flex items-center gap-4 bg-white/90 px-8 py-4 rounded-full shadow-md border-2 border-emerald-100"
      >
        <Trophy className="text-yellow-500 w-8 h-8" />
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
          得分: {score}
        </span>
      </motion.div>

      {/* Main Container */}
      <motion.main
        key={shake}
        animate={shake > 0 ? { x: [-12, 12, -12, 12, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="z-10 w-full max-w-2xl px-6"
      >
        <div className="bg-white border-6 border-emerald-100 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Question Display */}
          <div className="text-center mb-8">
            <h1 className="text-emerald-800/30 text-base font-bold tracking-[0.2em] uppercase mb-6">口算小达人</h1>
            <AnimatePresence mode="wait">
              {question && (
                <motion.div
                  key={`${question.num1}-${question.num2}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-4 md:gap-8 text-6xl md:text-7xl font-black text-emerald-950 drop-shadow-sm font-mono"
                >
                  <span className="tabular-nums">{question.num1}</span>
                  <span className="text-emerald-500 shrink-0">{question.operator}</span>
                  <span className="tabular-nums">{question.num2}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="relative flex items-center group w-full justify-center">
              {/* Dinosaur Character */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: feedback === 'correct' ? [0, 360] : feedback === 'wrong' ? [0, -15, 15, 0] : 0,
                  scale: feedback === 'correct' ? 1.3 : 1
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  rotate: { duration: 0.5 },
                  scale: { duration: 0.3 }
                }}
                className="absolute left-[5%] text-6xl md:text-7xl cursor-help select-none z-20 pointer-events-none"
              >
                {feedback === 'correct' ? '🦖✨' : feedback === 'wrong' ? '🦖💔' : '🦖'}
              </motion.div>

              {/* Input Area */}
              <div className="relative z-10 pl-12 md:pl-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onBlur={checkWrong}
                  onKeyDown={(e) => e.key === 'Enter' && checkWrong()}
                  placeholder="?"
                  className="w-48 h-24 md:w-64 md:h-32 text-5xl md:text-6xl text-center bg-emerald-50/50 border-4 border-emerald-200 rounded-[2.5rem] focus:outline-none focus:border-emerald-400 focus:bg-white transition-all font-mono text-emerald-900 shadow-inner"
                />
                
                {/* Success Message Overlay */}
                <AnimatePresence>
                  {feedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1.2, opacity: 1, y: -60 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="flex flex-col items-center text-emerald-600 font-black">
                        <Sparkles className="w-8 h-8 mb-1" />
                        <span className="text-3xl">太棒了!</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Hint / Instruction */}
            <p className="text-emerald-700/50 text-lg font-semibold">输入答案，看我变厉害！</p>
          </div>
        </div>
      </motion.main>

      {/* Decorative Forest Icons */}
      <div className="fixed bottom-0 w-full px-8 py-12 flex justify-between items-end pointer-events-none opacity-20">
        <div className="flex gap-4">
          {[1,2,3].map(i => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
              className="text-6xl"
            >
              🌳
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4">
           {['🦋', '🍄', '🌼'].map((item, i) => (
            <motion.div 
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 + i, ease: "easeInOut" }}
              className="text-4xl"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reset Button (Floating) */}
      <button
        onClick={() => { setScore(0); generateQuestion(); }}
        className="fixed bottom-8 right-8 p-4 bg-white/50 hover:bg-white/80 rounded-full shadow-lg border border-white/20 transition-all group active:scale-95"
      >
        <RotateCcw className="w-6 h-6 text-emerald-700 group-hover:rotate-180 transition-transform duration-500" />
      </button>
    </div>
  );
}
