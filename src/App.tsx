/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, XCircle, Calculator, Trophy } from 'lucide-react';

// Macaron-inspired color palette
const COLORS = {
  bg: 'bg-[#F9F1F0]', // Soft pink-white
  card: 'bg-white',
  primary: 'bg-[#FAD0C4]', // Macaron Pink
  secondary: 'bg-[#AEC6CF]', // Pastel Blue
  success: 'bg-[#77DD77]', // Pastel Green
  error: 'bg-[#FF6961]', // Pastel Red
  text: 'text-[#5D5D5D]',
  accent: 'text-[#B19CD9]', // Pastel Purple
};

interface Question {
  text: string;
  answer: number;
}

export default function App() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const generateQuestion = useCallback(() => {
    const isAddition = Math.random() > 0.5;
    let a, b, answer, text;

    if (isAddition) {
      a = Math.floor(Math.random() * 90) + 1;
      b = Math.floor(Math.random() * (100 - a)) + 1;
      answer = a + b;
      text = `${a} + ${b}`;
    } else {
      a = Math.floor(Math.random() * 90) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      text = `${a} - ${b}`;
    }

    // Generate options
    const newOptions = new Set<number>([answer]);
    while (newOptions.size < 4) {
      const distractor = answer + (Math.floor(Math.random() * 20) - 10);
      if (distractor >= 0 && distractor <= 100 && distractor !== answer) {
        newOptions.add(distractor);
      }
    }

    setQuestion({ text, answer });
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
    setStatus('idle');
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleChoice = (choice: number) => {
    if (status === 'success') return;

    if (choice === question?.answer) {
      setStatus('success');
      setScore(s => s + 1);
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setStatus('error');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setStatus('idle');
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.bg} font-sans flex flex-col items-center justify-center p-4 selection:bg-[#FAD0C4]`}>
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FAD0C4] rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#AEC6CF] rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Score Header */}
        <div className="flex justify-between items-center mb-8 px-4">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-lg text-gray-700">{score}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#AEC6CF]" />
            口算练习
          </h1>
        </div>

        {/* Main Question Box */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`${COLORS.card} rounded-[2rem] p-12 shadow-xl shadow-pink-100/50 border-4 border-white text-center relative overflow-hidden`}
          id="question-box"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={question?.text}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-8xl font-black text-gray-800 mb-4 tabular-nums"
            >
              {question?.text}
            </motion.div>
          </AnimatePresence>

          {/* Feedback Message */}
          <div className="h-12 flex items-center justify-center">
            {status === 'success' && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-green-500 font-bold text-2xl"
              >
                <Sparkles className="w-6 h-6 fill-current" />
                太棒了！
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div 
                initial={{ y: 10, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-red-400 font-bold text-xl"
              >
                <XCircle className="w-6 h-6" />
                再试一次
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8" id="options-grid">
          {options.map((option, idx) => (
            <motion.button
              key={`${question?.text}-${idx}`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice(option)}
              className={`
                h-20 text-3xl font-bold rounded-2xl shadow-lg border-2 border-white
                transition-colors duration-200
                ${status === 'success' && option === question?.answer ? 'bg-[#77DD77] text-white' : 
                  status === 'error' && option !== question?.answer ? 'bg-white text-gray-500 opacity-50' :
                  'bg-white text-gray-700 hover:bg-gray-50'}
                ${idx % 4 === 0 ? 'hover:border-[#FAD0C4]' : 
                  idx % 4 === 1 ? 'hover:border-[#AEC6CF]' : 
                  idx % 4 === 2 ? 'hover:border-[#B19CD9]' : 
                  'hover:border-[#FDFD96]'}
              `}
              id={`option-${idx}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer hint */}
      <p className="mt-12 text-gray-400 font-medium text-sm">
        做对一题会自动出下一题哦！加油！
      </p>
    </div>
  );
}
